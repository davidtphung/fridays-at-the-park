import { Platform, Chain } from '@/types/platform';
import { Badge } from '@/components/ui/Badge';

interface OnchainBadgeProps {
  platform: Platform;
  chain: Chain;
  className?: string;
}

export function OnchainBadge({ platform, chain, className = '' }: OnchainBadgeProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Badge variant="platform" platform={platform} />
      {chain !== Chain.NONE && <Badge variant="chain" chain={chain} />}
    </div>
  );
}
