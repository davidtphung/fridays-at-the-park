import { Track } from './track';

export interface Episode extends Track {
  season: string;
  episode: number;
  videoUrl: string;
  thumbnailUrl?: string;
}

export interface SeasonGroup {
  season: string;
  label: string;
  episodes: Track[];
}
