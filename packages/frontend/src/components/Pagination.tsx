interface PaginationProps {
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  label?: string;
}

const BTN =
  'border border-[#283448] bg-[#101722] px-3 py-1.5 text-xs text-[#aab5c6] transition hover:border-[#2caa94] hover:text-[#40d9b8] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#283448] disabled:hover:text-[#aab5c6]';

export function Pagination({
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  label,
}: PaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <button className={BTN} onClick={onPrev} disabled={!hasPrev}>
        ← Previous
      </button>
      {label && <span className="text-xs text-[#637087]">{label}</span>}
      <button className={BTN} onClick={onNext} disabled={!hasNext}>
        Next →
      </button>
    </div>
  );
}
