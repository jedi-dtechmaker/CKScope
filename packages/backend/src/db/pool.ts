import pg from 'pg';
import { Kysely, PostgresDialect } from 'kysely';

// Parse BIGINT (OID 20) as a JS number — safe for block numbers/timestamps in
// the POC range. DECIMAL/numeric (OID 1700) stays a string, which is what we
// want for large capacities.
pg.types.setTypeParser(20, (v: string) => (v === null ? null : Number(v)));

export interface BlocksTable {
  number: number;
  hash: string;
  timestamp: number;
  parent_hash: string;
  transactions_count: number;
  miner_hash: string | null;
  size: number | null;
}

export interface TransactionsTable {
  hash: string;
  block_number: number;
  block_index: number;
  version: number;
  inputs: unknown;
  outputs: unknown;
  witnesses: unknown;
  output_data: unknown;
}

export interface CellsTable {
  outpoint_tx_hash: string;
  outpoint_index: number;
  tx_hash: string;
  cell_index: number;
  capacity: string;
  lock_code_hash: string | null;
  lock_hash_type: string | null;
  lock_args: string | null;
  type_code_hash: string | null;
  type_hash_type: string | null;
  type_args: string | null;
  block_number: number;
  status: string;
  consumed_by_tx_hash: string | null;
  consumed_at_block_number: number | null;
}

export interface SyncStateTable {
  id: number;
  last_synced_block_number: number;
  tip_block_number: number;
  status: 'idle' | 'syncing' | 'caught_up' | 'reorg';
  updated_at: Date | null;
}

export interface Database {
  blocks: BlocksTable;
  transactions: TransactionsTable;
  cells: CellsTable;
  sync_state: SyncStateTable;
}

const connectionString =
  process.env.DATABASE_URL ?? 'postgres://ckscope:ckscope@localhost:5432/ckscope';

export const pool = new pg.Pool({ connectionString });

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({ pool }),
});
