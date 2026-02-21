'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Diamond, Music, Play } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';
import { usePlayerStore } from '@/stores/playerStore';

const iconMap = {
  diamond: Diamond,
  music: Music,
  play: Play,
} as const;

export function MobileTabBar() {
  const pathname = usePathname();
  const currentTrack = usePlayerStore((s) => s.currentTrack);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-bg-primary/90 backdrop-blur-xl border-t border-border"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        bottom: currentTrack ? 'var(--spacing-player-mobile)' : '0',
      }}
      aria-label="Tab navigation"
    >
      <div className="flex items-center justify-around h-14">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-0.5 flex-1 py-2 min-h-[44px]
                transition-colors
                ${isActive ? 'text-accent' : 'text-text-secondary'}
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} aria-hidden="true" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
