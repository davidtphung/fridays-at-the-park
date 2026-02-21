import type { Metadata } from 'next';
import { OnchainContent } from './content';

export const metadata: Metadata = {
  title: 'Onchain Music',
  description: 'Explore onchain music from The Park collective on Zora, Catalog, and Sound.xyz.',
};

export default function OnchainPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Onchain Music</h1>
        <p className="text-text-secondary text-sm mt-1">Collect music minted on Zora, Catalog, and Sound.xyz</p>
      </div>
      <OnchainContent />
    </div>
  );
}
