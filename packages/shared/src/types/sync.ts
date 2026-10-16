// Sync engine state as served by /api/sync/status
export interface SyncStatus {
  status: 'idle' | 'syncing' | 'caught_up' | 'reorg';
  last_synced_block_number: number;
  tip_block_number: number;
  total_blocks: number;
  updated_at: string | null;
}
