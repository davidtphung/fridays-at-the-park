import { Track, Credits, ExternalLinks } from '@/types/track';
import { Artist } from '@/types/artist';
import { Platform, Chain, MediaType } from '@/types/platform';

// ===== ARTISTS =====
export const MOCK_ARTISTS: Artist[] = [
  {
    id: 'artist-julius-rodriguez',
    name: 'Julius Rodriguez',
    slug: 'julius-rodriguez',
    bio: 'Grammy-nominated pianist, producer, and multi-instrumentalist. A core member of The Park collective.',
    avatarUrl: '/icons/artist-placeholder.svg',
    twitter: 'juliusrodriguez',
    instagram: 'juliusrodriguez',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'artist-waveiq',
    name: 'WaveIQ',
    slug: 'waveiq',
    bio: 'Producer and sonic architect behind many Park sessions.',
    avatarUrl: '/icons/artist-placeholder.svg',
    twitter: 'waveiq',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'artist-baby-rose',
    name: 'Baby Rose',
    slug: 'baby-rose',
    bio: 'Singer-songwriter known for her deeply soulful voice and introspective songwriting.',
    avatarUrl: '/icons/artist-placeholder.svg',
    twitter: 'babyrosemusic',
    instagram: 'babyrose',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'artist-georgia-anne-muldrow',
    name: 'Georgia Anne Muldrow',
    slug: 'georgia-anne-muldrow',
    bio: 'Visionary artist, producer, and singer from Los Angeles.',
    avatarUrl: '/icons/artist-placeholder.svg',
    twitter: 'GAnneM',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'artist-tim-anderson',
    name: 'Tim Anderson',
    slug: 'tim-anderson',
    bio: 'Founding member of The Park. Producer and creative director.',
    avatarUrl: '/icons/artist-placeholder.svg',
    twitter: 'timanderson',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'artist-josh-lippi',
    name: 'Josh Lippi',
    slug: 'josh-lippi',
    bio: 'Multi-instrumentalist and songwriter based in Los Angeles.',
    avatarUrl: '/icons/artist-placeholder.svg',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'artist-ben-schwier',
    name: 'Ben Schwier',
    slug: 'ben-schwier',
    bio: 'Guitarist and composer.',
    avatarUrl: '/icons/artist-placeholder.svg',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'artist-derek-taylor',
    name: 'Derek Taylor',
    slug: 'derek-taylor',
    bio: 'Drummer and percussionist.',
    avatarUrl: '/icons/artist-placeholder.svg',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'artist-nate-mercereau',
    name: 'Nate Mercereau',
    slug: 'nate-mercereau',
    bio: 'Guitarist, producer, and sound designer. Known for his work with Jay-Z, Beyoncé, and The Park.',
    avatarUrl: '/icons/artist-placeholder.svg',
    twitter: 'natemercereau',
    website: 'https://natemercereau.com',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'artist-chloe-angelides',
    name: 'Chloe Angelides',
    slug: 'chloe-angelides',
    bio: 'Singer-songwriter and topliner.',
    avatarUrl: '/icons/artist-placeholder.svg',
    instagram: 'chloeangelides',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'artist-tobi',
    name: 'ToBi',
    slug: 'tobi',
    bio: 'Nigerian-Canadian rapper, singer, and songwriter.',
    avatarUrl: '/icons/artist-placeholder.svg',
    twitter: 'tabortobi',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'artist-moruf',
    name: 'MoRuf',
    slug: 'moruf',
    bio: 'Singer, rapper, and visual artist from New Jersey.',
    avatarUrl: '/icons/artist-placeholder.svg',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'artist-ray-barbee',
    name: 'Ray Barbee',
    slug: 'ray-barbee',
    bio: 'Skateboarder and guitarist. Known for his smooth, jazz-inflected guitar work.',
    avatarUrl: '/icons/artist-placeholder.svg',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'artist-jessie-boykins',
    name: 'Jessie Boykins III',
    slug: 'jessie-boykins-iii',
    bio: 'Singer, producer, and creative visionary.',
    avatarUrl: '/icons/artist-placeholder.svg',
    twitter: 'jessieboykins3',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'artist-the-park',
    name: 'The Park',
    slug: 'the-park',
    bio: 'A music collective that produces original music with friends onchain every Friday.',
    avatarUrl: '/icons/artist-placeholder.svg',
    ensName: 'thepark.eth',
    twitter: 'fridayspark',
    website: 'https://thepark.wtf',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Helper to create track artists
function makeArtists(artistIds: string[], primaryId?: string): Track['artists'] {
  return artistIds.map(id => {
    const artist = MOCK_ARTISTS.find(a => a.id === id)!;
    return {
      artistId: id,
      isPrimary: id === (primaryId || artistIds[0]),
      artist: {
        id: artist.id,
        name: artist.name,
        slug: artist.slug,
        avatarUrl: artist.avatarUrl,
      },
    };
  });
}

// ===== TRACKS =====
export const MOCK_TRACKS: Track[] = [
  // --- Onchain: Catalog ---
  {
    id: 'catalog-belle',
    title: 'Belle',
    slug: 'belle',
    description: 'A lush, instrumental collaboration recorded at The Park. Pre-season release on Catalog.',
    mediaType: MediaType.AUDIO,
    coverImage: 'https://via.placeholder.com/800x800/1C1C2E/E94560?text=Belle',
    coverImageSmall: 'https://via.placeholder.com/400x400/1C1C2E/E94560?text=Belle',
    audioUrl: '/audio/sample.mp3',
    duration: 234,
    platform: Platform.CATALOG,
    chain: Chain.ETHEREUM,
    contractAddress: '0x1bBe4E8d821bb7C2068EE0e78B1697eF0b5f86B5',
    tokenId: '1',
    mintPrice: '0.1',
    mintUrl: 'https://catalog.works/thepark/belle',
    totalMints: 1,
    editionSize: 1,
    genre: ['Jazz', 'Instrumental'],
    credits: {
      guitar: ['Ben Schwier', 'Nate Mercereau'],
      drums: ['Derek Taylor'],
      bass: ['Josh Lippi'],
      engineer: ['Maddi StJohn'],
    },
    externalLinks: {
      catalog: 'https://catalog.works/thepark/belle',
    },
    artists: makeArtists([
      'artist-ben-schwier', 'artist-derek-taylor', 'artist-josh-lippi', 'artist-nate-mercereau'
    ]),
    releaseDate: '2023-06-15T00:00:00Z',
    createdAt: '2023-06-15T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // --- Onchain: Sound.xyz ---
  {
    id: 'sound-do-it',
    title: 'do it',
    slug: 'do-it',
    description: 'A vibrant, collaborative track from The Park released as an edition on Sound.xyz.',
    mediaType: MediaType.AUDIO,
    coverImage: 'https://via.placeholder.com/800x800/141420/FF6B81?text=do+it',
    coverImageSmall: 'https://via.placeholder.com/400x400/141420/FF6B81?text=do+it',
    audioUrl: '/audio/sample.mp3',
    duration: 198,
    platform: Platform.SOUND_XYZ,
    chain: Chain.ETHEREUM,
    contractAddress: '0x2Cc8342d7c8BFf5A213eb2cdE39DE9a59b3461A7',
    tokenId: '1',
    mintPrice: '0.01',
    mintUrl: 'https://sound.xyz/thepark/do-it',
    totalMints: 87,
    editionSize: 100,
    genre: ['R&B', 'Electronic'],
    credits: {
      producer: ['WaveIQ', 'Tim Anderson'],
      vocalist: ['Julius Rodriguez'],
      engineer: ['Ariel Klevecz'],
    },
    externalLinks: {
      soundxyz: 'https://sound.xyz/thepark/do-it',
    },
    artists: makeArtists([
      'artist-the-park', 'artist-julius-rodriguez', 'artist-waveiq'
    ], 'artist-the-park'),
    releaseDate: '2023-09-22T00:00:00Z',
    createdAt: '2023-09-22T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // --- Onchain: Zora (S002) ---
  {
    id: 'zora-becky-v2',
    title: 'becky v2',
    slug: 'becky-v2',
    description: 'An African pop collaboration from Season 002, recorded with artists from Kampala, Uganda.',
    mediaType: MediaType.AUDIO,
    coverImage: 'https://via.placeholder.com/800x800/0A0A0F/E94560?text=becky+v2',
    coverImageSmall: 'https://via.placeholder.com/400x400/0A0A0F/E94560?text=becky+v2',
    audioUrl: '/audio/sample.mp3',
    duration: 267,
    season: 'S002',
    platform: Platform.ZORA,
    chain: Chain.BASE,
    contractAddress: '0x3AbC123456789DEF0123456789aBcDeF01234567',
    tokenId: '2',
    mintPrice: '0.001',
    mintUrl: 'https://zora.co/@thepark/becky-v2',
    totalMints: 156,
    editionSize: undefined,
    genre: ['Afropop', 'R&B'],
    credits: {
      producer: ['Tim Anderson', 'WaveIQ'],
      vocalist: ['ToBi'],
      engineer: ['Maddi StJohn'],
      film: ['Ryan Kontra'],
    },
    externalLinks: {
      zora: 'https://zora.co/@thepark/becky-v2',
    },
    artists: makeArtists([
      'artist-the-park', 'artist-tobi', 'artist-waveiq', 'artist-tim-anderson'
    ], 'artist-the-park'),
    releaseDate: '2024-03-15T00:00:00Z',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  // --- S002 Episode 1 ---
  {
    id: 'zora-s002-ep1',
    title: 'Season 002 Episode 1',
    slug: 's002-ep1',
    description: 'The opening episode of Season 002 featuring Julius Rodriguez, WaveIQ, Baby Rose, and Georgia Anne Muldrow.',
    mediaType: MediaType.AUDIO,
    coverImage: 'https://via.placeholder.com/800x800/1C1C2E/22C55E?text=S002+E1',
    coverImageSmall: 'https://via.placeholder.com/400x400/1C1C2E/22C55E?text=S002+E1',
    audioUrl: '/audio/sample.mp3',
    duration: 312,
    season: 'S002',
    episode: 1,
    platform: Platform.ZORA,
    chain: Chain.BASE,
    contractAddress: '0x4567890ABCdef1234567890abcDEF1234567890A',
    tokenId: '1',
    mintPrice: '0.001',
    mintUrl: 'https://zora.co/@thepark/s002-ep1',
    totalMints: 203,
    genre: ['Neo-Soul', 'Jazz', 'R&B'],
    credits: {
      keys: ['Julius Rodriguez'],
      vocalist: ['Baby Rose', 'Georgia Anne Muldrow'],
      producer: ['WaveIQ'],
      engineer: ['Maddi StJohn'],
      film: ['Ryan Kontra'],
    },
    externalLinks: {
      zora: 'https://zora.co/@thepark/s002-ep1',
    },
    artists: makeArtists([
      'artist-julius-rodriguez', 'artist-waveiq', 'artist-baby-rose', 'artist-georgia-anne-muldrow'
    ], 'artist-julius-rodriguez'),
    releaseDate: '2024-02-02T00:00:00Z',
    createdAt: '2024-02-02T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  // --- S002 Episode 2 ---
  {
    id: 'zora-s002-ep2',
    title: 'Season 002 Episode 2',
    slug: 's002-ep2',
    description: 'Episode 2 of Season 002 featuring Ray Barbee on guitar.',
    mediaType: MediaType.AUDIO,
    coverImage: 'https://via.placeholder.com/800x800/141420/627EEA?text=S002+E2',
    coverImageSmall: 'https://via.placeholder.com/400x400/141420/627EEA?text=S002+E2',
    audioUrl: '/audio/sample.mp3',
    duration: 285,
    season: 'S002',
    episode: 2,
    platform: Platform.ZORA,
    chain: Chain.BASE,
    contractAddress: '0x5678901BCDef2345678901bcdEF2345678901B',
    tokenId: '1',
    mintPrice: '0.001',
    mintUrl: 'https://zora.co/@thepark/s002-ep2',
    totalMints: 178,
    genre: ['Jazz', 'Skateboard Rock'],
    credits: {
      guitar: ['Ray Barbee'],
      producer: ['Tim Anderson'],
      engineer: ['Ariel Klevecz'],
      film: ['Ryan Kontra'],
    },
    externalLinks: {
      zora: 'https://zora.co/@thepark/s002-ep2',
    },
    artists: makeArtists([
      'artist-ray-barbee', 'artist-tim-anderson'
    ], 'artist-ray-barbee'),
    releaseDate: '2024-02-09T00:00:00Z',
    createdAt: '2024-02-09T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  // --- S002 Episode 4 (Honduras special) ---
  {
    id: 'zora-s002-ep4',
    title: 'Season 002 Episode 4 — Honduras',
    slug: 's002-ep4-honduras',
    description: 'A special episode recorded in Honduras, bringing together local musicians with The Park crew.',
    mediaType: MediaType.AUDIO,
    coverImage: 'https://via.placeholder.com/800x800/0A0A0F/FF6B81?text=S002+E4',
    coverImageSmall: 'https://via.placeholder.com/400x400/0A0A0F/FF6B81?text=S002+E4',
    audioUrl: '/audio/sample.mp3',
    duration: 345,
    season: 'S002',
    episode: 4,
    platform: Platform.ZORA,
    chain: Chain.BASE,
    mintPrice: '0.001',
    mintUrl: 'https://zora.co/@thepark/s002-ep4',
    totalMints: 134,
    genre: ['Latin', 'Fusion'],
    credits: {
      producer: ['Tim Anderson', 'WaveIQ'],
      engineer: ['Maddi StJohn'],
      film: ['Ryan Kontra'],
    },
    artists: makeArtists(['artist-the-park', 'artist-tim-anderson', 'artist-waveiq'], 'artist-the-park'),
    releaseDate: '2024-02-23T00:00:00Z',
    createdAt: '2024-02-23T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  // --- S002 Episode 5 (Superchain / Base) ---
  {
    id: 'zora-s002-ep5',
    title: 'Season 002 Episode 5 — Superchain',
    slug: 's002-ep5-superchain',
    description: 'The Superchain episode on Base, exploring the intersection of onchain creativity.',
    mediaType: MediaType.AUDIO,
    coverImage: 'https://via.placeholder.com/800x800/1C1C2E/0052FF?text=S002+E5',
    coverImageSmall: 'https://via.placeholder.com/400x400/1C1C2E/0052FF?text=S002+E5',
    audioUrl: '/audio/sample.mp3',
    duration: 290,
    season: 'S002',
    episode: 5,
    platform: Platform.ZORA,
    chain: Chain.BASE,
    mintPrice: '0.001',
    mintUrl: 'https://zora.co/@thepark/s002-ep5',
    totalMints: 245,
    genre: ['Electronic', 'Experimental'],
    credits: {
      producer: ['WaveIQ'],
      engineer: ['Ariel Klevecz'],
    },
    artists: makeArtists(['artist-the-park', 'artist-waveiq'], 'artist-the-park'),
    releaseDate: '2024-03-01T00:00:00Z',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  // --- S002 Episode 6 (FWB Fest) ---
  {
    id: 'zora-s002-ep6',
    title: 'Season 002 Episode 6 — FWB Fest 2024',
    slug: 's002-ep6-fwb-fest',
    description: 'Recorded live at FWB Fest 2024. A high-energy collaborative session.',
    mediaType: MediaType.AUDIO,
    coverImage: 'https://via.placeholder.com/800x800/141420/E94560?text=FWB+Fest',
    coverImageSmall: 'https://via.placeholder.com/400x400/141420/E94560?text=FWB+Fest',
    audioUrl: '/audio/sample.mp3',
    duration: 378,
    season: 'S002',
    episode: 6,
    platform: Platform.ZORA,
    chain: Chain.BASE,
    mintPrice: '0.001',
    mintUrl: 'https://zora.co/@thepark/s002-ep6',
    totalMints: 312,
    genre: ['Live', 'Experimental'],
    credits: {
      producer: ['Tim Anderson', 'WaveIQ'],
      engineer: ['Maddi StJohn'],
      film: ['Ryan Kontra'],
    },
    artists: makeArtists(['artist-the-park', 'artist-tim-anderson', 'artist-waveiq'], 'artist-the-park'),
    releaseDate: '2024-03-08T00:00:00Z',
    createdAt: '2024-03-08T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  // --- Season 001 tracks (Bandcamp / streaming) ---
  {
    id: 'bandcamp-s001-01',
    title: 'Opening',
    slug: 's001-opening',
    description: 'The opening track of Season 001.',
    mediaType: MediaType.AUDIO,
    coverImage: 'https://via.placeholder.com/800x800/0A0A0F/A1A1AA?text=Season+001',
    coverImageSmall: 'https://via.placeholder.com/400x400/0A0A0F/A1A1AA?text=Season+001',
    audioUrl: '/audio/sample.mp3',
    duration: 195,
    album: 'Fridays at the Park Season 001',
    season: 'S001',
    trackNumber: 1,
    platform: Platform.BANDCAMP,
    chain: Chain.NONE,
    genre: ['Neo-Soul', 'Jazz'],
    credits: {
      producer: ['Tim Anderson'],
      engineer: ['Maddi StJohn'],
    },
    externalLinks: {
      bandcamp: 'https://thepark.bandcamp.com/album/season-001',
      spotify: 'https://open.spotify.com',
      appleMusic: 'https://music.apple.com',
    },
    artists: makeArtists(['artist-the-park', 'artist-tim-anderson'], 'artist-the-park'),
    releaseDate: '2023-12-01T00:00:00Z',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'bandcamp-s001-02',
    title: 'Golden Hour',
    slug: 's001-golden-hour',
    description: 'A warm, sun-drenched groove from Season 001.',
    mediaType: MediaType.AUDIO,
    coverImage: 'https://via.placeholder.com/800x800/0A0A0F/A1A1AA?text=Season+001',
    coverImageSmall: 'https://via.placeholder.com/400x400/0A0A0F/A1A1AA?text=Season+001',
    audioUrl: '/audio/sample.mp3',
    duration: 224,
    album: 'Fridays at the Park Season 001',
    season: 'S001',
    trackNumber: 2,
    platform: Platform.BANDCAMP,
    chain: Chain.NONE,
    genre: ['Neo-Soul'],
    credits: {
      keys: ['Julius Rodriguez'],
      vocalist: ['Chloe Angelides'],
      engineer: ['Maddi StJohn'],
    },
    externalLinks: {
      bandcamp: 'https://thepark.bandcamp.com/album/season-001',
      spotify: 'https://open.spotify.com',
    },
    artists: makeArtists(['artist-julius-rodriguez', 'artist-chloe-angelides'], 'artist-julius-rodriguez'),
    releaseDate: '2023-12-01T00:00:00Z',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'bandcamp-s001-03',
    title: 'Late Night Drive',
    slug: 's001-late-night-drive',
    description: 'Smooth nighttime vibes from Season 001.',
    mediaType: MediaType.AUDIO,
    coverImage: 'https://via.placeholder.com/800x800/0A0A0F/A1A1AA?text=Season+001',
    coverImageSmall: 'https://via.placeholder.com/400x400/0A0A0F/A1A1AA?text=Season+001',
    audioUrl: '/audio/sample.mp3',
    duration: 256,
    album: 'Fridays at the Park Season 001',
    season: 'S001',
    trackNumber: 3,
    platform: Platform.BANDCAMP,
    chain: Chain.NONE,
    genre: ['R&B', 'Jazz'],
    credits: {
      guitar: ['Nate Mercereau'],
      drums: ['Derek Taylor'],
      engineer: ['Maddi StJohn'],
    },
    externalLinks: {
      bandcamp: 'https://thepark.bandcamp.com/album/season-001',
    },
    artists: makeArtists(['artist-nate-mercereau', 'artist-derek-taylor'], 'artist-nate-mercereau'),
    releaseDate: '2023-12-01T00:00:00Z',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'bandcamp-s001-04',
    title: 'Freefall',
    slug: 's001-freefall',
    mediaType: MediaType.AUDIO,
    coverImage: 'https://via.placeholder.com/800x800/0A0A0F/A1A1AA?text=Season+001',
    audioUrl: '/audio/sample.mp3',
    duration: 210,
    album: 'Fridays at the Park Season 001',
    season: 'S001',
    trackNumber: 4,
    platform: Platform.BANDCAMP,
    chain: Chain.NONE,
    genre: ['Neo-Soul'],
    externalLinks: { bandcamp: 'https://thepark.bandcamp.com/album/season-001' },
    artists: makeArtists(['artist-moruf', 'artist-the-park'], 'artist-moruf'),
    releaseDate: '2023-12-01T00:00:00Z',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'bandcamp-s001-05',
    title: 'Reflections',
    slug: 's001-reflections',
    mediaType: MediaType.AUDIO,
    coverImage: 'https://via.placeholder.com/800x800/0A0A0F/A1A1AA?text=Season+001',
    audioUrl: '/audio/sample.mp3',
    duration: 280,
    album: 'Fridays at the Park Season 001',
    season: 'S001',
    trackNumber: 5,
    platform: Platform.BANDCAMP,
    chain: Chain.NONE,
    genre: ['Jazz', 'Ambient'],
    externalLinks: { bandcamp: 'https://thepark.bandcamp.com/album/season-001' },
    artists: makeArtists(['artist-jessie-boykins', 'artist-julius-rodriguez'], 'artist-jessie-boykins'),
    releaseDate: '2023-12-01T00:00:00Z',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // --- Video Episodes (YouTube) ---
  {
    id: 'yt-s002-ep1-video',
    title: 'Fridays at the Park — S002 Ep1',
    slug: 'yt-s002-ep1',
    description: 'The full video episode of Season 002 Episode 1, capturing the live studio session.',
    mediaType: MediaType.VIDEO,
    coverImage: 'https://via.placeholder.com/1280x720/0A0A0F/E94560?text=S002+E1+Video',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 1845,
    season: 'S002',
    episode: 1,
    platform: Platform.YOUTUBE,
    chain: Chain.NONE,
    genre: ['Session Video'],
    artists: makeArtists(['artist-julius-rodriguez', 'artist-baby-rose', 'artist-georgia-anne-muldrow', 'artist-waveiq']),
    releaseDate: '2024-02-02T00:00:00Z',
    createdAt: '2024-02-02T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'yt-s002-ep2-video',
    title: 'Fridays at the Park — S002 Ep2',
    slug: 'yt-s002-ep2',
    description: 'Season 002 Episode 2 video featuring Ray Barbee.',
    mediaType: MediaType.VIDEO,
    coverImage: 'https://via.placeholder.com/1280x720/141420/627EEA?text=S002+E2+Video',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 1620,
    season: 'S002',
    episode: 2,
    platform: Platform.YOUTUBE,
    chain: Chain.NONE,
    genre: ['Session Video'],
    artists: makeArtists(['artist-ray-barbee', 'artist-tim-anderson']),
    releaseDate: '2024-02-09T00:00:00Z',
    createdAt: '2024-02-09T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'yt-s002-ep3-video',
    title: 'Fridays at the Park — S002 Ep3',
    slug: 'yt-s002-ep3',
    description: 'Full-length Season 002 Episode 3 video.',
    mediaType: MediaType.VIDEO,
    coverImage: 'https://via.placeholder.com/1280x720/1C1C2E/22C55E?text=S002+E3+Video',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 2100,
    season: 'S002',
    episode: 3,
    platform: Platform.HIGHLIGHT,
    chain: Chain.BASE,
    contractAddress: '0xHighlight3456789',
    mintPrice: '0.001',
    mintUrl: 'https://highlight.xyz/mint/s002-ep3',
    totalMints: 89,
    genre: ['Session Video'],
    artists: makeArtists(['artist-the-park']),
    releaseDate: '2024-02-16T00:00:00Z',
    createdAt: '2024-02-16T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'yt-s002-ep4-video',
    title: 'Fridays at the Park — S002 Ep4 Honduras',
    slug: 'yt-s002-ep4',
    description: 'The Honduras special — Season 002 Episode 4 video.',
    mediaType: MediaType.VIDEO,
    coverImage: 'https://via.placeholder.com/1280x720/0A0A0F/FF6B81?text=S002+E4+Video',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 1950,
    season: 'S002',
    episode: 4,
    platform: Platform.YOUTUBE,
    chain: Chain.NONE,
    genre: ['Session Video'],
    artists: makeArtists(['artist-the-park', 'artist-tim-anderson']),
    releaseDate: '2024-02-23T00:00:00Z',
    createdAt: '2024-02-23T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'yt-s002-ep5-video',
    title: 'Fridays at the Park — S002 Ep5 Superchain',
    slug: 'yt-s002-ep5',
    description: 'The Superchain episode video.',
    mediaType: MediaType.VIDEO,
    coverImage: 'https://via.placeholder.com/1280x720/1C1C2E/0052FF?text=S002+E5+Video',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 1800,
    season: 'S002',
    episode: 5,
    platform: Platform.YOUTUBE,
    chain: Chain.NONE,
    genre: ['Session Video'],
    artists: makeArtists(['artist-the-park', 'artist-waveiq']),
    releaseDate: '2024-03-01T00:00:00Z',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'yt-s002-ep6-video',
    title: 'Fridays at the Park — S002 Ep6 FWB Fest',
    slug: 'yt-s002-ep6',
    description: 'FWB Fest 2024 live session video.',
    mediaType: MediaType.VIDEO,
    coverImage: 'https://via.placeholder.com/1280x720/141420/E94560?text=FWB+Fest+Video',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 2340,
    season: 'S002',
    episode: 6,
    platform: Platform.YOUTUBE,
    chain: Chain.NONE,
    genre: ['Session Video'],
    artists: makeArtists(['artist-the-park', 'artist-tim-anderson', 'artist-waveiq']),
    releaseDate: '2024-03-08T00:00:00Z',
    createdAt: '2024-03-08T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  // Additional onchain tracks
  {
    id: 'zora-morning-light',
    title: 'Morning Light',
    slug: 'morning-light',
    description: 'A serene, ambient piece from an early Park session.',
    mediaType: MediaType.AUDIO,
    coverImage: 'https://via.placeholder.com/800x800/1C1C2E/FF6B81?text=Morning+Light',
    audioUrl: '/audio/sample.mp3',
    duration: 245,
    platform: Platform.ZORA,
    chain: Chain.ETHEREUM,
    contractAddress: '0xABCDEF1234567890ABCDEF1234567890ABCDEF12',
    mintPrice: '0.005',
    mintUrl: 'https://zora.co/@thepark/morning-light',
    totalMints: 67,
    genre: ['Ambient', 'Jazz'],
    artists: makeArtists(['artist-nate-mercereau', 'artist-julius-rodriguez']),
    releaseDate: '2023-08-11T00:00:00Z',
    createdAt: '2023-08-11T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// ===== FEATURED RELEASES (for Cover Flow) =====
export const MOCK_FEATURED_IDS = [
  'zora-s002-ep6',
  'zora-becky-v2',
  'catalog-belle',
  'sound-do-it',
  'zora-s002-ep1',
  'zora-s002-ep5',
  'bandcamp-s001-02',
  'zora-morning-light',
];

// ===== HELPER FUNCTIONS =====
export function getMockTrack(id: string): Track | undefined {
  return MOCK_TRACKS.find(t => t.id === id);
}

export function getMockArtist(slug: string): Artist | undefined {
  return MOCK_ARTISTS.find(a => a.slug === slug);
}

export function getMockTracksByPlatform(platform: string): Track[] {
  if (platform === 'onchain') {
    return MOCK_TRACKS.filter(t =>
      [Platform.ZORA, Platform.CATALOG, Platform.SOUND_XYZ, Platform.HIGHLIGHT].includes(t.platform) &&
      t.mediaType === MediaType.AUDIO
    );
  }
  return MOCK_TRACKS.filter(t => t.platform === platform);
}

export function getMockEpisodes(season?: string): Track[] {
  let episodes = MOCK_TRACKS.filter(t => t.mediaType === MediaType.VIDEO);
  if (season) {
    episodes = episodes.filter(t => t.season === season);
  }
  return episodes.sort((a, b) => (a.episode || 0) - (b.episode || 0));
}

export function getMockFeaturedTracks(): Track[] {
  return MOCK_FEATURED_IDS
    .map(id => MOCK_TRACKS.find(t => t.id === id))
    .filter(Boolean) as Track[];
}

export function getArtistTracks(artistSlug: string): Track[] {
  return MOCK_TRACKS.filter(t =>
    t.artists.some(a => a.artist.slug === artistSlug)
  );
}

export function searchMockData(query: string) {
  const q = query.toLowerCase();
  const tracks = MOCK_TRACKS.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.artists.some(a => a.artist.name.toLowerCase().includes(q)) ||
    t.description?.toLowerCase().includes(q)
  );
  const artists = MOCK_ARTISTS.filter(a =>
    a.name.toLowerCase().includes(q) ||
    a.bio?.toLowerCase().includes(q)
  );
  const episodes = tracks.filter(t => t.mediaType === MediaType.VIDEO);
  return { tracks, artists, episodes };
}

export function getSeasons(): string[] {
  const seasons = new Set<string>();
  MOCK_TRACKS.forEach(t => {
    if (t.season) seasons.add(t.season);
  });
  return Array.from(seasons).sort();
}

export function getBandcampAlbums() {
  const albums = new Map<string, Track[]>();
  MOCK_TRACKS
    .filter(t => t.platform === Platform.BANDCAMP)
    .forEach(t => {
      const albumName = t.album || 'Singles';
      if (!albums.has(albumName)) albums.set(albumName, []);
      albums.get(albumName)!.push(t);
    });
  return Array.from(albums.entries()).map(([name, tracks]) => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    coverImage: tracks[0].coverImage,
    tracks: tracks.sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0)),
    trackCount: tracks.length,
    totalDuration: tracks.reduce((sum, t) => sum + (t.duration || 0), 0),
  }));
}
