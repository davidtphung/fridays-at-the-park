import type { Metadata } from 'next';
import { DAOContent } from './content';

export const metadata: Metadata = {
  title: 'DAO',
  description: 'The Park DAO — an experiment supporting music onchain through creation, curation, collection, and great coffee.',
};

export default function DAOPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">The Park DAO</h1>
        <p className="text-text-secondary text-sm mt-1">An experiment supporting music onchain through creation, curation, collection, and great coffee</p>
      </div>
      <DAOContent />
    </div>
  );
}
