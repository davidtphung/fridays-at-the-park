import { Music, Search, Film } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'music' | 'search' | 'video';
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const icons = {
  music: Music,
  search: Search,
  video: Film,
};

export function EmptyState({ icon = 'music', title, description, action }: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center" role="status">
      <div className="p-4 rounded-full bg-bg-tertiary mb-4">
        <Icon size={32} className="text-text-secondary" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-text-secondary max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
