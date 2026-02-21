import { NextRequest, NextResponse } from 'next/server';
import { getMockTrack, MOCK_TRACKS } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const track = getMockTrack(id);

  if (!track) {
    return NextResponse.json({ error: 'Track not found' }, { status: 404 });
  }

  // Get related tracks
  const relatedTracks = MOCK_TRACKS.filter(t => {
    if (t.id === track.id) return false;
    if (track.season && t.season === track.season) return true;
    return t.artists.some(a => track.artists.some(ta => ta.artistId === a.artistId));
  }).slice(0, 10);

  return NextResponse.json({
    track: { ...track, relatedTracks },
  });
}
