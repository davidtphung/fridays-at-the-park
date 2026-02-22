import type { Metadata } from 'next';
import { SITE_NAME, SOCIAL_LINKS, PLATFORM_URLS } from '@/lib/constants';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { Platform } from '@/types/platform';

export const metadata: Metadata = {
  title: 'About',
  description: 'About The Park — a music collective producing original music with friends onchain every Friday.',
};

export default function AboutPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-6">{SITE_NAME}</h1>

      <div className="prose prose-invert max-w-none space-y-6">
        <p className="text-lg text-text-secondary leading-relaxed">
          The Park is a music collective that produces original music with friends onchain every Friday.
        </p>

        <p className="text-text-secondary leading-relaxed">
          What started as a weekly creative gathering has grown into a catalog of songs, sessions, and
          video episodes spanning genres from jazz and neo-soul to electronic and experimental music.
          Every session brings together different musicians, producers, and engineers to create
          something new.
        </p>

        <p className="text-text-secondary leading-relaxed">
          Our music lives across the internet — on Zora, Catalog, Sound.xyz, Bandcamp, YouTube,
          Spotify, and Apple Music. This site brings it all together in one place, making it easy
          to discover, listen to, and collect everything from The Park.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Find Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ExternalLink href={SOCIAL_LINKS.website} className="text-base">thepark.wtf</ExternalLink>
            <ExternalLink href={SOCIAL_LINKS.twitter} className="text-base">X / Twitter</ExternalLink>
            <ExternalLink href={SOCIAL_LINKS.farcaster} className="text-base">Farcaster</ExternalLink>
            <ExternalLink href={SOCIAL_LINKS.org} className="text-base">Fridays at The Park ORG</ExternalLink>
            <ExternalLink href={SOCIAL_LINKS.instagram} className="text-base">Instagram</ExternalLink>
            <ExternalLink href={PLATFORM_URLS[Platform.ZORA]} className="text-base">Zora</ExternalLink>
            <ExternalLink href={PLATFORM_URLS[Platform.BANDCAMP]} className="text-base">Bandcamp</ExternalLink>
            <ExternalLink href={PLATFORM_URLS[Platform.YOUTUBE]} className="text-base">YouTube</ExternalLink>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-text-primary mb-4">The Crew</h2>
          <div className="space-y-4 text-sm text-text-secondary">
            <div>
              <h3 className="text-text-primary font-medium mb-1">Musicians</h3>
              <p>Julius Rodriguez, WaveIQ, Baby Rose, Georgia Anne Muldrow, Tim Anderson, Josh Lippi, Ben Schwier, Derek Taylor, Chloe Angelides, ToBi, MoRuf, Leon Knight, Jessie Boykins III, Ti Steele, Ray Barbee, Nate Mercereau</p>
            </div>
            <div>
              <h3 className="text-text-primary font-medium mb-1">Engineering</h3>
              <p>Maddi StJohn, Ariel Klevecz</p>
            </div>
            <div>
              <h3 className="text-text-primary font-medium mb-1">Film</h3>
              <p>Ryan Kontra</p>
            </div>
          </div>
        </section>

        <section className="mt-10 p-6 bg-bg-secondary rounded-2xl border border-border">
          <p className="text-sm text-text-secondary text-center font-mono">
            thepark.eth
          </p>
        </section>
      </div>
    </div>
  );
}
