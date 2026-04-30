import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@shared/lib/app-context';
import AlbumCard from '@entities/music/ui/AlbumCard';
import EmptyStateCard from '@shared/ui/EmptyStateCard';
import SectionHeading from '@shared/ui/SectionHeading';
import '@shared/styles/music-page.css';

export default function AlbumsPage() {
  const { catalog, isAdmin, refreshCatalog, request, resolveBackendUrl } = useAppContext();
  const [deletingAlbumId, setDeletingAlbumId] = useState(null);
  const [operationError, setOperationError] = useState('');

  const handleDeleteAlbum = async (album) => {
    if (!window.confirm(`Delete "${album.title}"?`)) {
      return;
    }

    setDeletingAlbumId(album.id);
    setOperationError('');

    try {
      await request(`/api/albums/delete/${album.id}`, { method: 'DELETE' });
      await refreshCatalog();
    } catch (requestError) {
      setOperationError(requestError.message);
    } finally {
      setDeletingAlbumId(null);
    }
  };

  return (
    <section className="music-page page-shell">
      {catalog.error ? <div className="status-banner status-banner--error">{catalog.error}</div> : null}
      {operationError ? <div className="status-banner status-banner--error">{operationError}</div> : null}

      <section className="content-block">
        <SectionHeading
          eyebrow="Library"
          title="Albums"
          description={catalog.albums.length ? `${catalog.albums.length} albums in your library.` : 'No albums yet.'}
          action={
            isAdmin ? (
              <Link className="button button-primary" to="/albums/add">
                Add album
              </Link>
            ) : null
          }
        />

        {catalog.isLoading ? (
          <EmptyStateCard title="Loading albums" description="The album library is syncing with the backend." />
        ) : catalog.albums.length ? (
          <div className="album-wall">
            {catalog.albums.map((album) => (
              <AlbumCard
                action={
                  isAdmin ? (
                    <div className="button-row media-card__button-row">
                      <Link className="button button-secondary" to={`/albums/${album.id}/edit`}>
                        Edit
                      </Link>
                      <button
                        className="button button-danger"
                        disabled={deletingAlbumId === album.id}
                        onClick={() => void handleDeleteAlbum(album)}
                        type="button"
                      >
                        {deletingAlbumId === album.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  ) : null
                }
                album={album}
                key={album.id}
                resolveBackendUrl={resolveBackendUrl}
              />
            ))}
          </div>
        ) : (
          <EmptyStateCard title="No albums yet" description="No albums are available yet. Add one from the admin studio." />
        )}
      </section>
    </section>
  );
}
