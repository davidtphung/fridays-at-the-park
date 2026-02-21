'use client';

import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Track } from '@/types/track';
import { PLATFORM_LABELS } from '@/types/platform';
import { formatMintPrice } from '@/lib/format';

interface MintButtonProps {
  track: Track;
  size?: 'sm' | 'md' | 'lg';
}

export function MintButton({ track, size = 'md' }: MintButtonProps) {
  if (!track.mintUrl) return null;

  const label = `Collect on ${PLATFORM_LABELS[track.platform]}`;
  const price = formatMintPrice(track.mintPrice);

  return (
    <Button
      variant="primary"
      size={size}
      rightIcon={<ExternalLink size={14} aria-hidden="true" />}
      onClick={(e) => {
        e.preventDefault();
        window.open(track.mintUrl!, '_blank', 'noopener,noreferrer');
      }}
    >
      {label} {price !== 'Free' && `— ${price}`}
    </Button>
  );
}
