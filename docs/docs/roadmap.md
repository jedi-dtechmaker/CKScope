# Proposed Roadmap

A tentative, phase-based plan. Nothing here is committed; the next concrete step is community feedback on the direction.

## Phase 0 — Validation

- Build a minimal proof-of-concept that proves the core loop:
  - connect to a CKB node
  - sync a small window of blocks
  - store them in a query store
  - serve them through a simple web UI
- Outcome: evidence the architecture is viable.

## Phase 1 — Community feedback

- Share the POC and direction with the community (forums, Discord).
- Collect feedback on scope, features, and priorities.

## Phase 2 — Fast full-chain sync

- Replace RPC fetching with direct **RocksDB** reads via a sidecar.
- Full-chain incremental sync with reorg handling and crash recovery.

## Phase 3 — Wallet & transactions

- Integrate a CCC wallet connector.
- Transaction building from the explorer UI.

## Phase 4 — Explorer depth

- Smart search (hash / block number / address auto-detect).
- Address views and cell visualization.
- Balance summaries.

## Non-goals for the first validation

- Full-chain indexing
- Wallet / transaction building
- Search
- Cell visualization
