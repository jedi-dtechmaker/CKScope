import { Link } from 'react-router-dom';

interface KeyValueRowProps {
  label: string;
  value: string;
  mono?: boolean;
  linkTo?: string;
}

export function KeyValueRow({
  label,
  value,
  mono = true,
  linkTo,
}: KeyValueRowProps) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-[#182131] py-3 last:border-b-0">
      <span className="data-label shrink-0 pt-0.5">{label}</span>
      {linkTo ? (
        <Link
          to={linkTo}
          className="teal-link break-all text-right font-mono text-sm"
        >
          {value}
        </Link>
      ) : (
        <span
          className={`break-all text-right text-sm text-[#c5cedd] ${mono ? 'font-mono' : ''}`}
        >
          {value}
        </span>
      )}
    </div>
  );
}
