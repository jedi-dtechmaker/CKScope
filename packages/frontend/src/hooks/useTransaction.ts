import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import type { Transaction } from '@ckscope/shared';

const HASH_RE = /^0x[0-9a-f]{64}$/;

export function useTransaction(hash: string) {
  return useQuery({
    queryKey: ['transaction', hash],
    queryFn: async () => {
      const res = await api<Transaction>(`/transactions/${hash}`);
      return res.data;
    },
    enabled: HASH_RE.test(hash.toLowerCase()),
  });
}
