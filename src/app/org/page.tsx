import type { Metadata } from 'next';
import { ORGContent } from './content';

export const metadata: Metadata = {
  title: 'ORG',
  description: 'Fridays at The Park Organization — fridaysatthepark.org',
};

export default function ORGPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">The Park ORG</h1>
        <p className="text-text-secondary text-sm mt-1">Fridays at The Park organization and community hub</p>
      </div>
      <ORGContent />
    </div>
  );
}
