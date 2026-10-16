import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import type { Pagination, Transaction } from '@ckscope/shared';

export interface BlockTransactionsResult {
  data: Transaction[];
  pagination?: Pagination;
}

export function useBlockTransactions(number: number, cursor?: string) {
  return useQuery({
    queryKey: ['block-transactions', number, cursor ?? null],
    queryFn: async () => {
      const res = await api<Transaction[]>(
        `/blocks/${number}/transactions${
          cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''
        }`,
      );
      return res as BlockTransactionsResult;
    },
    enabled: Number.isInteger(number) && number >= 0,
  });
}
