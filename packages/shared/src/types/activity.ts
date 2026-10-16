// Lightweight transaction summary for the recent-activity feed (no heavy JSONB).
export interface TransactionSummary {
  hash: string;
  block_number: number;
  block_index: number;
  timestamp: number; // ms since epoch (from the block)
  inputs_count: number;
  outputs_count: number;
  capacity: string; // total output capacity in shannons (decimal)
}
