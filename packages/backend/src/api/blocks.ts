import { Hono } from 'hono';
import { listBlocks, getBlockByNumber } from '../db/queries/blocks.js';
import { listTransactionsByBlock } from '../db/queries/transactions.js';
import { decodeCursor, encodeCursor } from './cursor.js';

export const blocksRouter = new Hono();

// GET /api/blocks?cursor=&limit=
blocksRouter.get('/', async (c) => {
  const limit = Math.min(Math.max(Number(c.req.query('limit') ?? 20), 1), 100);
  const cursor = decodeCursor(c.req.query('cursor'));

  const blocks = await listBlocks(cursor, limit + 1);
  const hasMore = blocks.length > limit;
  const page = blocks.slice(0, limit);
  const nextCursor =
    hasMore && page.length > 0 ? encodeCursor(page[page.length - 1].number) : null;

  return c.json({
    data: page,
    pagination: { next_cursor: nextCursor, has_more: hasMore },
  });
});

// GET /api/blocks/:number
blocksRouter.get('/:number', async (c) => {
  const number = Number(c.req.param('number'));
  if (!Number.isInteger(number) || number < 0) {
    return c.json(
      { data: null, error: { code: 'BAD_REQUEST', message: 'Invalid block number' } },
      400,
    );
  }
  const block = await getBlockByNumber(number);
  if (!block) {
    return c.json(
      { data: null, error: { code: 'NOT_FOUND', message: `Block ${number} not found` } },
      404,
    );
  }
  return c.json({ data: block });
});

// GET /api/blocks/:number/transactions?cursor=&limit=
blocksRouter.get('/:number/transactions', async (c) => {
  const number = Number(c.req.param('number'));
  const limit = Math.min(Math.max(Number(c.req.query('limit') ?? 20), 1), 100);
  const cursor = decodeCursor(c.req.query('cursor'));

  const txs = await listTransactionsByBlock(number, cursor, limit + 1);
  const hasMore = txs.length > limit;
  const page = txs.slice(0, limit);
  const nextCursor =
    hasMore && page.length > 0 ? encodeCursor(page[page.length - 1].block_index) : null;

  return c.json({
    data: page,
    pagination: { next_cursor: nextCursor, has_more: hasMore },
  });
});
