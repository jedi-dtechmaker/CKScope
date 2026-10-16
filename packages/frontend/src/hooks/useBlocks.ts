import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import type { Block, Pagination } from '@ckscope/shared';

export interface BlocksResult {
  data: Block[];
  pagination?: Pagination;
}

export function useBlocks(cursor?: string) {
  return useQuery({
    queryKey: ['blocks', cursor ?? null],
    queryFn: async () => {
      const res = await api<Block[]>(
        `/blocks${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`,
      );
      return res as BlocksResult;
    },
  });
}
