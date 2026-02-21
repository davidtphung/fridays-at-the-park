export enum Platform {
  ZORA = 'ZORA',
  CATALOG = 'CATALOG',
  SOUND_XYZ = 'SOUND_XYZ',
  OPENSEA = 'OPENSEA',
  HIGHLIGHT = 'HIGHLIGHT',
  BANDCAMP = 'BANDCAMP',
  YOUTUBE = 'YOUTUBE',
  APPLE_MUSIC = 'APPLE_MUSIC',
  SPOTIFY = 'SPOTIFY',
}

export enum Chain {
  ETHEREUM = 'ETHEREUM',
  BASE = 'BASE',
  OPTIMISM = 'OPTIMISM',
  POLYGON = 'POLYGON',
  NONE = 'NONE',
}

export enum MediaType {
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
}

export const ONCHAIN_PLATFORMS = [
  Platform.ZORA,
  Platform.CATALOG,
  Platform.SOUND_XYZ,
  Platform.OPENSEA,
  Platform.HIGHLIGHT,
] as const;

export const PLATFORM_LABELS: Record<Platform, string> = {
  [Platform.ZORA]: 'Zora',
  [Platform.CATALOG]: 'Catalog',
  [Platform.SOUND_XYZ]: 'Sound.xyz',
  [Platform.OPENSEA]: 'OpenSea',
  [Platform.HIGHLIGHT]: 'Highlight',
  [Platform.BANDCAMP]: 'Bandcamp',
  [Platform.YOUTUBE]: 'YouTube',
  [Platform.APPLE_MUSIC]: 'Apple Music',
  [Platform.SPOTIFY]: 'Spotify',
};

export const CHAIN_LABELS: Record<Chain, string> = {
  [Chain.ETHEREUM]: 'Ethereum',
  [Chain.BASE]: 'Base',
  [Chain.OPTIMISM]: 'Optimism',
  [Chain.POLYGON]: 'Polygon',
  [Chain.NONE]: '',
};
