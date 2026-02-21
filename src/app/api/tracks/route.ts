import { NextRequest, NextResponse } from 'next/server';
import { MOCK_TRACKS } from '@/lib/mock-data';
import { Platform, MediaType, ONCHAIN_PLATFORMS } from '@/types/platform';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  const chain = searchParams.get('chain');
  const season = searchParams.get('season');
  const mediaType = searchParams.get('mediaType');
  const artist = searchParams.get('artist');
  const sort = searchParams.get('sort') || 'newest';
  const cursor = searchParams.get('cursor');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

  let tracks = [...MOCK_TRACKS];

  // Filter by platform
  if (platform === 'onchain') {
    tracks = tracks.filter(t =>
      (ONCHAIN_PLATFORMS as readonly string[]).includes(t.platform) && t.mediaType === MediaType.AUDIO
    );
  } else if (platform) {
    tracks = tracks.filter(t => t.platform === platform);
  }

  if (chain) tracks = tracks.filter(t => t.chain === chain);
  if (season) tracks = tracks.filter(t => t.season === season);
  if (mediaType) tracks = tracks.filter(t => t.mediaType === mediaType);
  if (artist) tracks = tracks.filter(t => t.artists.some(a => a.artist.slug === artist));

  // Sort
  switch (sort) {
    case 'oldest':
      tracks.sort((a, b) => new Date(a.releaseDate || 0).getTime() - new Date(b.releaseDate || 0).getTime());
      break;
    case 'most_collected':
      tracks.sort((a, b) => (b.totalMints || 0) - (a.totalMints || 0));
      break;
    case 'price_asc':
      tracks.sort((a, b) => parseFloat(a.mintPrice || '0') - parseFloat(b.mintPrice || '0'));
      break;
    case 'price_desc':
      tracks.sort((a, b) => parseFloat(b.mintPrice || '0') - parseFloat(a.mintPrice || '0'));
      break;
    default:
      tracks.sort((a, b) => new Date(b.releaseDate || 0).getTime() - new Date(a.releaseDate || 0).getTime());
  }

  // Cursor-based pagination
  const total = tracks.length;
  let startIndex = 0;
  if (cursor) {
    const cursorIndex = tracks.findIndex(t => t.id === cursor);
    if (cursorIndex !== -1) startIndex = cursorIndex + 1;
  }

  const paginatedTracks = tracks.slice(startIndex, startIndex + limit);
  const nextCursor = startIndex + limit < total ? paginatedTracks[paginatedTracks.length - 1]?.id || null : null;

  return NextResponse.json({
    tracks: paginatedTracks,
    nextCursor,
    total,
  });
}
