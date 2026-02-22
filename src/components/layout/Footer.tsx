import { SOCIAL_LINKS, SITE_NAME } from '@/lib/constants';
import { ExternalLink } from '@/components/ui/ExternalLink';

export function Footer() {
  return (
    <footer className="border-t border-border" role="contentinfo">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 text-text-primary font-bold text-lg mb-3">
              <span className="text-accent" aria-hidden="true">&#9670;</span>
              {SITE_NAME}
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              A music collective producing original music with friends onchain every Friday.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">Navigate</h3>
            <ul className="space-y-2">
              <li><a href="/onchain" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Onchain Music</a></li>
              <li><ExternalLink href="https://thepark.bandcamp.com/music" className="text-sm text-text-secondary hover:text-text-primary">Bandcamp</ExternalLink></li>
              <li><a href="/episodes" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Episodes</a></li>
              <li><a href="/dao" className="text-sm text-text-secondary hover:text-text-primary transition-colors">DAO</a></li>
              <li><a href="/org" className="text-sm text-text-secondary hover:text-text-primary transition-colors">ORG</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">Connect</h3>
            <ul className="space-y-2">
              <li><ExternalLink href={SOCIAL_LINKS.twitter} className="text-sm text-text-secondary hover:text-accent">X / Twitter</ExternalLink></li>
              <li><ExternalLink href={SOCIAL_LINKS.farcaster} className="text-sm text-text-secondary hover:text-accent">Farcaster</ExternalLink></li>
              <li><ExternalLink href={SOCIAL_LINKS.instagram} className="text-sm text-text-secondary hover:text-accent">Instagram</ExternalLink></li>
              <li><ExternalLink href={SOCIAL_LINKS.zora} className="text-sm text-text-secondary hover:text-accent">Zora</ExternalLink></li>
              <li><ExternalLink href={SOCIAL_LINKS.org} className="text-sm text-text-secondary hover:text-accent">Fridays at The Park ORG</ExternalLink></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">Info</h3>
            <ul className="space-y-2">
              <li><a href="https://thepark.wtf" target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary hover:text-text-primary transition-colors">thepark.wtf</a></li>
              <li><ExternalLink href="https://fridaysatthepark.org/" className="text-sm text-text-secondary hover:text-text-primary">fridaysatthepark.org</ExternalLink></li>
              <li><span className="text-sm text-text-secondary font-mono">thepark.eth</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-secondary">
            &copy; {new Date().getFullYear()} {SITE_NAME}. Music lives onchain.
          </p>
          <p className="text-xs text-text-secondary">
            Built by{' '}
            <a
              href="https://x.com/davidtphung"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-primary hover:text-accent transition-colors font-medium"
            >
              David T Phung
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
