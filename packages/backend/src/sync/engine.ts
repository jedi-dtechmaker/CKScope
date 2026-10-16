import type { ClientBlock, ClientPublicTestnet } from '@ckb-ccc/core';
import { db, type Database } from '../db/pool.js';
import { createClient } from './client.js';

const WINDOW = Number(process.env.SYNC_WINDOW ?? 100);
const BATCH_SIZE = Number(process.env.SYNC_BATCH_SIZE ?? 50);

export type SyncState = Database['sync_state'];

export interface SyncResult {
  status: SyncState['status'];
  synced: number;
  from: number;
  to: number;
}

export async function getSyncState(): Promise<SyncState | undefined> {
  return db
    .selectFrom('sync_state')
    .selectAll()
    .where('id', '=', 1)
    .executeTakeFirst();
}

async function setStatus(
  status: SyncState['status'],
  lastSynced: number,
  tip: number,
): Promise<void> {
  await db
    .updateTable('sync_state')
    .set({
      status,
      last_synced_block_number: lastSynced,
      tip_block_number: tip,
      updated_at: new Date(),
    })
    .where('id', '=', 1)
    .execute();
}

function toBlockRow(block: ClientBlock) {
  return {
    number: Number(block.header.number),
    hash: block.header.hash,
    timestamp: Number(block.header.timestamp),
    parent_hash: block.header.parentHash,
    transactions_count: block.transactions.length,
    miner_hash: null as string | null,
    size: null as number | null,
  };
}

function toTransactionRows(block: ClientBlock, blockNumber: number) {
  return block.transactions.map((tx, i) => ({
    hash: tx.hash(),
    block_number: blockNumber,
    block_index: i,
    version: Number(tx.version),
    // JSONB columns must be passed as JSON-encoded strings: passing raw JS
    // objects/arrays makes pg serialize arrays as Postgres array literals
    // (comma-joined, no brackets), which PostgreSQL rejects as invalid JSON.
    inputs: JSON.stringify(
      tx.inputs.map((input) => ({
        since: input.since.toString(),
        previous_output: {
          tx_hash: input.previousOutput.txHash,
          index: input.previousOutput.index.toString(),
        },
      })),
    ),
    outputs: JSON.stringify(
      tx.outputs.map((output) => ({
        capacity: output.capacity.toString(),
        lock: {
          code_hash: output.lock.codeHash,
          hash_type: output.lock.hashType,
          args: output.lock.args,
        },
        type: output.type
          ? {
              code_hash: output.type.codeHash,
              hash_type: output.type.hashType,
              args: output.type.args,
            }
          : null,
      })),
    ),
    witnesses: JSON.stringify(tx.witnesses),
    output_data: JSON.stringify(tx.outputsData),
  }));
}

function toCellRows(block: ClientBlock, blockNumber: number) {
  const rows: Database['cells'][] = [];
  for (const tx of block.transactions) {
    const txHash = tx.hash();
    tx.outputs.forEach((output, j) => {
      rows.push({
        outpoint_tx_hash: txHash,
        outpoint_index: j,
        tx_hash: txHash,
        cell_index: j,
        capacity: output.capacity.toString(),
        lock_code_hash: output.lock.codeHash,
        lock_hash_type: output.lock.hashType,
        lock_args: output.lock.args,
        type_code_hash: output.type?.codeHash ?? null,
        type_hash_type: output.type?.hashType ?? null,
        type_args: output.type?.args ?? null,
        block_number: blockNumber,
        status: 'live',
        consumed_by_tx_hash: null,
        consumed_at_block_number: null,
      });
    });
  }
  return rows;
}

async function insertBatch(blocks: ClientBlock[]): Promise<void> {
  await db.transaction().execute(async (tx) => {
    for (const block of blocks) {
      const number = Number(block.header.number);
      await tx
        .insertInto('blocks')
        .values(toBlockRow(block))
        .onConflict((oc) => oc.column('number').doNothing())
        .execute();

      const txRows = toTransactionRows(block, number);
      if (txRows.length > 0) {
        await tx
          .insertInto('transactions')
          .values(txRows)
          .onConflict((oc) => oc.column('hash').doNothing())
          .execute();
      }

      const cellRows = toCellRows(block, number);
      if (cellRows.length > 0) {
        await tx
          .insertInto('cells')
          .values(cellRows)
          .onConflict((oc) =>
            oc.columns(['outpoint_tx_hash', 'outpoint_index']).doNothing(),
          )
          .execute();
      }

      // Consumption pass: mark cells spent by this block's transaction inputs.
      // Runs after cell insertion so cells created within the same block are
      // already present. The cellbase marker input (all-zero tx_hash, index
      // 4294967295) is skipped: its index exceeds int32 and cannot reference
      // a stored cell (whose outpoint_index column is INT).
      for (const blockTx of block.transactions) {
        const txHash = blockTx.hash();
        for (const input of blockTx.inputs) {
          const prevIndex = Number(input.previousOutput.index);
          if (prevIndex < 0 || prevIndex > 2147483647) continue;
          await tx
            .updateTable('cells')
            .set({
              status: 'consumed',
              consumed_by_tx_hash: txHash,
              consumed_at_block_number: number,
            })
            .where('outpoint_tx_hash', '=', input.previousOutput.txHash)
            .where('outpoint_index', '=', prevIndex)
            .where('status', '=', 'live')
            .execute();
        }
      }
    }
  });
}

export async function runSync(
  opts?: { window?: number; batchSize?: number },
): Promise<SyncResult> {
  const client: ClientPublicTestnet = createClient();
  const windowSize = opts?.window ?? WINDOW;
  const batchSize = opts?.batchSize ?? BATCH_SIZE;

  const state = await getSyncState();
  const tip = await client.getTipHeader();
  const tipNumber = Number(tip.number);

  // First run: backfill a window from the tip.
  // Subsequent runs: incremental from last synced + 1.
  const start =
    state && state.last_synced_block_number > 0
      ? state.last_synced_block_number + 1
      : Math.max(0, tipNumber - windowSize + 1);

  const lastSynced = state?.last_synced_block_number ?? 0;

  if (start > tipNumber) {
    await setStatus('caught_up', lastSynced, tipNumber);
    return { status: 'caught_up', synced: 0, from: start, to: tipNumber };
  }

  await setStatus('syncing', lastSynced, tipNumber);

  let current = start;
  let synced = 0;

  while (current <= tipNumber) {
    const end = Math.min(current + batchSize - 1, tipNumber);
    const numbers: number[] = [];
    for (let n = current; n <= end; n++) numbers.push(n);

    // Fetch the batch in parallel.
    const fetched = await Promise.all(
      numbers.map((n) => client.getBlockByNumber(n)),
    );
    const blocks = fetched.filter(
      (b): b is ClientBlock => b !== undefined,
    );

    // Simple reorg guard: consecutive blocks must be parent-linked.
    for (let i = 1; i < blocks.length; i++) {
      if (blocks[i].header.parentHash !== blocks[i - 1].header.hash) {
        await setStatus('reorg', state?.last_synced_block_number ?? 0, tipNumber);
        return { status: 'reorg', synced, from: start, to: current - 1 };
      }
    }

    await insertBatch(blocks);
    synced += blocks.length;
    current = end + 1;
    console.log(`  synced up to block ${end} (${synced} total)`);
  }

  await setStatus('caught_up', tipNumber, tipNumber);
  return { status: 'caught_up', synced, from: start, to: tipNumber };
}
