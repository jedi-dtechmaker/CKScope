import { Link, useParams } from 'react-router-dom';
import { useTransaction } from '../hooks/useTransaction';
import { KeyValueRow } from '../components/KeyValueRow';
import { CellCard } from '../components/CellCard';
import { OutpointRow } from '../components/OutpointRow';
import { WitnessRow } from '../components/WitnessRow';
import { ErrorState, SkeletonList } from '../components/AsyncState';

export function TransactionDetail() {
  const { hash = '' } = useParams();
  const { data: tx, isLoading, isError, error } = useTransaction(hash);

  if (isLoading) return <SkeletonList count={3} />;
  if (isError) return <ErrorState message={(error as Error).message} />;
  if (!tx) return null;

  return (
    <div>
      <nav className="mb-5 text-xs text-[#657187]">
        <Link to="/" className="teal-link">
          Home
        </Link>{' '}
        / <span className="text-gray-300">Transaction</span>
      </nav>

      <p className="explorer-heading mb-2">Activities / Transaction</p><h1 className="mb-5 font-['Space_Grotesk'] text-2xl font-semibold text-[#d8dee9]">Transaction</h1>

      <section className="explorer-panel p-4 sm:p-5">
        <KeyValueRow label="Hash" value={tx.hash} />
        <KeyValueRow
          label="Block"
          value={`#${tx.block_number.toLocaleString('en-US')}`}
          linkTo={`/blocks/${tx.block_number}`}
        />
        <KeyValueRow label="Index" value={String(tx.block_index)} />
        <KeyValueRow label="Version" value={String(tx.version)} />
      </section>

      <h2 className="explorer-heading mb-3 mt-7 border-b border-[#1c2637] pb-3">
        Inputs ({tx.inputs.length})
      </h2>
      {tx.inputs.length === 0 ? (
        <p className="text-sm text-[#6d788c]">No inputs</p>
      ) : (
        <div className="space-y-2">
          {tx.inputs.map((inp, i) => (
            <OutpointRow
              key={i}
              txHash={inp.previous_output.tx_hash}
              index={inp.previous_output.index}
            />
          ))}
        </div>
      )}

      <h2 className="explorer-heading mb-3 mt-7 border-b border-[#1c2637] pb-3">
        Outputs ({tx.outputs.length})
      </h2>
      <div className="space-y-2">
        {tx.outputs.map((out, i) => (
          <Link
            key={i}
            to={`/cell/${tx.hash}/${i}`}
            className="block transition hover:opacity-90"
            title="View cell lifecycle"
          >
            <CellCard output={out} data={tx.output_data[i] ?? '0x'} index={i} />
          </Link>
        ))}
      </div>

      <h2 className="explorer-heading mb-3 mt-7 border-b border-[#1c2637] pb-3">
        Witnesses ({tx.witnesses.length})
      </h2>
      <div className="space-y-2">
        {tx.witnesses.map((w, i) => (
          <WitnessRow key={i} witness={w} index={i} />
        ))}
      </div>
    </div>
  );
}
