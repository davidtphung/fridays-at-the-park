import { Track } from '@/types/track';
import { Badge } from '@/components/ui/Badge';
import { MintButton } from '@/components/music/MintButton';
import { formatDate, formatSeasonEpisode } from '@/lib/format';

interface EpisodeDetailProps {
  episode: Track;
}

export function EpisodeDetail({ episode }: EpisodeDetailProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {episode.season && <Badge variant="season">{formatSeasonEpisode(episode.season, episode.episode)}</Badge>}
        {episode.releaseDate && <span className="text-xs text-text-secondary">{formatDate(episode.releaseDate)}</span>}
      </div>

      {episode.description && (
        <p className="text-sm text-text-secondary leading-relaxed">{episode.description}</p>
      )}

      {/* Credits */}
      {episode.credits && Object.keys(episode.credits).length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-2">Credits</h3>
          <div className="text-xs text-text-secondary space-y-1">
            {Object.entries(episode.credits).map(([role, names]) => (
              <p key={role}>
                <span className="capitalize">{role}:</span>{' '}
                {Array.isArray(names) ? names.join(', ') : String(names)}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Mint button if onchain */}
      {episode.mintUrl && <MintButton track={episode} size="sm" />}
    </div>
  );
}
