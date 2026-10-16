// Shared loading skeletons and error states.

export function SkeletonCard() {
  return (
    <div className="h-20 animate-pulse border border-[#1c2637] bg-[#0d121c]" />
  );
}

export function SkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="border border-red-500/30 bg-red-500/10 p-6 text-center">
      <p className="text-red-400">Something went wrong</p>
      <p className="mt-1 text-sm text-gray-400">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-3 border border-red-500/30 bg-red-500/20 px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/30"
      >
        Retry
      </button>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="border border-[#1c2637] bg-[#0d121c] p-8 text-center text-[#6f7b8e]">
      {message}
    </div>
  );
}
