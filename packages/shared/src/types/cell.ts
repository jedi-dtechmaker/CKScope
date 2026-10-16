// Denormalized cell (from a transaction output) as served by the REST API
export interface Cell {
  outpoint_tx_hash: string;
  outpoint_index: number;
  tx_hash: string;
  cell_index: number;
  capacity: string; // decimal shannons (DECIMAL from PostgreSQL)
  lock_code_hash: string | null;
  lock_hash_type: string | null;
  lock_args: string | null;
  type_code_hash: string | null;
  type_hash_type: string | null;
  type_args: string | null;
  block_number: number;
  status: string; // live | consumed
  // Consumption tracking (NULL while the cell is live)
  consumed_by_tx_hash: string | null;
  consumed_at_block_number: number | null;
}
