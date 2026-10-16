import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import type { Block } from '@ckscope/shared';

export function useBlock(number: number) {
  return useQuery({
    queryKey: ['block', number],
    queryFn: async () => {
      const res = await api<Block>(`/blocks/${number}`);
      return res.data;
    },
    enabled: Number.isInteger(number) && number >= 0,
  });
}
