import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useBlocks } from '../hooks/useBlocks';
import { EmptyState, ErrorState, SkeletonList } from '../components/AsyncState';
import { formatRelativeTime, shortHash } from '../utils/formatters';

function Panel({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return <section className={`dash-panel ${className}`}><div className="dash-title"><span className="dash-dot" />{title}</div>{children}</section>;
}

function LineChart({ values }: { values: number[] }) {
  if (!values.length) return <p className="chart-empty">Not enough indexed blocks to plot a series.</p>;
  const max = Math.max(...values, 1); const min = Math.min(...values, 0); const range = Math.max(max - min, 1);
  const points = values.map((value, index) => `${(index / Math.max(values.length - 1, 1)) * 380},${90 - ((value - min) / range) * 70}`).join(' ');
  return <svg viewBox="0 0 380 100" preserveAspectRatio="none" className="h-24 w-full overflow-visible"><path d="M0 24H380M0 52H380M0 80H380" stroke="#1a2637" strokeWidth="1" /><polyline points={points} fill="none" stroke="#24c29f" strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg>;
}

function BarChart({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return <div className="flex h-14 items-end gap-[3px] px-1 pt-1">{values.map((value, i) => <i key={i} className="flex-1 bg-[#23a989]" style={{ height: `${Math.max(5, value / max * 100)}%` }} />)}</div>;
}

function formatCapacity(shannons: string) {
  const ckb = Number(BigInt(shannons) / 100_000_000n);
  return Number.isFinite(ckb) ? `${ckb.toLocaleString('en-US')} CKB` : '—';
}

export function BlockList() {
  const { data: response, isLoading, isError, error } = useBlocks();
  const blocks = response?.data ?? [];
  if (isLoading) return <SkeletonList count={7} />;
  if (isError) return <ErrorState message={(error as Error).message} />;
  if (!blocks.length) return <EmptyState message="No blocks are indexed yet. Run the sync process to populate the dashboard." />;
  const latest = blocks[0];
  const ordered = [...blocks].reverse();
  const blockTimes = ordered.slice(1).map((block, index) => Math.max(0, (block.timestamp - ordered[index].timestamp) / 1_000));
  const averageBlockTime = blockTimes.length ? blockTimes.reduce((sum, seconds) => sum + seconds, 0) / blockTimes.length : null;
  const cutoffHour = Date.now() - 60 * 60 * 1_000;
  const cutoffDay = Date.now() - 24 * 60 * 60 * 1_000;
  const transactionsLastHour = blocks.filter((block) => block.timestamp >= cutoffHour).reduce((sum, block) => sum + block.transactions_count, 0);
  const transactionsLastDay = blocks.filter((block) => block.timestamp >= cutoffDay).reduce((sum, block) => sum + block.transactions_count, 0);
  const totalTransactions = blocks.reduce((sum, block) => sum + block.transactions_count, 0);
  const rangeLabel = `#${blocks.at(-1)?.number.toLocaleString()} – #${latest.number.toLocaleString()}`;
  const txPerBlock = blocks.map((block) => block.transactions_count).reverse();

  return <div className="dashboard">
    <div className="mb-1 flex flex-wrap items-center justify-between gap-2 text-[10px] uppercase tracking-[.1em] text-[#66748a]"><span>Dashboard / locally indexed data</span><span>Indexed range <b className="text-[#27c09f]">{rangeLabel}</b></span></div>
    <div className="grid gap-3 lg:grid-cols-2">
      <Panel title="Latest block">
        <div className="metric-row"><div><strong className="metric-teal">{latest.number.toLocaleString('en-US')}</strong><span>Latest Indexed Block</span></div><div className="text-right"><strong className="metric-amber">{averageBlockTime?.toFixed(2) ?? '—'}s</strong><span>Average Block Time</span></div></div>
        <p className="chart-label">Block time — latest loaded intervals</p><LineChart values={blockTimes.slice(-14)} />
      </Panel>
      <Panel title="Indexed transactions">
        <div className="metric-row"><div><strong className="metric-teal">{transactionsLastHour.toLocaleString()}</strong><span>Transactions in loaded blocks, last hour</span></div><div className="text-right"><strong className="metric-amber">{transactionsLastDay.toLocaleString()}</strong><span>Transactions in loaded blocks, last 24 hours</span></div></div>
        <p className="chart-label">Transactions per latest indexed block</p><BarChart values={txPerBlock} />
      </Panel>
      <Panel title="Loaded block window">
        <div className="metric-row"><div><strong className="metric-teal">{blocks.length}</strong><span>Blocks returned by API</span></div><div className="text-right"><strong className="metric-amber">{totalTransactions.toLocaleString()}</strong><span>Transactions in loaded blocks</span></div></div>
        <p className="chart-empty mt-7">Capacity and total CKB circulation are not provided by the existing blocks API.</p>
      </Panel>
      <Panel title="Index status">
        <div className="metric-row"><div><strong className="metric-teal">{latest.transactions_count}</strong><span>Transactions in latest block</span></div><div className="text-right"><strong className="metric-amber">{latest.size ?? '—'}</strong><span>Latest Block Size</span></div></div>
        <div className="mt-7 border-t border-[#1b2940] pt-3 text-[10px] leading-5 text-[#758196]">Hash rate, difficulty, DAO balances, mempool and global transactions are not supplied by the existing API.</div>
      </Panel>
    </div>

    <div className="mt-3 grid gap-3 lg:grid-cols-2">
      <Panel title="Recent loaded blocks" className="activity-panel"><Link to="/" className="view-all">BLOCK API</Link>{blocks.slice(0, 8).map((block) => <Link key={block.number} to={`/blocks/${block.number}`} className="activity-row"><div><span>{shortHash(block.hash, 11, 6)} · Block #{block.number.toLocaleString()}</span><b className="text-[#25bc9e]">◦ Committed Block</b><small>{block.transactions_count} transactions</small></div><div className="text-right"><span>{formatRelativeTime(block.timestamp)}</span><b className="text-[#c6a142]">View details →</b></div></Link>)}</Panel>
      <Panel title="Data availability" className="stats-panel"><div className="space-y-3 px-4 py-4 text-xs leading-5 text-[#738096]"><p><b className="text-[#25bc9e]">● Available</b><br />Block number, hash, timestamp, transaction count and size.</p><p><b className="text-[#d4a943]">● Not in current API</b><br />Transactions across blocks, cell capacity, scripts, DAO, hash rate, difficulty and mempool.</p></div></Panel>
    </div>

    <section className="pipeline"><h2>Loaded Block Timeline</h2><p>Latest blocks supplied by the existing blocks endpoint.</p><div className="pipeline-flow">{blocks.slice(0, 5).reverse().map((block, i) => <Link className="pipe-unit" to={`/blocks/${block.number}`} key={block.number}><b>{block.number.toLocaleString()}</b><i className={i === 4 ? 'amber' : ''} /><small>{block.transactions_count} txs<br />{formatRelativeTime(block.timestamp)}</small></Link>)}</div></section>

    <div className="mt-5 grid gap-3 lg:grid-cols-2"><Panel title="Latest Blocks"><div className="latest-list">{blocks.slice(0, 8).map(block => <Link to={`/blocks/${block.number}`} key={block.number}><b># {block.number.toLocaleString()}</b><span>{shortHash(block.hash, 10, 6)}</span><small>{block.transactions_count} txs · {formatRelativeTime(block.timestamp)}</small></Link>)}</div></Panel><Panel title="Block Details"><div className="px-4 py-5 text-xs leading-6 text-[#728096]">Select any loaded block to see its real transactions and output details. A global transaction feed has not been added because it is not part of the current backend contract.</div></Panel></div>
  </div>;
}
