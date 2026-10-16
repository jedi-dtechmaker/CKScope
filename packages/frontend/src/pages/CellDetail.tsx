import { Link, useParams } from 'react-router-dom';
import { useCell } from '../hooks/useCell';
import { KeyValueRow } from '../components/KeyValueRow';
import { ErrorState, SkeletonList } from '../components/AsyncState';
import { formatCkb, shortHash } from '../utils/formatters';

export function CellDetail() {
  const { txHash = '', index = '' } = useParams();
  const idx = Number(index);
  const { data: cell, isLoading, isError, error } = useCell(txHash, idx);

  if (isLoading) return <SkeletonList count={3} />;
  if (isError) return <ErrorState message={(error as Error).message} />;
  if (!cell) return null;

  const consumed = cell.status === 'consumed';

  return (
    <div>
      <nav className="mb-5 text-xs text-[#657187]">
        <Link to="/" className="teal-link">
          Home
        </Link>{' '}
        / <span className="text-gray-300">Cell</span>
      </nav>

      <div className="mb-5 flex items-center gap-3">
        <h1 className="font-['Space_Grotesk'] text-2xl font-semibold text-[#d8dee9]">
          Cell{' '}
          <span className="font-mono text-[#d9af40]">
            {shortHash(cell.outpoint_tx_hash, 10, 6)}:{cell.outpoint_index}
          </span>
        </h1>
        <span
          className={`rounded-full px-2.5 py-1 font-mono text-xs ${
            consumed
              ? 'bg-red-500/10 text-red-400'
              : 'bg-[#fb923c]/10 text-[#fb923c]'
          }`}
        >
          {cell.status}
        </span>
      </div>

      {/* Lifecycle timeline */}
      <section className="explorer-panel mb-6 p-4 sm:p-5">
        <h2 className="explorer-heading mb-4">Lifecycle</h2>

        <div className="flex flex-col">
          {/* Created */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#fb923c] shadow-[0_0_7px_#fb923c]" />
              <span className="mt-1 w-px flex-1 bg-[#1c2637]" />
            </div>
            <div className="pb-5">
              <div className="font-['Space_Grotesk'] text-sm font-medium text-[#fb923c]">
                Created
              </div>
              <div className="mt-1.5 space-y-1 text-xs text-[#92a0b4]">
                <div>
                  Block{' '}
                  <Link
                    to={`/blocks/${cell.block_number}`}
                    className="teal-link font-mono"
                  >
                    #{cell.block_number.toLocaleString('en-US')}
                  </Link>
                </div>
                <div>
                  Transaction{' '}
                  <Link to={`/tx/${cell.tx_hash}`} className="teal-link font-mono">
                    {shortHash(cell.tx_hash)}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Spent / live */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`mt-1 h-2.5 w-2.5 rounded-full ${
                  consumed
                    ? 'bg-red-500 shadow-[0_0_7px_#ef4444]'
                    : 'bg-[#3a4a63]'
                }`}
              />
            </div>
            <div>
              <div
                className={`font-['Space_Grotesk'] text-sm font-medium ${
                  consumed ? 'text-red-400' : 'text-[#778399]'
                }`}
              >
                {consumed ? 'Spent' : 'Currently live'}
              </div>
              {consumed && (
                <div className="mt-1.5 space-y-1 text-xs text-[#92a0b4]">
                  <div>
                    Block{' '}
                    <Link
                      to={`/blocks/${cell.consumed_at_block_number}`}
                      className="teal-link font-mono"
                    >
                      #{cell.consumed_at_block_number?.toLocaleString('en-US')}
                    </Link>
                  </div>
                  <div>
                    Transaction{' '}
                    <Link
                      to={`/tx/${cell.consumed_by_tx_hash}`}
                      className="teal-link font-mono"
                    >
                      {shortHash(cell.consumed_by_tx_hash ?? '')}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="explorer-panel p-4 sm:p-5">
        <h2 className="explorer-heading mb-3">Details</h2>
        <KeyValueRow label="Capacity" value={formatCkb(cell.capacity)} mono={false} />
        <KeyValueRow
          label="Outpoint"
          value={`${cell.outpoint_tx_hash}:${cell.outpoint_index}`}
        />
        <KeyValueRow
          label="Lock"
          value={`${shortHash(cell.lock_code_hash ?? '', 10, 6)} · ${cell.lock_hash_type ?? ''} · ${shortHash(cell.lock_args ?? '', 6, 6)}`}
        />
        {cell.type_code_hash && (
          <KeyValueRow
            label="Type"
            value={`${shortHash(cell.type_code_hash, 10, 6)} · ${cell.type_hash_type ?? ''} · ${shortHash(cell.type_args ?? '', 6, 6)}`}
          />
        )}
      </section>
    </div>
  );
}
