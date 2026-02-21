import type { Metadata } from 'next';
import { EpisodesContent } from './content';

export const metadata: Metadata = {
  title: 'Episodes',
  description: 'Watch video episodes from Fridays at the Park, organized by season.',
};

export default function EpisodesPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Episodes</h1>
        <p className="text-text-secondary text-sm mt-1">Video sessions from the studio, organized by season</p>
      </div>
      <EpisodesContent />
    </div>
  );
}
