import { NextResponse } from 'next/server';
import { getMockFeaturedTracks } from '@/lib/mock-data';

export async function GET() {
  const featured = getMockFeaturedTracks();
  return NextResponse.json({ tracks: featured });
}
