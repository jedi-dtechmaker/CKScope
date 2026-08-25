# CKScope — Research & Design

**Status:** Early research phase · exploring the architecture, no release yet

CKScope is a **local-first CKB explorer** — an idea being researched to answer a simple question: *can a lightweight, JavaScript-native tool read CKB chain data directly and present it through a clean web interface?*

This repository is intentionally lightweight. It contains **research notes, proposed architecture, and the intended project structure** — not implementation code. The goal is to share direction and gather community feedback before committing to a full build.

---

## Why this project?

Public explorers depend on slow, rate-limited JSON-RPC endpoints. CKScope explores a different path:

- **Local-first** — you run it against a node you control
- **Fast reads** — eventually reading the node's RocksDB directly instead of RPC
- **JS-native** — built on the CCC ecosystem, no separate heavy toolchain

## Research highlights

- **PostgreSQL as the query store** (recommended over SQLite for CKB's data volume)
- **CCC for node access** — the maintained, future-facing CKB JavaScript stack
- **RocksDB reads** identified as the performance path for full sync
- Proposed pipeline: **CKB Node → Sync → Query Store → REST API → Web UI**

## Repository structure

```text
research-repo/
├── README.md                # this file
├── research/                # research notes + references
│   ├── overview.md
│   └── references.md
├── docs/                    # proposed design
│   ├── architecture.md
│   ├── data-model.md
│   └── roadmap.md
└── packages/                # intended structure (skeleton)
    ├── backend/
    ├── frontend/
    └── shared/
```

## Where this is heading

1. Gather community feedback on the direction
2. Build a minimal proof-of-concept to validate the architecture
3. If validated, develop it into a public explorer

Feedback and discussion are very welcome.
