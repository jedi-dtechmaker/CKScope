import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useBlock } from '../hooks/useBlock';
import { useBlockTransactions } from '../hooks/useBlockTransactions';
import { KeyValueRow } from '../components/KeyValueRow';
import { TransactionRow } from '../components/TransactionRow';
import { Pagination } from '../components/Pagination';
import { ErrorState, SkeletonList } from '../components/AsyncState';
import { formatDate, shortHash } from '../utils/formatters';

export function BlockDetail() {
  const { number } = useParams();
  const num = Number(number);

  const [cursor, setCursor] = useState<string | undefined>();
  const [cursors, setCursors] = useState<string[]>([]);

  const blockQ = useBlock(num);
  const txsQ = useBlockTransactions(num, cursor);

  const onNext = () => {
    const next = txsQ.data?.pagination?.next_cursor;
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

  if (blockQ.isLoading) return <SkeletonList count={3} />;
  if (blockQ.isError) return <ErrorState message={(blockQ.error as Error).message} />;
  const block = blockQ.data;
  if (!block) return null;

  return (
    <div>
      <nav className="mb-5 text-xs text-[#657187]">
        <Link to="/" className="teal-link">
          Home
        </Link>{' '}
        / <span className="text-gray-300">Block #{block.number.toLocaleString()}</span>
      </nav>

      <p className="explorer-heading mb-2">Blocks / Detail</p><h1 className="mb-5 font-['Space_Grotesk'] text-2xl font-semibold text-[#d8dee9]">
        Block #{block.number.toLocaleString('en-US')}
      </h1>

      <section className="explorer-panel p-4 sm:p-5">
        <KeyValueRow label="Hash" value={block.hash} />
        <KeyValueRow
          label="Parent Hash"
          value={shortHash(block.parent_hash, 12, 12)}
          linkTo={block.number > 0 ? `/blocks/${block.number - 1}` : undefined}
        />
        <KeyValueRow label="Timestamp" value={formatDate(block.timestamp)} />
        <KeyValueRow label="Transactions" value={String(block.transactions_count)} />
      </section>

      <h2 className="explorer-heading mb-3 mt-7 border-b border-[#1c2637] pb-3">
        Transactions ({block.transactions_count})
      </h2>

      {txsQ.isLoading && <SkeletonList count={3} />}
      {txsQ.isError && <ErrorState message={(txsQ.error as Error).message} />}

      {!txsQ.isLoading && !txsQ.isError && (
        <>
          <div className="space-y-2">
            {txsQ.data?.data.map((tx) => (
              <TransactionRow key={tx.hash} tx={tx} />
            ))}
          </div>
          {txsQ.data && txsQ.data.data.length > 0 && (
            <Pagination
              hasPrev={cursors.length > 0}
              hasNext={!!txsQ.data.pagination?.has_more}
              onPrev={onPrev}
              onNext={onNext}
              label={`Showing ${txsQ.data.data.length}`}
            />
          )}
        </>
      )}
    </div>
  );
}
