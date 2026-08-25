# CKScope

**CKScope** is a local-first CKB explorer. This is the **POC** (v0.1) that proves the core architecture: connect to a CKB testnet node via **CCC**, sync a window of blocks into **PostgreSQL**, and serve them through a **REST API + React UI**.

```
CKB Node (RPC via CCC) → Sync Engine → PostgreSQL → REST API → React UI
```

The POC is the seed for the full grant demo described in [`plans/demo-architecture.md`](plans/demo-architecture.md) and the POC plan in [`plans/poc-plan.md`](plans/poc-plan.md).

---

## What the POC proves

- ✅ Connect to a CKB testnet node via `@ckb-ccc/core`
- ✅ Fetch and parse real blocks (100-block window from tip)
- ✅ Store blocks, transactions, and cells in PostgreSQL
- ✅ Incremental re-sync via a `sync_state` checkpoint
- ✅ Serve data through a typed REST API with cursor pagination
- ✅ Display blocks, block details, and transaction details in a React UI

**Deliberately out of scope (post-POC):** full-chain indexing, RocksDB reads, search, wallet connection, transaction building, cell visualization.

---

## Prerequisites

- **Node.js 20+** (tested on 24)
- **Docker** (for PostgreSQL) — or a local PostgreSQL 16

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL

With Docker Compose (recommended):

```bash
docker compose up -d postgres
```

No Compose plugin? Run the container directly:

```bash
docker run -d --name ckscope-pg \
  -e POSTGRES_USER=ckscope -e POSTGRES_PASSWORD=ckscope -e POSTGRES_DB=ckscope \
  -p 5432:5432 postgres:16-alpine
```

### 3. Configure (optional)

Copy the example env file if you need to override defaults:

```bash
cp packages/backend/.env.example packages/backend/.env
```

Defaults: `DATABASE_URL=postgres://ckscope:ckscope@localhost:5432/ckscope`, port `3000`, sync window `100`, batch size `50`.

### 4. Apply the schema

```bash
npm run migrate
```

### 5. Sync data from CKB testnet

```bash
npm run sync
```

First run backfills the last 100 blocks from the testnet tip. Re-running picks up new blocks incrementally. The sync is idempotent.

### 6. Run the backend API

```bash
npm run dev:backend
# API at http://localhost:3000/api
```

### 7. Run the frontend

```bash
npm run dev:frontend
# UI at http://localhost:5173
```

The Vite dev server proxies `/api` to the backend, so the UI works with no CORS setup.

---

## REST API

| Method | Path | Query | Purpose |
|--------|------|-------|---------|
| `GET` | `/api/blocks` | `?cursor=&limit=` | Newest-first block list (cursor paginated) |
| `GET` | `/api/blocks/:number` | — | Single block |
| `GET` | `/api/blocks/:number/transactions` | `?cursor=&limit=` | Transactions in a block |
| `GET` | `/api/transactions/:hash` | — | Full transaction detail |
| `GET` | `/api/sync/status` | — | Sync state |

All responses use the envelope `{ data, pagination?, error? }`.

Example:

```bash
curl "http://localhost:3000/api/blocks?limit=5"
```

---

## Project Structure

```
├── package.json                 # npm workspaces
├── docker-compose.yml           # PostgreSQL for local dev
├── packages/
│   ├── backend/                 # Hono API + Kysely + sync engine (CCC)
│   │   └── src/
│   │       ├── api/             # REST routes
│   │       ├── db/              # schema.sql, pool, Kysely queries
│   │       └── sync/            # CCC client + sync engine
│   ├── frontend/                # React 18 + Vite + Tailwind + TanStack Query
│   │   └── src/
│   │       ├── components/
│   │       ├── hooks/           # useBlocks, useBlock, useTransaction…
│   │       ├── pages/           # BlockList, BlockDetail, TransactionDetail
│   │       └── utils/           # CKB formatting helpers
│   └── shared/                  # Shared TypeScript types (Block, Tx, Cell, API)
└── plans/                       # Architecture + POC plans
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| CKB client | `@ckb-ccc/core` |
| Backend | Hono + Kysely + pg |
| Frontend | React 18 + Vite + Tailwind + TanStack Query |
| Database | PostgreSQL 16 |
| Language | TypeScript |

---

## Known Notes

- CCC's `ClientPublicTestnet` defaults can be slow/unreachable; the sync engine always passes an explicit URL (`https://testnet.ckb.dev/`) which can be overridden with `CKB_RPC_URL`.
- JSONB columns are written as `JSON.stringify`'d strings because node-postgres serializes raw JS arrays as Postgres array literals (invalid JSON for a JSONB column).

## Roadmap (post-POC)

1. Grant proposal
2. Direct RocksDB reads (Rust sidecar) replacing RPC
3. Full-chain incremental sync with reorg handling
4. CCC wallet connection + transaction building
5. Search + cell visualization
