import { Hono } from 'hono';
import { blocksRouter } from './blocks.js';
import { cellsRouter } from './cells.js';
import { transactionsRouter } from './transactions.js';
import { syncRouter } from './sync.js';

export const api = new Hono();

api.get('/', (c) =>
  c.json({ data: { name: 'CKScope API', version: '0.1.0' } }),
);

api.route('/blocks', blocksRouter);
api.route('/cells', cellsRouter);
api.route('/transactions', transactionsRouter);
api.route('/sync', syncRouter);

// Catch-all 404 in the API envelope
api.notFound((c) =>
  c.json(
    { data: null, error: { code: 'NOT_FOUND', message: 'Not found' } },
    404,
  ),
);
