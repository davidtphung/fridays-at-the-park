interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className = '', variant = 'rect', width, height }: SkeletonProps) {
  const variantStyles = {
    rect: 'rounded-card',
    circle: 'rounded-full',
    text: 'rounded-md h-4',
  };

  return (
    <div
      className={`animate-shimmer ${variantStyles[variant]} ${className}`}
      style={{ width, height }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function TrackCardSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="Loading track">
      <Skeleton className="aspect-square w-full" />
      <Skeleton variant="text" className="w-3/4 h-4" />
      <Skeleton variant="text" className="w-1/2 h-3" />
      <span className="sr-only">Loading track...</span>
    </div>
  );
}

export function EpisodeCardSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="Loading episode">
      <Skeleton className="aspect-video w-full" />
      <Skeleton variant="text" className="w-3/4 h-4" />
      <Skeleton variant="text" className="w-1/2 h-3" />
      <span className="sr-only">Loading episode...</span>
    </div>
  );
}
