import { db } from '../pool.js';
import type { Block } from '@ckscope/shared';

// Cursor-based pagination, newest first:
//   WHERE number < :cursor ORDER BY number DESC LIMIT :limit
export async function listBlocks(
  cursor: number | null,
  limit: number,
): Promise<Block[]> {
  let query = db
    .selectFrom('blocks')
    .select([
      'number',
      'hash',
      'timestamp',
      'parent_hash',
      'transactions_count',
      'miner_hash',
      'size',
    ])
    .orderBy('number', 'desc')
    .limit(limit);

  if (cursor !== null) {
    query = query.where('number', '<', cursor);
  }

  return query.execute();
}

export async function getBlockByNumber(
  number: number,
): Promise<Block | undefined> {
  return db
    .selectFrom('blocks')
    .select([
      'number',
      'hash',
      'timestamp',
      'parent_hash',
      'transactions_count',
      'miner_hash',
      'size',
    ])
    .where('number', '=', number)
    .executeTakeFirst();
}

export async function getTotalBlocks(): Promise<number> {
  const row = await db
    .selectFrom('blocks')
    .select(db.fn.countAll().as('total'))
    .executeTakeFirstOrThrow();
  return Number(row.total);
}
