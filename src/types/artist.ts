import { Track } from './track';

export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  avatarUrl?: string;
  ensName?: string;
  twitter?: string;
  instagram?: string;
  warpcast?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArtistWithTracks extends Artist {
  tracks: Track[];
  trackCount: number;
}

export interface ArtistWithCount extends Artist {
  trackCount: number;
}
