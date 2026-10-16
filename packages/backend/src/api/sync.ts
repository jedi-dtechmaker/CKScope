import { Hono } from 'hono';
import { getSyncState } from '../sync/engine.js';
import { getTotalBlocks } from '../db/queries/blocks.js';
import type { SyncStatus } from '@ckscope/shared';

export const syncRouter = new Hono();

// GET /api/sync/status
syncRouter.get('/status', async (c) => {
  const state = await getSyncState();
  const total = await getTotalBlocks();

  const data: SyncStatus = {
    status: state?.status ?? 'idle',
    last_synced_block_number: state?.last_synced_block_number ?? 0,
    tip_block_number: state?.tip_block_number ?? 0,
    total_blocks: total,
    updated_at: state?.updated_at ? state.updated_at.toISOString() : null,
  };

  return c.json({ data });
});
