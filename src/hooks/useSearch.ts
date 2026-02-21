'use client';

import { useQuery } from '@tanstack/react-query';
import { SearchResponse } from '@/types/api';

export function useSearch(query: string, type: string = 'all') {
  return useQuery<SearchResponse>({
    queryKey: ['search', query, type],
    queryFn: async () => {
      const params = new URLSearchParams({ q: query, type });
      const res = await fetch(`/api/search?${params}`);
      if (!res.ok) throw new Error('Search failed');
      return res.json();
    },
    enabled: query.length >= 2,
  });
}
