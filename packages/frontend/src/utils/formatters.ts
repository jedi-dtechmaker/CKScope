// CKB-specific formatting helpers.

export function shortHash(hash: string, prefix = 6, suffix = 4): string {
  if (hash.length <= prefix + suffix) return hash;
  return `${hash.slice(0, prefix + 2)}…${hash.slice(-suffix)}`;
}

// Convert shannons (string | number | bigint) to a human-readable CKB amount.
export function formatCkb(shannons: string | number | bigint): string {
  const big = BigInt(shannons);
  const whole = big / 100000000n;
  const frac = big % 100000000n;
  return `${whole.toLocaleString('en-US')}.${frac
    .toString()
    .padStart(8, '0')
    .slice(0, 4)} CKB`;
}

export function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

export function formatDate(ts: number): string {
  return new Date(ts).toUTCString();
}

// Best-effort UTF-8 preview of a hex data blob; falls back to hex.
export function hexToUtf8Preview(hex: string, maxBytes = 16): string {
  if (!hex || hex === '0x') return '0x';
  const bytes =
    hex
      .slice(2)
      .match(/.{1,2}/g)
      ?.map((b) => parseInt(b, 16)) ?? [];
  const preview = bytes.slice(0, maxBytes);
  const text = preview
    .map((b) => (b >= 32 && b < 127 ? String.fromCharCode(b) : '.'))
    .join('');
  return text.length ? text : hex.slice(0, 2 + maxBytes * 2);
}
