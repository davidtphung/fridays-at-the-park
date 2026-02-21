import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMockTrack, MOCK_TRACKS } from '@/lib/mock-data';
import { TrackDetailContent } from './content';

interface TrackPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TrackPageProps): Promise<Metadata> {
  const { id } = await params;
  const track = getMockTrack(id);
  if (!track) return { title: 'Track Not Found' };

  const artistNames = track.artists.map(a => a.artist.name).join(', ');
  return {
    title: `${track.title} by ${artistNames}`,
    description: track.description || `Listen to ${track.title} by ${artistNames}`,
    openGraph: {
      title: track.title,
      description: `${track.title} by ${artistNames}`,
      images: [{ url: track.coverImage, width: 800, height: 800 }],
    },
  };
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { id } = await params;
  const track = getMockTrack(id);

  if (!track) {
    notFound();
  }

  // Get related tracks (same season or same artists)
  const relatedTracks = MOCK_TRACKS.filter(t => {
    if (t.id === track.id) return false;
    if (track.season && t.season === track.season) return true;
    return t.artists.some(a => track.artists.some(ta => ta.artistId === a.artistId));
  }).slice(0, 10);

  return <TrackDetailContent track={track} relatedTracks={relatedTracks} />;
}
