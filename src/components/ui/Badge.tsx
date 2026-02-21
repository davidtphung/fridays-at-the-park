import { Platform, Chain, PLATFORM_LABELS, CHAIN_LABELS } from '@/types/platform';

type BadgeVariant = 'default' | 'platform' | 'chain' | 'season' | 'price' | 'live';

interface BadgeProps {
  variant?: BadgeVariant;
  platform?: Platform;
  chain?: Chain;
  children?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-bg-tertiary text-text-secondary',
  platform: 'bg-bg-tertiary text-text-primary',
  chain: 'text-white text-xs',
  season: 'bg-accent/10 text-accent',
  price: 'bg-success/10 text-success',
  live: 'bg-accent text-white animate-pulse',
};

const chainColors: Record<Chain, string> = {
  [Chain.ETHEREUM]: 'bg-chain-eth',
  [Chain.BASE]: 'bg-chain-base',
  [Chain.OPTIMISM]: 'bg-[#FF0420]',
  [Chain.POLYGON]: 'bg-[#8247E5]',
  [Chain.NONE]: 'bg-bg-tertiary',
};

export function Badge({ variant = 'default', platform, chain, children, className = '' }: BadgeProps) {
  const content = platform ? PLATFORM_LABELS[platform] : chain ? CHAIN_LABELS[chain] : children;
  const chainStyle = chain ? chainColors[chain] : '';

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium
        ${variant === 'chain' ? chainStyle : variantStyles[variant]}
        ${className}
      `}
    >
      {chain === Chain.ETHEREUM && (
        <svg width="10" height="10" viewBox="0 0 10 16" fill="currentColor" aria-hidden="true">
          <path d="M5 0L0 8.2L5 11.2L10 8.2L5 0Z" opacity="0.6" />
          <path d="M5 11.2L0 8.2L5 16L10 8.2L5 11.2Z" />
        </svg>
      )}
      {chain === Chain.BASE && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="12" r="12" />
        </svg>
      )}
      {content}
    </span>
  );
}
