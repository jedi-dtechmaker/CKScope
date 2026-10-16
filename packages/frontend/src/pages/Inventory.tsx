import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCells } from '../hooks/useCells';
import { Pagination } from '../components/Pagination';
import { ErrorState, SkeletonList } from '../components/AsyncState';
import { formatCkb, shortHash } from '../utils/formatters';

type StatusFilter = 'all' | 'live' | 'consumed';

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'live', label: 'Live' },
  { key: 'consumed', label: 'Consumed' },
];

export function Inventory() {
  const [status, setStatus] = useState<StatusFilter>('all');
  const [cursor, setCursor] = useState<string | undefined>();
  const [cursors, setCursors] = useState<string[]>([]);
  const { data, isLoading, isError, error } = useCells(
    status === 'all' ? null : status,
    cursor,
  );

  const switchFilter = (s: StatusFilter) => {
    setStatus(s);
    setCursor(undefined);
    setCursors([]);
  };

  const onNext = () => {
    const next = data?.pagination?.next_cursor;
    if (next) {
      setCursors((c) => [...c, cursor ?? '']);
      setCursor(next);
    }
  };
  const onPrev = () => {
    setCursors((c) => {
      const rest = c.slice(0, -1);
      setCursor(rest.length ? rest[rest.length - 1] : undefined);
      return rest;
    });
  };

  return (
    <div>
      <p className="explorer-heading mb-2">Cells</p>
      <h1 className="mb-5 font-['Space_Grotesk'] text-2xl font-semibold text-[#d8dee9]">
        Inventory
      </h1>

      <div className="mb-4 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => switchFilter(f.key)}
            className={`border px-3 py-1.5 text-xs transition ${
              status === f.key
                ? 'border-[#2caa94] bg-[#2caa94]/10 text-[#40d9b8]'
                : 'border-[#283448] bg-[#101722] text-[#aab5c6] hover:border-[#2caa94] hover:text-[#40d9b8]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && <SkeletonList count={8} />}
      {isError && <ErrorState message={(error as Error).message} />}
      {!isLoading && !isError && (data?.data.length ?? 0) === 0 && (
        <p className="text-sm text-[#6d788c]">No cells for this filter.</p>
      )}

      {!isLoading && !isError && (data?.data.length ?? 0) > 0 && (
        <>
          <div className="explorer-panel divide-y divide-[#182131]">
            {data?.data.map((cell) => (
              <Link
                key={`${cell.outpoint_tx_hash}:${cell.outpoint_index}`}
                to={`/cell/${cell.outpoint_tx_hash}/${cell.outpoint_index}`}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs hover:bg-[#0f1622]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] uppercase ${
                      cell.status === 'consumed'
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-[#25c4a1]/10 text-[#25c4a1]'
                    }`}
                  >
                    {cell.status}
                  </span>
                  <span className="teal-link truncate font-mono">
                    {shortHash(cell.outpoint_tx_hash)}:{cell.outpoint_index}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[#6b778c]">
                  <span className="hidden font-mono text-[#5e6b80] md:inline">
                    {shortHash(cell.lock_code_hash ?? '', 8, 4)}
                  </span>
                  <span className="font-mono text-[#d9af40]">{formatCkb(cell.capacity)}</span>
                  <Link to={`/blocks/${cell.block_number}`} className="teal-link font-mono">
                    #{cell.block_number.toLocaleString('en-US')}
                  </Link>
                </div>
              </Link>
            ))}
          </div>
          <Pagination
            hasPrev={cursors.length > 0}
            hasNext={!!data?.pagination?.has_more}
            onPrev={onPrev}
            onNext={onNext}
            label={`Showing ${data?.data.length ?? 0}`}
          />
        </>
      )}
    </div>
  );
}
