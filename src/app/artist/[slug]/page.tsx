import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMockArtist, getArtistTracks } from '@/lib/mock-data';
import { ArtistPageContent } from './content';

interface ArtistPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artist = getMockArtist(slug);
  if (!artist) return { title: 'Artist Not Found' };

  return {
    title: artist.name,
    description: artist.bio || `Music by ${artist.name} on Fridays at the Park`,
  };
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { slug } = await params;
  const artist = getMockArtist(slug);

  if (!artist) {
    notFound();
  }

  const tracks = getArtistTracks(slug);

  return <ArtistPageContent artist={artist} tracks={tracks} />;
}
