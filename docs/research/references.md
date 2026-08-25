# References

Projects and resources that informed the direction of this research.

## Related projects

- **ckb-indexer** — an earlier JavaScript indexer attempt for CKB. Useful as a reference for what to learn from: https://github.com/ckb-devrel/ckb-indexer
- **CKBadger** — a local-first, CKB-native explorer built as an experiment. Inspiration for the explorer approach and the community discussion around it: https://talk.nervos.org/t/ckbadger-a-local-first-ckb-native-explorer-and-a-vibe-coding-experiment/10276

## Ecosystem

- **CCC (CKB Common Client / Common Connector)** — the maintained JavaScript/TypeScript stack for talking to CKB nodes and wallets.
- **Nervos CKB documentation** — chain data structures, JSON-RPC, and Molecule serialization.

## Community input

- Early feedback from the CKB/CCC ecosystem confirmed the project fills a real gap.
- Guidance received: use PostgreSQL for caching, prefer reading the node's RocksDB directly for performance, and use CCC for wallet and transaction building.
