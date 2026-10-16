import { sql } from 'kysely';
import { db, type TransactionsTable } from '../pool.js';
import type { Transaction, TransactionSummary } from '@ckscope/shared';

function toTransaction(row: TransactionsTable): Transaction {
  return {
    hash: row.hash,
    block_number: row.block_number,
    block_index: row.block_index,
    version: row.version,
    inputs: row.inputs as Transaction['inputs'],
    outputs: row.outputs as Transaction['outputs'],
    witnesses: row.witnesses as string[],
    output_data: row.output_data as string[],
  };
}

export async function listTransactionsByBlock(
  blockNumber: number,
  cursor: number | null,
  limit: number,
): Promise<Transaction[]> {
  let query = db
    .selectFrom('transactions')
    .selectAll()
    .where('block_number', '=', blockNumber)
    .orderBy('block_index', 'asc')
    .limit(limit);

  if (cursor !== null) {
    query = query.where('block_index', '>', cursor);
  }

  const rows = await query.execute();
  return rows.map(toTransaction);
}

export async function getTransactionByHash(
  hash: string,
): Promise<Transaction | undefined> {
  const row = await db
    .selectFrom('transactions')
    .selectAll()
    .where('hash', '=', hash)
    .executeTakeFirst();
  return row ? toTransaction(row) : undefined;
}

// Recent transactions across all blocks, newest first. Uses a tuple cursor
// (block_number, block_index) so pagination is exact within a block.
export async function listRecentTransactions(
  cursor: { blockNumber: number; blockIndex: number } | null,
  limit: number,
): Promise<TransactionSummary[]> {
  let query = db
    .selectFrom('transactions as t')
    .innerJoin('blocks as b', 'b.number', 't.block_number')
    .select(['t.hash', 't.block_number', 't.block_index', 'b.timestamp', 't.inputs', 't.outputs'])
    .orderBy('t.block_number', 'desc')
    .orderBy('t.block_index', 'desc')
    .limit(limit);

  if (cursor) {
    query = query.where(
      sql<boolean>`(t.block_number, t.block_index) < (${cursor.blockNumber}, ${cursor.blockIndex})`,
    );
  }

  const rows = await query.execute();
  return rows.map((r) => {
    const inputs = (r.inputs as unknown) as unknown[];
    const outputs = (r.outputs as unknown) as { capacity: string }[];
    const total = outputs.reduce((acc, o) => acc + BigInt(o.capacity), 0n);
    return {
      hash: r.hash,
      block_number: r.block_number,
      block_index: r.block_index,
      timestamp: r.timestamp,
      inputs_count: inputs.length,
      outputs_count: outputs.length,
      capacity: total.toString(),
    };
  });
}
