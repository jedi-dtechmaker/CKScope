# backend

Placeholder — planned role: **REST API + sync layer**.

Intended structure (Node.js / TypeScript):

```text
src/
├── api/            # REST routers (blocks, transactions, sync)
├── db/             # schema, connection pool, typed queries
├── sync/           # sync engine (CCC client, checkpointed batch sync)
└── scripts/        # migrate + sync runners
```

Key responsibilities:
- Connect to a CKB node (via CCC) and fetch chain data
- Sync and normalize blocks, transactions, and cells into the query store
- Serve a typed, paginated REST API over the store

This package is a planned component; no implementation is included here yet.
