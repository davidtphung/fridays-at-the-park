import { NextRequest, NextResponse } from 'next/server';
import { getMockEpisodes } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const season = searchParams.get('season') || undefined;

  const episodes = getMockEpisodes(season);

  return NextResponse.json({ episodes });
}
