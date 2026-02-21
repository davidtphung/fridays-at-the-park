import { NextRequest, NextResponse } from 'next/server';
import { getMockArtist, getArtistTracks } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const artist = getMockArtist(slug);

  if (!artist) {
    return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
  }

  const tracks = getArtistTracks(slug);

  return NextResponse.json({
    artist: { ...artist, tracks, trackCount: tracks.length },
  });
}
