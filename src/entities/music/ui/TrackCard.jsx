import { Pause, Play } from 'lucide-react';
import { useAppContext } from '@shared/lib/app-context';
import './TrackCard.css';

export default function TrackCard({ action = null, resolveBackendUrl, track }) {
  const { player } = useAppContext();
  const canPlay = Boolean(track.url && resolveBackendUrl(track.url));
  const isActive = String(player.currentTrack?.id) === String(track.id);

  return (
    <article className={isActive ? 'track-card track-card--active' : 'track-card'}>
      <div className="track-card__main">
        <div className="track-card__copy">
          <h3>{track.title}</h3>
          <p>{track.artist}</p>
          <span>
            {track.albumTitle || `Album ${track.albumId || 'unknown'}`}
            {track.genreName ? ` - ${track.genreName}` : ''}
          </span>
        </div>
      </div>

      <div className="track-card__player">
        <button
          className="track-card__playButton"
          disabled={!canPlay}
          onClick={() => (isActive ? player.togglePlay() : player.playTrack(track))}
          type="button"
        >
          {isActive && player.isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          <span>{canPlay ? (isActive && player.isPlaying ? 'Pause' : 'Play') : 'No audio'}</span>
        </button>
      </div>

      {action ? <div className="track-card__actions">{action}</div> : null}
    </article>
  );
}
