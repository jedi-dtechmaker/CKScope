import type { CellOutput } from '@ckscope/shared';
import { formatCkb, hexToUtf8Preview, shortHash } from '../utils/formatters';

interface CellCardProps {
  output: CellOutput;
  data: string;
  index: number;
}

export function CellCard({ output, data, index }: CellCardProps) {
  return (
    <div className="explorer-panel p-4">
      <div className="flex items-center justify-between">
        <span className="data-label">Output {index}</span>
        <span className="font-mono text-sm text-[#d9af40]">
          {formatCkb(output.capacity)}
        </span>
      </div>
      <div className="mt-3 space-y-2 text-xs text-[#92a0b4]">
        <div className="flex gap-2">
          <span className="shrink-0 text-[#5b687d]">Lock</span>
          <span className="break-all font-mono">
            {shortHash(output.lock.code_hash)} · {output.lock.hash_type} ·{' '}
            {shortHash(output.lock.args)}
          </span>
        </div>
        {output.type && (
          <div className="flex gap-2">
            <span className="shrink-0 text-[#5b687d]">Type</span>
            <span className="break-all font-mono">
              {shortHash(output.type.code_hash)} · {output.type.hash_type} ·{' '}
              {shortHash(output.type.args)}
            </span>
          </div>
        )}
        <div className="flex gap-2">
          <span className="shrink-0 text-[#5b687d]">Data</span>
          <span className="break-all font-mono">{hexToUtf8Preview(data)}</span>
        </div>
      </div>
    </div>
  );
}
