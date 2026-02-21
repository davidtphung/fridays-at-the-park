'use client';

import { useQuery } from '@tanstack/react-query';
import { Track } from '@/types/track';

export function useEpisodes(season?: string) {
  return useQuery<{ episodes: Track[] }>({
    queryKey: ['episodes', season],
    queryFn: async () => {
      const params = season ? `?season=${season}` : '';
      const res = await fetch(`/api/episodes${params}`);
      if (!res.ok) throw new Error('Failed to fetch episodes');
      return res.json();
    },
  });
}
