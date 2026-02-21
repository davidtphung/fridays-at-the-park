import { NextRequest, NextResponse } from 'next/server';
import { searchMockData, MOCK_TRACKS } from '@/lib/mock-data';
import { MediaType } from '@/types/platform';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';
  const limit = parseInt(searchParams.get('limit') || '20');

  if (!q.trim()) {
    return NextResponse.json({
      tracks: [],
      artists: [],
      episodes: [],
      query: q,
      totalHits: 0,
    });
  }

  const results = searchMockData(q);

  const tracks = type === 'episodes' ? [] : results.tracks.filter(t => t.mediaType !== MediaType.VIDEO).slice(0, limit);
  const artists = type === 'tracks' || type === 'episodes' ? [] : results.artists.map(a => ({
    ...a,
    trackCount: MOCK_TRACKS.filter(t => t.artists.some(ta => ta.artistId === a.id)).length,
  })).slice(0, limit);
  const episodes = type === 'tracks' || type === 'artists' ? [] : results.episodes.slice(0, limit);

  return NextResponse.json({
    tracks,
    artists,
    episodes,
    query: q,
    totalHits: tracks.length + artists.length + episodes.length,
  });
}
