import { Platform, Chain } from '@/types/platform';

export const SITE_NAME = 'Fridays at the Park';
export const SITE_DESCRIPTION = 'A music discovery platform aggregating all music from The Park collective.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thepark.wtf';

export const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
export const IPFS_FALLBACK_GATEWAY = 'https://nftstorage.link/ipfs/';

export const PLATFORM_URLS: Record<Platform, string> = {
  [Platform.ZORA]: 'https://zora.co/@thepark',
  [Platform.CATALOG]: 'https://catalog.works/thepark',
  [Platform.SOUND_XYZ]: 'https://sound.xyz/thepark',
  [Platform.OPENSEA]: 'https://opensea.io/collection/the-park-music',
  [Platform.HIGHLIGHT]: 'https://highlight.xyz',
  [Platform.BANDCAMP]: 'https://thepark.bandcamp.com/music',
  [Platform.YOUTUBE]: 'https://youtube.com/@fridaysatthepark',
  [Platform.APPLE_MUSIC]: 'https://music.apple.com',
  [Platform.SPOTIFY]: 'https://open.spotify.com',
};

export const SOCIAL_LINKS = {
  twitter: 'https://x.com/thepark',
  farcaster: 'https://farcaster.xyz/thepark',
  instagram: 'https://instagram.com/fridaysatthepark',
  zora: 'https://zora.co/@thepark',
  website: 'https://thepark.wtf',
  org: 'https://fridaysatthepark.org/',
};

export const CHAIN_COLORS: Record<Chain, string> = {
  [Chain.ETHEREUM]: '#627EEA',
  [Chain.BASE]: '#0052FF',
  [Chain.ZORA]: '#2B5DF0',
  [Chain.OPTIMISM]: '#FF0420',
  [Chain.POLYGON]: '#8247E5',
  [Chain.NONE]: 'transparent',
};

export const NAV_ITEMS = [
  { label: 'Onchain', href: '/onchain', icon: 'diamond' as const, external: false },
  { label: 'Episodes', href: '/episodes', icon: 'play' as const, external: false },
  { label: 'ORG', href: '/org', icon: 'globe' as const, external: false },
  { label: 'DAO', href: '/dao', icon: 'vote' as const, external: false },
] as const;

export const ITEMS_PER_PAGE = 20;
export const MAX_ITEMS_PER_PAGE = 50;
export const SEARCH_DEBOUNCE_MS = 300;
export const REVALIDATION_INTERVAL = 3600; // 1 hour in seconds
