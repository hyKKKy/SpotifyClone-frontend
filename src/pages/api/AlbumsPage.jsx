import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../features/context/AppContext';
import AlbumCard from '../../shared/ui/AlbumCard';
import EmptyStateCard from '../../shared/ui/EmptyStateCard';
import SectionHeading from '../../shared/ui/SectionHeading';

export default function AlbumsPage() {
  const { catalog, isAdmin, resolveBackendUrl } = useContext(AppContext);

  return (
    <section className="music-page page-shell">
      {catalog.error ? <div className="status-banner status-banner--error">{catalog.error}</div> : null}

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
              <AlbumCard album={album} key={album.id} resolveBackendUrl={resolveBackendUrl} />
            ))}
          </div>
        ) : (
          <EmptyStateCard title="No albums yet" description="No albums are available yet. Add one from the admin studio." />
        )}
      </section>
    </section>
  );
}
