import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecentTransactions } from '../hooks/useRecentTransactions';
import { Pagination } from '../components/Pagination';
import { ErrorState, SkeletonList } from '../components/AsyncState';
import { formatCkb, formatRelativeTime, shortHash } from '../utils/formatters';

export function Activities() {
  const [cursor, setCursor] = useState<string | undefined>();
  const [cursors, setCursors] = useState<string[]>([]);
  const { data, isLoading, isError, error } = useRecentTransactions(cursor);

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
      <p className="explorer-heading mb-2">Network</p>
      <h1 className="mb-5 font-['Space_Grotesk'] text-2xl font-semibold text-[#d8dee9]">
        Activities
      </h1>

      {isLoading && <SkeletonList count={8} />}
      {isError && <ErrorState message={(error as Error).message} />}
      {!isLoading && !isError && (data?.data.length ?? 0) === 0 && (
        <p className="text-sm text-[#6d788c]">No activity yet — run `npm run sync`.</p>
      )}

      {!isLoading && !isError && (data?.data.length ?? 0) > 0 && (
        <>
          <div className="explorer-panel divide-y divide-[#182131]">
            {data?.data.map((tx) => (
              <div
                key={tx.hash}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs hover:bg-[#0f1622]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Link to={`/tx/${tx.hash}`} className="teal-link truncate font-mono">
                    {shortHash(tx.hash)}
                  </Link>
                  <span className="hidden text-[#5e6b80] sm:inline">
                    in <b className="font-medium text-[#c5cedd]">{tx.inputs_count}</b> · out{' '}
                    <b className="font-medium text-[#c5cedd]">{tx.outputs_count}</b>
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[#6b778c]">
                  <Link
                    to={`/blocks/${tx.block_number}`}
                    className="teal-link font-mono"
                  >
                    #{tx.block_number.toLocaleString('en-US')}
                  </Link>
                  <span className="font-mono text-[#d9af40]">{formatCkb(tx.capacity)}</span>
                  <span className="hidden sm:inline">{formatRelativeTime(tx.timestamp)}</span>
                </div>
              </div>
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
