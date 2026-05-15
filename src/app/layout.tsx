import type { Metadata } from 'next';
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
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
