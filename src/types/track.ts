import { Platform, Chain, MediaType } from './platform';

export interface Credits {
  vocalist?: string[];
  keys?: string[];
  drums?: string[];
  bass?: string[];
  guitar?: string[];
  engineer?: string[];
  studio?: string;
  film?: string[];
  producer?: string[];
  mixing?: string[];
  mastering?: string[];
  [key: string]: string | string[] | undefined;
}

export interface ExternalLinks {
  spotify?: string;
  appleMusic?: string;
  tidal?: string;
  bandcamp?: string;
  youtube?: string;
  zora?: string;
  catalog?: string;
  soundxyz?: string;
  opensea?: string;
  [key: string]: string | undefined;
}

export interface TrackArtist {
  artistId: string;
  role?: string;
  isPrimary: boolean;
  artist: ArtistBasic;
}

export interface ArtistBasic {
  id: string;
  name: string;
  slug: string;
  avatarUrl?: string;
}

export interface Track {
  id: string;
  title: string;
  slug: string;
  description?: string;
  lyrics?: string;
  mediaType: MediaType;
  coverImage: string;
  coverImageSmall?: string;
  audioUrl?: string;
  videoUrl?: string;
  duration?: number;
  album?: string;
  season?: string;
  episode?: number;
  trackNumber?: number;
  releaseDate?: string;
  platform: Platform;
  chain: Chain;
  contractAddress?: string;
  tokenId?: string;
  mintPrice?: string;
  mintUrl?: string;
  totalMints?: number;
  editionSize?: number;
  genre: string[];
  bpm?: number;
  musicalKey?: string;
  credits?: Credits;
  externalLinks?: ExternalLinks;
  artists: TrackArtist[];
  createdAt: string;
  updatedAt: string;
}

export type TrackCardVariant = 'onchain' | 'bandcamp' | 'episode';
