import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchPageContent } from './content';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search tracks, artists, and episodes on Fridays at the Park.',
};

export default function SearchPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      <Suspense fallback={<div className="text-text-secondary text-center py-12">Loading...</div>}>
        <SearchPageContent />
      </Suspense>
    </div>
  );
}
