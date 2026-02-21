'use client';

interface SeasonSelectorProps {
  seasons: string[];
  activeSeason: string;
  onSeasonChange: (season: string) => void;
}

export function SeasonSelector({ seasons, activeSeason, onSeasonChange }: SeasonSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none" role="tablist" aria-label="Season selector">
      <button
        role="tab"
        aria-selected={activeSeason === ''}
        onClick={() => onSeasonChange('')}
        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] ${
          activeSeason === ''
            ? 'bg-accent text-white'
            : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
        }`}
      >
        All Seasons
      </button>
      {seasons.map(season => (
        <button
          key={season}
          role="tab"
          aria-selected={activeSeason === season}
          onClick={() => onSeasonChange(season)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] ${
            activeSeason === season
              ? 'bg-accent text-white'
              : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
          }`}
        >
          {season}
        </button>
      ))}
    </div>
  );
}
