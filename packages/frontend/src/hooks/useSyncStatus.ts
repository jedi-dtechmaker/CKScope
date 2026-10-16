import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import type { SyncStatus } from '@ckscope/shared';

export function useSyncStatus() {
  return useQuery({
    queryKey: ['sync-status'],
    queryFn: async () => {
      const res = await api<SyncStatus>('/sync/status');
      return res.data;
    },
    refetchInterval: 15_000,
  });
}
