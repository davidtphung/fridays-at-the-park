import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { Footer } from '@/components/layout/Footer';
import { SkipNav } from '@/components/layout/SkipNav';
import { GlobalPlayer } from '@/components/player/GlobalPlayer';
import { Providers } from './providers';
import { EmbedChrome } from '@/components/layout/EmbedChrome';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Fridays at the Park — Music Aggregator',
    template: '%s | Fridays at the Park',
  },
  description: 'A music discovery platform aggregating all music from The Park collective. Onchain music, Bandcamp, episodes, and more.',
  openGraph: {
    title: 'Fridays at the Park — Music Aggregator',
    description: 'Discover music from The Park collective across onchain platforms, Bandcamp, YouTube, and streaming.',
    type: 'website',
    siteName: 'Fridays at the Park',
  },
  // PWA / iOS Safari address-bar tinting
  appleWebApp: {
    capable: true,
    title: 'The Park',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

// `viewport-fit=cover` lets the page paint behind the iOS notch / home indicator;
// CSS uses `env(safe-area-inset-*)` to keep critical chrome out of those areas.
// `color-scheme: dark` tells the browser to use dark form controls and scrollbars.
// `themeColor` paints the iOS status bar / Android URL bar to match the app shell.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  colorScheme: 'dark',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Preconnect to the hosts we hit on first interaction so DNS + TLS happen
            before the user presses play. Saves 100–300 ms on the first audio /
            video / thumbnail fetch in cold-cache conditions. */}
        <link rel="preconnect" href="https://dweb.link" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="dns-prefetch" href="https://arweave.net" />
        <link rel="dns-prefetch" href="https://gateway.pinata.cloud" />
        <link rel="dns-prefetch" href="https://nouns.build" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-bg-primary text-text-primary`}>
        <Providers>
          {/* EmbedChrome reads ?embed=1 / ?embed=true from the URL on the client
              and toggles a `data-embed="1"` attribute on <html>. CSS in
              globals.css hides .embed-hide elements when that attribute is
              present — perfect for hosting inside fridaysatthepark.org. */}
          <EmbedChrome />
          <SkipNav />
          <div className="embed-hide"><Header /></div>
          <main id="main-content" role="main" className="min-h-screen pb-[72px] md:pb-[72px]">
            {children}
          </main>
          <div className="embed-hide"><Footer /></div>
          <GlobalPlayer />
          <div className="embed-hide"><MobileTabBar /></div>
        </Providers>
      </body>
    </html>
  );
}
