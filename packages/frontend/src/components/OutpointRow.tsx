import { Link } from 'react-router-dom';
import { shortHash } from '../utils/formatters';

interface OutpointRowProps {
  txHash: string;
  index: string;
}

export function OutpointRow({ txHash, index }: OutpointRowProps) {
  return (
    <div className="flex items-center justify-between border border-[#1c2637] bg-[#0d121c] px-4 py-3 text-sm">
      <span className="data-label">Outpoint</span>
      <Link
        to={`/tx/${txHash}`}
        className="teal-link font-mono"
      >
        {shortHash(txHash)}:{index}
      </Link>
    </div>
  );
}
