import { useContext } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import AppContext from '../../features/context/AppContext';
import './ui/Layout.css';
import {
  ListMusic,
  MonitorSpeaker,
  Music,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";

export default function Layout() {
  const { auth, catalog, isAdmin, isAuthenticated, logout, resolveBackendUrl } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarTracks = catalog.tracks.slice(0, 8);
  const currentTrack = catalog.tracks[0] || null;
  const isAuthScreen = location.pathname === '/auth/login' || location.pathname === '/auth/signup';

  const handleHeaderLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch {
      navigate('/auth/logout');
    }
  };

  return (
    <div className="layout-shell">
      <header className="spotify-header">
        
        <NavLink className="spotify-header__brand" to="/">
          <span className="spotify-header__brandMark">
            <Music size={18} />
          </span>
          <span className="spotify-header__brandText">
            <strong>Spotify</strong>
            <small>{isAdmin ? 'Studio mode' : isAuthenticated ? 'Premium' : 'Free'}</small>
          </span>
        </NavLink>

        <form className="spotify-header__search" role="search" onSubmit={(event) => event.preventDefault()}>
          <input aria-label="Search" placeholder="Search" type="search" />
        </form>

        <div className="spotify-header__left">
          {isAuthenticated ? (
            <>
              <NavLink className="button button-secondary spotify-header__button" to="/profile">
                {auth.userName || 'Profile'}
              </NavLink>
              <button className="button button-primary spotify-header__button" onClick={handleHeaderLogout} type="button">
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink className="button button-secondary spotify-header__button" to="/auth/login">
                Log in
              </NavLink>
              <NavLink className="button button-primary spotify-header__button" to="/auth/signup">
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </header>

      <div className={isAuthScreen ? 'spotify-shell spotify-shell--auth' : 'spotify-shell'}>
        {!isAuthScreen ? (
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
                    const content = (
                      <>
                        <span className="sidebar-track__index">{index + 1}</span>
                        <span className="sidebar-track__play">
                          <Play size={14} fill="currentColor" />
                        </span>
                        <span className="sidebar-track__meta">
                          <strong>{track.title}</strong>
                          <small>{track.artist}</small>
                        </span>
                      </>
                    );

                    return track.url ? (
                      <a className="sidebar-track" href={resolveBackendUrl(track.url)} key={track.id}>
                        {content}
                      </a>
                    ) : (
                      <div className="sidebar-track" key={track.id}>
                        {content}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="sidebar-tracks__empty">No tracks yet.</p>
              )}

              <div className="sidebar-session">
                <strong>{auth.userName || 'Guest listener'}</strong>
                <span>{isAdmin ? 'Studio access' : 'Listening now'}</span>
              </div>
            </div>
          </aside>
        ) : null}

        <div className={isAuthScreen ? 'spotify-main spotify-main--auth' : 'spotify-main'}>
          <main className="main-container">
            <Outlet />
          </main>

          <footer className="player-bar" aria-label="Music player">
            <div className="player-bar__track">
              <div className="player-bar__art">
                <Music size={18} />
              </div>
              <div className="player-bar__trackText">
                <strong>{currentTrack?.title || 'No track selected'}</strong>
                <span>{currentTrack?.artist || 'Unknown Artist'}</span>
              </div>
            </div>

            <div className="player-bar__center">
              <div className="player-bar__controls">
                <button aria-label="Shuffle" className="player-bar__control" disabled type="button">
                  <Shuffle size={17} />
                </button>
                <button aria-label="Previous track" className="player-bar__control" disabled type="button">
                  <SkipBack size={18} fill="currentColor" />
                </button>
                <button aria-label="Play" className="player-bar__play" disabled type="button">
                  <Play size={20} fill="currentColor" />
                </button>
                <button aria-label="Next track" className="player-bar__control" disabled type="button">
                  <SkipForward size={18} fill="currentColor" />
                </button>
                <button aria-label="Repeat" className="player-bar__control" disabled type="button">
                  <Repeat size={17} />
                </button>
              </div>

              <div className="player-bar__progress" aria-label="Playback progress">
                <span>0:00</span>
                <div className="player-bar__rail">
                  <span />
                </div>
                <span>0:00</span>
              </div>
            </div>

            <div className="player-bar__tools">
              <button aria-label="Queue" className="player-bar__control" disabled type="button">
                <ListMusic size={18} />
              </button>
              <button aria-label="Devices" className="player-bar__control" disabled type="button">
                <MonitorSpeaker size={18} />
              </button>
              <Volume2 size={18} />
              <div className="player-bar__volume" aria-label="Volume">
                <span />
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
