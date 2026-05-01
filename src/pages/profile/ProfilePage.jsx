import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '@shared/lib/app-context';
import TrackCard from '@entities/music/ui/TrackCard';
import EmptyStateCard from '@shared/ui/EmptyStateCard';
import SectionHeading from '@shared/ui/SectionHeading';
import '@shared/styles/music-page.css';
import './ProfilePage.css';

export default function ProfilePage() {
  const { auth, catalog, isAuthenticated, likedTracks, logout, resolveBackendUrl } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <section className="music-page page-shell profile-simple">
      <div className="profile-simple__greeting">
        <p className="eyebrow">Profile</p>
        <h2>{isAuthenticated ? `Hello, ${auth.userName}.` : 'Hello, guest.'}</h2>
      </div>

      

      <section className="content-block profile-simple__liked">
        <SectionHeading
          eyebrow="Your music"
          title="Liked tracks: "
          description={
            !isAuthenticated
              ? 'Sign in to keep a personal list of liked tracks.'
              : catalog.isLoading
          }
          action={
            isAuthenticated ? (
              <Link className="section-link" to="/tracks">
                Browse tracks
              </Link>
            ) : null
          }
        />

        {!isAuthenticated ? (
          <EmptyStateCard title="Sign in required" description="Liked tracks are saved separately for each user." />
        ) : catalog.isLoading ? (
          <EmptyStateCard title="Loading liked tracks" description="Your saved tracks are syncing with the catalog." />
        ) : likedTracks.likedTracks.length ? (
          <div className="track-list">
            {likedTracks.likedTracks.map((track) => (
              <TrackCard key={track.id} resolveBackendUrl={resolveBackendUrl} track={track} />
            ))}
          </div>
        ) : (
          <EmptyStateCard title="No liked tracks yet" description="Tap the heart on any track to save it here." />
        )}
      </section>
      <div className="profile-simple__bottom">
        {isAuthenticated ? (
          <button className="button button-primary" onClick={handleLogout} type="button">
            Log out
          </button>
        ) : (
          <Link className="button button-primary" to="/auth/login">
            Log in
          </Link>
        )}
      </div>
    </section>
  );
}
