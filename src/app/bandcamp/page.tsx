import type { Metadata } from 'next';
import { BandcampContent } from './content';

export const metadata: Metadata = {
  title: 'Bandcamp',
  description: 'Listen to and buy music from The Park collective on Bandcamp.',
};

export default function BandcampPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Bandcamp</h1>
        <p className="text-text-secondary text-sm mt-1">Albums and tracks available on Bandcamp</p>
      </div>
      <BandcampContent />
    </div>
  );
}
