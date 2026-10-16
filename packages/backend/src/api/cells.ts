import { Hono } from 'hono';
import { getCellByOutpoint, listCells } from '../db/queries/cells.js';
import { decodeTupleCursor, encodeTupleCursor } from './cursor.js';

export const cellsRouter = new Hono();

const HASH_RE = /^0x[0-9a-f]{64}$/;

// GET /api/cells?status=live|consumed&cursor=&limit=
cellsRouter.get('/', async (c) => {
  const limit = Math.min(Math.max(Number(c.req.query('limit') ?? 20), 1), 100);
  const statusParam = c.req.query('status');
  const status =
    statusParam === 'live' || statusParam === 'consumed' ? statusParam : null;

  const parts = decodeTupleCursor(c.req.query('cursor'));
  const cursor =
    parts && parts.length === 3
      ? { blockNumber: Number(parts[0]), txHash: parts[1], index: Number(parts[2]) }
      : null;

  const cells = await listCells(status, cursor, limit + 1);
  const hasMore = cells.length > limit;
  const page = cells.slice(0, limit);
  const last = page[page.length - 1];
  const nextCursor =
    hasMore && last
      ? encodeTupleCursor([last.block_number, last.outpoint_tx_hash, last.outpoint_index])
      : null;

  return c.json({
    data: page,
    pagination: { next_cursor: nextCursor, has_more: hasMore },
  });
});

// GET /api/cells/:outpoint_tx_hash/:outpoint_index
cellsRouter.get('/:txHash/:index', async (c) => {
  const txHash = c.req.param('txHash').toLowerCase();
  const index = Number(c.req.param('index'));

  if (!HASH_RE.test(txHash) || !Number.isInteger(index) || index < 0) {
    return c.json(
      { data: null, error: { code: 'BAD_REQUEST', message: 'Invalid outpoint' } },
      400,
    );
  }

  const cell = await getCellByOutpoint(txHash, index);
  if (!cell) {
    return c.json(
      { data: null, error: { code: 'NOT_FOUND', message: 'Cell not found' } },
      404,
    );
  }

  return c.json({ data: cell });
});
