import { Link } from 'react-router-dom';
import type { Block } from '@ckscope/shared';
import { formatRelativeTime, shortHash } from '../utils/formatters';

export function BlockCard({ block }: { block: Block }) {
  return (
    <Link
      to={`/blocks/${block.number}`}
      className="grid grid-cols-[1.2fr_1.2fr_.6fr] items-center gap-3 border-b border-[#182131] bg-[#0d121c]/70 px-4 py-3 transition last:border-b-0 hover:bg-[#102326]"
    >
      <div>
        <span className="font-mono text-base font-semibold text-[#37b7d0]">
          #{block.number.toLocaleString('en-US')}
        </span>
        <span className="ml-2 border border-[#215b63] bg-[#0c292c] px-1.5 py-0.5 text-[10px] font-medium text-[#35c9ad]">
          {block.transactions_count} txs
        </span>
      </div>
      <div className="min-w-0 text-sm text-[#778399]"><span className="font-mono text-[#31a5c0]">{shortHash(block.hash)}</span><span className="mt-1 block text-[10px] text-[#59657a]">Committed block</span></div>
      <div className="text-right text-[11px] text-[#6d7890]">{formatRelativeTime(block.timestamp)}</div>
    </Link>
  );
}
