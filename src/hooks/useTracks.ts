'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { TracksQuery, TracksResponse, TrackDetailResponse } from '@/types/api';

async function fetchTracks(params: TracksQuery): Promise<TracksResponse> {
  const searchParams = new URLSearchParams();
  if (params.platform) searchParams.set('platform', params.platform);
  if (params.chain) searchParams.set('chain', params.chain);
  if (params.season) searchParams.set('season', params.season);
  if (params.mediaType) searchParams.set('mediaType', params.mediaType);
  if (params.artist) searchParams.set('artist', params.artist);
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.cursor) searchParams.set('cursor', params.cursor);
  if (params.limit) searchParams.set('limit', String(params.limit));

  const res = await fetch(`/api/tracks?${searchParams}`);
  if (!res.ok) throw new Error('Failed to fetch tracks');
  return res.json();
}

export function useTracks(params: Omit<TracksQuery, 'cursor'> = {}) {
  return useInfiniteQuery({
    queryKey: ['tracks', params],
    queryFn: ({ pageParam }) => fetchTracks({ ...params, cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useTrack(id: string) {
  return useQuery<TrackDetailResponse>({
    queryKey: ['track', id],
    queryFn: async () => {
      const res = await fetch(`/api/tracks/${id}`);
      if (!res.ok) throw new Error('Failed to fetch track');
      return res.json();
    },
    enabled: !!id,
  });
}
