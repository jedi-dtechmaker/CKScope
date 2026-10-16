import { Hono } from 'hono';
import {
  getTransactionByHash,
  listRecentTransactions,
} from '../db/queries/transactions.js';
import { decodeTupleCursor, encodeTupleCursor } from './cursor.js';

export const transactionsRouter = new Hono();

// GET /api/transactions?cursor=&limit=  (recent activity feed)
transactionsRouter.get('/', async (c) => {
  const limit = Math.min(Math.max(Number(c.req.query('limit') ?? 20), 1), 100);

  const parts = decodeTupleCursor(c.req.query('cursor'));
  const cursor =
    parts && parts.length === 2
      ? { blockNumber: Number(parts[0]), blockIndex: Number(parts[1]) }
      : null;

  const txs = await listRecentTransactions(cursor, limit + 1);
  const hasMore = txs.length > limit;
  const page = txs.slice(0, limit);
  const last = page[page.length - 1];
  const nextCursor =
    hasMore && last ? encodeTupleCursor([last.block_number, last.block_index]) : null;

  return c.json({
    data: page,
    pagination: { next_cursor: nextCursor, has_more: hasMore },
  });
});

// GET /api/transactions/:hash
transactionsRouter.get('/:hash', async (c) => {
  const hash = c.req.param('hash').toLowerCase();
  if (!/^0x[0-9a-f]{64}$/.test(hash)) {
    return c.json(
      { data: null, error: { code: 'BAD_REQUEST', message: 'Invalid transaction hash' } },
      400,
    );
  }
  const tx = await getTransactionByHash(hash);
  if (!tx) {
    return c.json(
      { data: null, error: { code: 'NOT_FOUND', message: 'Transaction not found' } },
      404,
    );
  }
  return c.json({ data: tx });
});
