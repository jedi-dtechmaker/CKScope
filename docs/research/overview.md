# Research Overview

## Problem

Exploring CKB today means using public block explorers or hitting public JSON-RPC endpoints. Both have limitations:

- Public RPC endpoints are slow, shared, and rate-limited — unsuitable for anything beyond light queries.
- Existing explorer approaches are often centralized, so users depend on infrastructure they don't control.

**Research question:** can a lightweight, JavaScript-native tool run locally, read CKB chain data directly, and present it through a clean web interface?

## Proposed approach

The core pipeline under investigation:

```
CKB Node → Sync → Query Store → REST API → Web UI
```

| Stage | Idea |
|-------|------|
| CKB Node | The user runs their own node (full or light). |
| Sync | Fetch blocks, normalize them, and cache them into a query store. |
| Query Store | A database optimized for explorer-style reads (lists, details, lookups). |
| REST API | A typed, paginated read API over the store. |
| Web UI | A React interface: block list, block detail, transaction detail. |

## Key technical decisions

| Decision | Rationale |
|----------|-----------|
| **Web app, not desktop** | Easier distribution, faster iteration, lower friction for users. |
| **PostgreSQL for caching** | CKB's data volume and query patterns need a real DB; SQLite was considered too limited. |
| **CCC for node access** | The maintained, future-facing CKB JS stack (Lumos is deprecated). |
| **TypeScript / Node.js** | The CCC ecosystem is JS/TS; one language across the stack. |
| **React for the frontend** | Modern, component-based, and works with CCC wallet connectors. |

## Direction for fast sync

For full-chain sync, JSON-RPC is too slow. The research direction is to **read the node's RocksDB directly** — a small sidecar that reads chain data from disk and streams it to the sync layer. This is expected to be orders of magnitude faster than RPC-based sync. It is identified as a later phase, not part of the initial validation.

## Validation plan

Before any full build:

1. Build a **minimal proof-of-concept** that connects to a CKB node, syncs a small window of blocks, stores them, and serves them through a simple UI.
2. Share it with the community for feedback.
3. Use that feedback to decide whether to pursue the full product.

## Open questions

- How to handle incremental sync without re-scanning everything?
- Best approach for reading RocksDB from a Node.js process?
- How to decode Molecule-serialized data from the node?
- How to structure sync state (tracking what has been indexed)?
- What pagination strategy fits the API best?
