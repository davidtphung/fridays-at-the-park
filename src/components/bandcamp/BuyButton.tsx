import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface BuyButtonProps {
  url: string;
  price?: string;
}

export function BuyButton({ url, price }: BuyButtonProps) {
  return (
    <Button
      variant="primary"
      size="sm"
      rightIcon={<ExternalLink size={14} />}
      onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
    >
      {price ? `Buy — ${price}` : 'Buy on Bandcamp'}
    </Button>
  );
}
