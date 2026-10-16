// Block as served by the REST API (flattened from CKB header + summary)
export interface Block {
  number: number;
  hash: string;
  timestamp: number; // ms since epoch
  parent_hash: string;
  transactions_count: number;
  miner_hash: string | null;
  size: number | null;
}
