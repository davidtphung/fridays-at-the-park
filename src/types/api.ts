import { Track } from './track';
import { ArtistWithCount } from './artist';
import { Platform, Chain, MediaType } from './platform';

export interface TracksQuery {
  platform?: Platform | 'onchain';
  chain?: Chain;
  season?: string;
  mediaType?: MediaType;
  artist?: string;
  sort?: 'newest' | 'oldest' | 'most_collected' | 'price_asc' | 'price_desc';
  cursor?: string;
  limit?: number;
}

export interface TracksResponse {
  tracks: Track[];
  nextCursor: string | null;
  total: number;
}

export interface TrackDetailResponse {
  track: Track & {
    relatedTracks: Track[];
  };
}

export interface SearchQuery {
  q: string;
  type?: 'all' | 'tracks' | 'artists' | 'episodes';
  limit?: number;
}

export interface SearchResponse {
  tracks: Track[];
  artists: ArtistWithCount[];
  episodes: Track[];
  query: string;
  totalHits: number;
}

export interface StatsResponse {
  totalTracks: number;
  totalArtists: number;
  totalSeasons: number;
  totalMints: number;
  platformCounts: Record<string, number>;
}
