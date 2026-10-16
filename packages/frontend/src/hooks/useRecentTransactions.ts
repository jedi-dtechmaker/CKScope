import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import type { Pagination, TransactionSummary } from '@ckscope/shared';

export interface RecentTransactionsResult {
  data: TransactionSummary[];
  pagination?: Pagination;
}

export function useRecentTransactions(cursor?: string) {
  return useQuery({
    queryKey: ['recent-transactions', cursor ?? null],
    queryFn: async () => {
      const res = await api<TransactionSummary[]>(
        `/transactions${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`,
      );
      return res as RecentTransactionsResult;
    },
  });
}
