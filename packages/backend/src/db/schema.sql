-- CKScope POC schema (source of truth)

-- Sync state (singleton row, id always 1)
CREATE TABLE IF NOT EXISTS sync_state (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    last_synced_block_number BIGINT NOT NULL DEFAULT 0,
    tip_block_number BIGINT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'idle',  -- idle | syncing | caught_up | reorg
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blocks
CREATE TABLE IF NOT EXISTS blocks (
    number BIGINT PRIMARY KEY,
    hash TEXT UNIQUE NOT NULL,
    timestamp BIGINT NOT NULL,
    parent_hash TEXT NOT NULL,
    transactions_count INT NOT NULL DEFAULT 0,
    miner_hash TEXT,
    size BIGINT
);
CREATE INDEX IF NOT EXISTS idx_blocks_number_desc ON blocks(number DESC);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
    hash TEXT PRIMARY KEY,
    block_number BIGINT NOT NULL REFERENCES blocks(number),
    block_index INT NOT NULL,
    version INT NOT NULL DEFAULT 0,
    inputs JSONB,
    outputs JSONB,
    witnesses JSONB,
    output_data JSONB
);
CREATE INDEX IF NOT EXISTS idx_tx_block_number ON transactions(block_number, block_index);
CREATE INDEX IF NOT EXISTS idx_tx_block_hash ON transactions(hash);

-- Cells (denormalized from transaction outputs)
CREATE TABLE IF NOT EXISTS cells (
    outpoint_tx_hash TEXT NOT NULL,
    outpoint_index INT NOT NULL,
    tx_hash TEXT NOT NULL REFERENCES transactions(hash),
    cell_index INT NOT NULL,
    capacity DECIMAL(40,0) NOT NULL,
    lock_code_hash TEXT,
    lock_hash_type TEXT,
    lock_args TEXT,
    type_code_hash TEXT,
    type_hash_type TEXT,
    type_args TEXT,
    block_number BIGINT NOT NULL REFERENCES blocks(number),
    status TEXT NOT NULL DEFAULT 'live',  -- live | consumed
    consumed_by_tx_hash TEXT,            -- tx that spent this cell (NULL if live)
    consumed_at_block_number BIGINT,     -- block where it was spent (NULL if live)
    PRIMARY KEY (outpoint_tx_hash, outpoint_index)
);

-- Idempotent upgrade for databases created before consumption tracking.
-- Must run BEFORE creating indexes on the new columns.
ALTER TABLE cells ADD COLUMN IF NOT EXISTS consumed_by_tx_hash TEXT;
ALTER TABLE cells ADD COLUMN IF NOT EXISTS consumed_at_block_number BIGINT;

CREATE INDEX IF NOT EXISTS idx_cells_lock_code_hash ON cells(lock_code_hash);
CREATE INDEX IF NOT EXISTS idx_cells_block_number ON cells(block_number);
CREATE INDEX IF NOT EXISTS idx_cells_tx_hash ON cells(tx_hash);
CREATE INDEX IF NOT EXISTS idx_cells_consumed_by_tx_hash ON cells(consumed_by_tx_hash);
CREATE INDEX IF NOT EXISTS idx_cells_consumed_at_block ON cells(consumed_at_block_number);

-- Ensure the singleton sync_state row exists
INSERT INTO sync_state (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
