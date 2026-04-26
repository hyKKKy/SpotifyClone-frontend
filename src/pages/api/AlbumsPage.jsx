import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../features/context/AppContext';
import EndpointHero from '../../shared/ui/EndpointHero';

function albumCoverUrl(resolveBackendUrl, coverUrl) {
  return coverUrl ? resolveBackendUrl(coverUrl) : null;
}

export default function AlbumsPage() {
  const { request, resolveBackendUrl } = useContext(AppContext);
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAlbums() {
      setIsLoading(true);
      setError('');

      try {
        const payload = await request('/api/albums');
        if (isMounted) {
          setAlbums(Array.isArray(payload.data) ? payload.data : []);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message);
          setAlbums([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadAlbums();

    return () => {
      isMounted = false;
    };
  }, [request]);

  return (
    <section className="page-shell">
      <EndpointHero
        description="This page calls the backend album list, renders uploaded covers, and gives you a quick jump to the create flow."
        endpoint="/api/albums"
        method="GET"
        title="Browse albums"
      >
        <p className="eyebrow">Live result</p>
        <h3>{isLoading ? 'Loading catalog' : `${albums.length} album${albums.length === 1 ? '' : 's'} found`}</h3>
        <p>{error || 'Album artwork is loaded through the backend file routes.'}</p>
      </EndpointHero>

      {error ? <div className="status-banner status-banner--error">{error}</div> : null}

      <div className="button-row">
        <Link className="button button-primary" to="/albums/add">
          Add album
        </Link>
      </div>

      {isLoading ? (
        <article className="surface-card">
          <p className="empty-state">Loading albums from the backend.</p>
        </article>
      ) : albums.length ? (
        <div className="album-grid">
          {albums.map((album) => {
            const coverUrl = albumCoverUrl(resolveBackendUrl, album.coverUrl);

            return (
              <article className="surface-card album-card" key={album.id}>
                <div className="album-cover">
                  {coverUrl ? <img alt={album.title} src={coverUrl} /> : <span>No cover uploaded</span>}
                </div>
                <div className="album-meta">
                  <h3>{album.title}</h3>
                  <p>{album.artist}</p>
                  <dl className="detail-list">
                    <div>
                      <dt>Release</dt>
                      <dd>{album.releaseDate}</dd>
                    </div>
                    <div>
                      <dt>Album id</dt>
                      <dd>{album.id}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <article className="surface-card">
          <p className="empty-state">No albums are available yet. Add the first one to test the upload flow.</p>
        </article>
      )}
    </section>
  );
}
