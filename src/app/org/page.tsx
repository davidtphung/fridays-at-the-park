import type { Metadata } from 'next';
import { ORGEmbed } from './content';

export const metadata: Metadata = {
  title: 'ORG',
  description: 'Fridays at The Park Organization — fridaysatthepark.org',
};

// Full-bleed embed of fridaysatthepark.org. The page deliberately skips the
// usual `max-w-[1280px]` container chrome so the iframe fills the viewport
// between our sticky Header (top) and the GlobalPlayer (bottom).
export default function ORGPage() {
  return <ORGEmbed />;
}
