// One-time sync runner: `npm run sync -w @ckscope/backend`
// Backfills a window of blocks from testnet tip on first run, then stays
// incremental on subsequent runs. Idempotent — safe to re-run.
import { runSync } from '../sync/engine.js';
import { pool } from '../db/pool.js';

async function main() {
  console.log('Starting CKScope sync…');
  const started = Date.now();
  const result = await runSync();
  const elapsed = ((Date.now() - started) / 1000).toFixed(1);
  console.log(
    `Done: ${result.synced} blocks synced (${result.from} → ${result.to}), ` +
      `status=${result.status}, in ${elapsed}s`,
  );
}

main()
  .catch((err) => {
    console.error('Sync failed:', err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
