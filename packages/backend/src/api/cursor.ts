// Opaque, URL-safe base64 cursor over a numeric position.
export function encodeCursor(num: number): string {
  return Buffer.from(String(num), 'utf8').toString('base64url');
}

export function decodeCursor(cursor: string | undefined): number | null {
  if (!cursor) return null;
  try {
    const n = Number(Buffer.from(cursor, 'base64url').toString('utf8'));
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

// Tuple cursor for composite-key ordering (e.g. block_number + index).
// Encodes parts joined by ':'.
export function encodeTupleCursor(parts: (string | number)[]): string {
  return Buffer.from(parts.join(':'), 'utf8').toString('base64url');
}

export function decodeTupleCursor(cursor: string | undefined): string[] | null {
  if (!cursor) return null;
  try {
    const raw = Buffer.from(cursor, 'base64url').toString('utf8');
    return raw.length > 0 ? raw.split(':') : null;
  } catch {
    return null;
  }
}
