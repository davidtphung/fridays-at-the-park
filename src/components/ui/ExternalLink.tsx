import { ExternalLink as ExternalLinkIcon } from 'lucide-react';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

export function ExternalLink({ href, children, className = '', showIcon = true }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-accent hover:text-accent-hover transition-colors ${className}`}
    >
      {children}
      {showIcon && <ExternalLinkIcon size={14} aria-hidden="true" />}
    </a>
  );
}
