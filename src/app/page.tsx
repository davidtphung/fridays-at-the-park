import { CoverFlowSection } from './cover-flow-section';
import { FeaturedGrid } from './featured-grid';
import { PlaylistRail } from '@/components/music/PlaylistRail';
import { getMockPlaylists } from '@/lib/mock-data';
import { SITE_NAME } from '@/lib/constants';

export default function HomePage() {
  const playlists = getMockPlaylists();

  return (
    <div>
      {/* Hero section */}
      <section className="pt-4 pb-8">
        <div className="text-center mb-2">
          <h1 className="text-display-mobile sm:text-display text-text-primary">
            {SITE_NAME}
          </h1>
          <p className="text-text-secondary text-sm sm:text-base mt-2 max-w-lg mx-auto px-4">
            Original music with friends, onchain, every Friday.
          </p>
        </div>
        <CoverFlowSection />
      </section>

      {/* Curated playlists rail — themed listening sessions over the catalog */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pb-8">
        <PlaylistRail playlists={playlists} />
      </section>

      {/* Featured tracks */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-xl font-bold text-text-primary mb-6">Latest Releases</h2>
        <FeaturedGrid />
      </section>
    </div>
  );
}
