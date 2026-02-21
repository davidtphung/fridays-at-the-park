import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { Footer } from '@/components/layout/Footer';
import { SkipNav } from '@/components/layout/SkipNav';
import { GlobalPlayer } from '@/components/player/GlobalPlayer';
import { Providers } from './providers';

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
          <SkipNav />
          <Header />
          <main id="main-content" role="main" className="min-h-screen pb-[72px] md:pb-[72px]">
            {children}
          </main>
          <Footer />
          <GlobalPlayer />
          <MobileTabBar />
        </Providers>
      </body>
    </html>
  );
}
