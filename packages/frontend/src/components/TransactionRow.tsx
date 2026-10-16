import { Link } from 'react-router-dom';
import type { Transaction } from '@ckscope/shared';
import { formatCkb, shortHash } from '../utils/formatters';

export function TransactionRow({ tx }: { tx: Transaction }) {
  const total = tx.outputs.reduce((acc, o) => acc + BigInt(o.capacity), 0n);

  return (
    <Link
      to={`/tx/${tx.hash}`}
      className="flex items-center justify-between border border-[#1c2637] bg-[#0d121c]/90 px-4 py-3 transition hover:border-[#278d80] hover:bg-[#102326]"
    >
      <span className="font-mono text-[#2cbb9d]">{shortHash(tx.hash)}</span>
      <div className="flex items-center gap-4 text-sm text-[#7a8699]">
        <span>⤵ {tx.inputs.length}</span>
        <span>⤴ {tx.outputs.length}</span>
        <span className="w-28 text-right font-mono text-[#d4af4c]">
          {formatCkb(total)}
        </span>
      </div>
    </Link>
  );
}
