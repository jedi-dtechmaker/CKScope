import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import type { Cell } from '@ckscope/shared';

const HASH_RE = /^0x[0-9a-f]{64}$/;

export function useCell(txHash: string, index: number) {
  return useQuery({
    queryKey: ['cell', txHash, index],
    queryFn: async () => {
      const res = await api<Cell>(`/cells/${txHash}/${index}`);
      return res.data;
    },
    enabled:
      HASH_RE.test(txHash.toLowerCase()) &&
      Number.isInteger(index) &&
      index >= 0,
  });
}
