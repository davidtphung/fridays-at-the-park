import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'ORG',
  description: 'Fridays at The Park Organization — fridaysatthepark.org',
};

/**
 * Server-side redirect: visiting /org sends you straight to the canonical
 * organisation site (fridaysatthepark.org, Gamma-hosted).
 *
 * Why a server redirect instead of the in-app iframe wrapper we used to
 * ship: the iframe was disrupting playback context and the user prefers
 * the real site. Doing this on the server means there's no flash of an
 * intermediate page, no client JS needed, and bookmarks to /org still
 * work — they just route through to the org site at the HTTP layer.
 *
 * The ORG nav item also jumps directly to fridaysatthepark.org (set in
 * src/lib/constants.ts) so most users skip this redirect entirely.
 */
export default function ORGPage() {
  redirect('https://fridaysatthepark.org/');
}
