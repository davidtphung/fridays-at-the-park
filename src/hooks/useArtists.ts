'use client';

import { useQuery } from '@tanstack/react-query';
import { ArtistWithTracks, ArtistWithCount } from '@/types/artist';

export function useArtists(sort: 'name' | 'appearances' = 'name') {
  return useQuery<{ artists: ArtistWithCount[] }>({
    queryKey: ['artists', sort],
    queryFn: async () => {
      const res = await fetch(`/api/artists?sort=${sort}`);
      if (!res.ok) throw new Error('Failed to fetch artists');
      return res.json();
    },
  });
}

export function useArtist(slug: string) {
  return useQuery<{ artist: ArtistWithTracks }>({
    queryKey: ['artist', slug],
    queryFn: async () => {
      const res = await fetch(`/api/artists/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch artist');
      return res.json();
    },
    enabled: !!slug,
  });
}
