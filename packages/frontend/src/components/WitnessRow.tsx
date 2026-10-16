import { useState } from 'react';
import { shortHash } from '../utils/formatters';

interface WitnessRowProps {
  witness: string;
  index: number;
}

export function WitnessRow({ witness, index }: WitnessRowProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(witness);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable (e.g. http); ignore.
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 border border-[#1c2637] bg-[#0d121c] px-4 py-3 text-xs">
      <span className="data-label">Witness {index}</span>
      <span className="break-all font-mono text-[#bac5d5]">
        {shortHash(witness, 12, 12)}
      </span>
      <button
        onClick={copy}
        className="teal-link shrink-0"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
