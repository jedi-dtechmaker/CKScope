import { sql } from 'kysely';
import { db } from '../pool.js';
import type { Cell } from '@ckscope/shared';

// Minimal POC query. Rich cell filtering is a post-POC feature.
export async function listCellsByTxHash(txHash: string): Promise<Cell[]> {
  return db
    .selectFrom('cells')
    .selectAll()
    .where('tx_hash', '=', txHash)
    .orderBy('cell_index', 'asc')
    .execute();
}

// Single cell by outpoint (for cell detail / lifecycle view).
export async function getCellByOutpoint(
  outpointTxHash: string,
  outpointIndex: number,
): Promise<Cell | undefined> {
  return db
    .selectFrom('cells')
    .selectAll()
    .where('outpoint_tx_hash', '=', outpointTxHash)
    .where('outpoint_index', '=', outpointIndex)
    .executeTakeFirst();
}

// Cell list, newest block first, with optional status filter. Uses a tuple
// cursor (block_number, outpoint_tx_hash, outpoint_index) for exact pagination.
export async function listCells(
  status: string | null,
  cursor: { blockNumber: number; txHash: string; index: number } | null,
  limit: number,
): Promise<Cell[]> {
  let query = db
    .selectFrom('cells')
    .selectAll()
    .orderBy('block_number', 'desc')
    .orderBy('outpoint_tx_hash', 'desc')
    .orderBy('outpoint_index', 'desc')
    .limit(limit);

  if (status) {
    query = query.where('status', '=', status);
  }
  if (cursor) {
    query = query.where(
      sql<boolean>`(block_number, outpoint_tx_hash, outpoint_index) < (${cursor.blockNumber}, ${cursor.txHash}, ${cursor.index})`,
    );
  }

  return query.execute();
}
