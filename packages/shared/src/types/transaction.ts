// Outpoint referencing a previous transaction output
export interface OutPoint {
  tx_hash: string;
  index: string; // hex-encoded u32 index
}

// A lock/type script
export interface Script {
  code_hash: string;
  hash_type: string;
  args: string;
}

// An input to a transaction
export interface CellInput {
  since: string; // hex
  previous_output: OutPoint;
}

// A cell output
export interface CellOutput {
  capacity: string; // hex-encoded u64 shannons
  lock: Script;
  type: Script | null;
}

// Transaction as served by the REST API
// Raw fields are preserved as parsed from the node so the UI can render them.
export interface Transaction {
  hash: string;
  block_number: number;
  block_index: number;
  version: number;
  inputs: CellInput[];
  outputs: CellOutput[];
  witnesses: string[];
  output_data: string[]; // hex-encoded data blobs
}
