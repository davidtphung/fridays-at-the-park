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
  /** Optional media MIME hint — used when videoUrl points to a non-mp4 asset (e.g. image/gif, image/jpeg, video/quicktime) so the player can choose <video> vs <img>. */
  videoMime?: string;
  /** Editorial series this track belongs to. Used by the /onchain tab strip
   *  to group artifacts (FRIDAY PRESS issues, music-video drops, etc.).
   *  'zora-coin' = a Zora content coin from the @thepark profile feed,
   *  surfaced in the All Onchain grid. */
  series?: 'friday-press' | 'music-videos' | 'zora-coin';
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
