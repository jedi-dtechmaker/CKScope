# Proposed Data Model

This is the proposed query-store schema. It is a design proposal, not a description of released software.

## Entities

```mermaid
erDiagram
    BLOCKS ||--o{ TRANSACTIONS : contains
    TRANSACTIONS ||--o{ CELLS : produces
    SYNC_STATE {
        int id PK
        bigint last_synced_block_number
        bigint tip_block_number
        text status
        timestamptz updated_at
    }
    BLOCKS {
        bigint number PK
        text hash UK
        bigint timestamp
        text parent_hash
        int transactions_count
        text miner_hash
        bigint size
    }
    TRANSACTIONS {
        text hash PK
        bigint block_number FK
        int block_index
        int version
        jsonb inputs
        jsonb outputs
        jsonb witnesses
        jsonb output_data
    }
    CELLS {
        text outpoint_tx_hash PK
        int outpoint_index PK
        text tx_hash FK
        int cell_index
        decimal capacity
        text lock_code_hash
        text lock_hash_type
        text lock_args
        text type_code_hash
        text type_hash_type
        text type_args
        bigint block_number FK
        text status
    }
```

## Design decisions

| Decision | Rationale |
|----------|-----------|
| `inputs`, `outputs`, `witnesses`, `output_data` as JSONB | Flexible; the schema survives CKB upgrades. |
| `cells` denormalized from outputs | Queried independently of transactions, keeping explorer reads fast. |
| `capacity` as DECIMAL(40,0) | CKB capacities are u64 shannons; no precision loss. |
| Hashes as TEXT | Readable hex strings, index-friendly. |
| `sync_state` singleton | A single checkpoint for incremental, resumable sync. |
| `cells.status` (live / consumed) | Future-proofing for address/balance views. |

## Proposed indexes

- `blocks(number DESC)` — newest-first list queries
- `transactions(block_number, block_index)` — transactions within a block
- `transactions(hash)` — transaction lookup
- `cells(lock_code_hash)` — address-style lookups
- `cells(block_number)` — cells by block
- `cells(tx_hash)` — cells produced by a transaction
