import { useContext } from 'react';
import { Pause, Play } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import AppContext from '../../features/context/AppContext';
import './ui/TrackSidebar.css';

export default function TrackSidebar() {
  const { catalog, player } = useContext(AppContext);
  const sidebarTracks = catalog.tracks.slice(0, 8);
  const { currentTrack, isPlaying, playTrack, togglePlay } = player;

  return (
    <aside className="spotify-sidebar">
      <div className="sidebar-panel sidebar-tracks">
        <div className="sidebar-tracks__header">
          <div>
            <p className="eyebrow">Library</p>
            <NavLink className="sidebar-tracks__title" to="/tracks">
              Tracks
            </NavLink>
          </div>
          <span>{catalog.tracks.length}</span>
        </div>

        {catalog.isLoading ? (
          <p className="sidebar-tracks__empty">Loading tracks...</p>
        ) : sidebarTracks.length ? (
          <div className="sidebar-track-list">
            {sidebarTracks.map((track, index) => {
              const isCurrentTrack = String(currentTrack?.id) === String(track.id);

              return (
                <button
                  className={isCurrentTrack ? 'sidebar-track sidebar-track--active' : 'sidebar-track'}
                  disabled={!track.url}
                  key={track.id}
                  onClick={() => (isCurrentTrack ? togglePlay() : playTrack(track))}
                  type="button"
                >
                  <span className="sidebar-track__index">{index + 1}</span>
                  <span className="sidebar-track__play">
                    {isCurrentTrack && isPlaying ? (
                      <Pause size={14} fill="currentColor" />
                    ) : (
                      <Play size={14} fill="currentColor" />
                    )}
                  </span>
                  <span className="sidebar-track__meta">
                    <strong>{track.title}</strong>
                    <small>{track.artist}</small>
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="sidebar-tracks__empty">No tracks yet.</p>
        )}
      </div>
    </aside>
  );
}
