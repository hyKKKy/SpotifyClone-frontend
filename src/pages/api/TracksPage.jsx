import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../features/context/AppContext';
import EmptyStateCard from '../../shared/ui/EmptyStateCard';
import SectionHeading from '../../shared/ui/SectionHeading';
import TrackCard from '../../shared/ui/TrackCard';

export default function TracksPage() {
  const { catalog, isAdmin, isAuthenticated, refreshCatalog, request, resolveBackendUrl } = useContext(AppContext);
  const [deletingTrackId, setDeletingTrackId] = useState(null);
  const [operationError, setOperationError] = useState('');

  const handleDeleteTrack = async (track) => {
    if (!window.confirm(`Delete "${track.title}"?`)) {
      return;
    }

    setDeletingTrackId(track.id);
    setOperationError('');

    try {
      await request(`/api/tracks/delete/${track.id}`, { method: 'DELETE' });
      await refreshCatalog();
    } catch (requestError) {
      setOperationError(requestError.message);
    } finally {
      setDeletingTrackId(null);
    }
  };

  return (
    <section className="music-page page-shell">
      {catalog.error ? <div className="status-banner status-banner--error">{catalog.error}</div> : null}
      {operationError ? <div className="status-banner status-banner--error">{operationError}</div> : null}

      <section className="content-block">
        <SectionHeading
          eyebrow="Library"
          title="Tracks"
          description={
            isAuthenticated
              ? `${catalog.tracks.length} tracks available for this session.`
              : 'Sign in to load the track catalog.'
          }
          action={
            isAdmin ? (
              <Link className="button button-primary" to="/tracks/add">
                Add track
              </Link>
            ) : null
          }
        />

        {catalog.isLoading ? (
          <EmptyStateCard title="Loading tracks" description="The track library is syncing with the backend." />
        ) : !isAuthenticated ? (
          <EmptyStateCard title="Sign in required" description="Tracks are visible to signed-in listeners and admins." />
        ) : catalog.tracks.length ? (
          <div className="track-list">
            {catalog.tracks.map((track) => (
              <TrackCard
                action={
                  isAdmin ? (
                    <div className="button-row media-card__button-row">
                      <Link className="button button-secondary" to={`/tracks/${track.id}/edit`}>
                        Edit
                      </Link>
                      <button
                        className="button button-danger"
                        disabled={deletingTrackId === track.id}
                        onClick={() => void handleDeleteTrack(track)}
                        type="button"
                      >
                        {deletingTrackId === track.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  ) : null
                }
                key={track.id}
                resolveBackendUrl={resolveBackendUrl}
                track={track}
              />
            ))}
          </div>
        ) : (
          <EmptyStateCard title="No tracks yet" description="Tracks will appear here once an admin uploads them." />
        )}
      </section>
    </section>
  );
}
