import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import type { Cell, Pagination } from '@ckscope/shared';

export interface CellsResult {
  data: Cell[];
  pagination?: Pagination;
}

export function useCells(
  status: 'live' | 'consumed' | null,
  cursor?: string,
) {
  return useQuery({
    queryKey: ['cells', status ?? 'all', cursor ?? null],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (cursor) params.set('cursor', cursor);
      const qs = params.toString();
      const res = await api<Cell[]>(`/cells${qs ? `?${qs}` : ''}`);
      return res as CellsResult;
    },
  });
}
