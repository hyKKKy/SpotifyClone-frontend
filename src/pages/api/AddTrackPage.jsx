import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../features/context/AppContext';
import EndpointHero from '../../shared/ui/EndpointHero';

export default function AddTrackPage() {
  const { request, resolveBackendUrl } = useContext(AppContext);
  const [albums, setAlbums] = useState([]);
  const [createdTrack, setCreatedTrack] = useState(null);
  const [error, setError] = useState('');
  const [albumsError, setAlbumsError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadAlbums() {
      try {
        const payload = await request('/api/albums');
        if (isMounted) {
          setAlbums(Array.isArray(payload.data) ? payload.data : []);
        }
      } catch (requestError) {
        if (isMounted) {
          setAlbumsError(requestError.message);
          setAlbums([]);
        }
      }
    }

    void loadAlbums();

    return () => {
      isMounted = false;
    };
  }, [request]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const payload = await request('/api/tracks/add', {
        method: 'POST',
        body: formData,
      });

      setCreatedTrack(payload.data || null);
      event.currentTarget.reset();
    } catch (requestError) {
      setError(requestError.message);
      setCreatedTrack(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-shell">
      <EndpointHero
        description="The frontend is wired to the live track upload endpoint and uses the album catalog as the source for the album selector."
        endpoint="/api/tracks/add"
        method="POST"
        title="Add a track"
      >
        <p className="eyebrow">Backend caveat</p>
        <p>
          The current backend action does not accept a genre even though the database model requires one. If this page
          fails after upload, that server action needs a small follow-up fix.
        </p>
      </EndpointHero>

      {albumsError ? <div className="status-banner status-banner--error">{albumsError}</div> : null}
      {error ? <div className="status-banner status-banner--error">{error}</div> : null}
      <div className="status-banner status-banner--warning">
        The form is connected and ready. A server-side `GenreId` mismatch may still block successful inserts until the backend is adjusted.
      </div>

      <div className="panel-grid">
        <form className="surface-card form-panel form-grid" onSubmit={handleSubmit}>
          <div className="form-grid form-grid--two">
            <div className="field">
              <label htmlFor="track-title">Track title</label>
              <input id="track-title" name="track-title" placeholder="Glass Hearts" required type="text" />
            </div>

            <div className="field">
              <label htmlFor="track-artist">Artist</label>
              <input id="track-artist" name="track-artist" placeholder="Nova Pulse" required type="text" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="track-album-id">Album</label>
            <select defaultValue="" id="track-album-id" name="track-album-id" required>
              <option disabled value="">
                Select an album
              </option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title} by {album.artist}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="track-file">Audio file</label>
            <input accept="audio/*" id="track-file" name="track-file" required type="file" />
          </div>

          <div className="button-row">
            <button className="button button-primary" disabled={isSubmitting || !albums.length} type="submit">
              {isSubmitting ? 'Uploading track...' : 'Create track'}
            </button>
            <Link className="button button-secondary" to="/albums">
              Back to albums
            </Link>
          </div>

          {!albums.length ? (
            <p className="helper-copy">You need at least one album before a track can be attached to it.</p>
          ) : null}
        </form>

        <article className="surface-card result-panel">
          <p className="eyebrow">Latest response</p>
          {createdTrack ? (
            <div className="preview-panel">
              <h3>{createdTrack.title}</h3>
              <p className="response-code">Track id: {createdTrack.id}</p>
              <div className="preview-frame">
                {createdTrack.url ? (
                  <audio controls src={resolveBackendUrl(createdTrack.url)} />
                ) : (
                  <span>The backend returned an empty track URL.</span>
                )}
              </div>
            </div>
          ) : (
            <p className="empty-state">Submit a track to inspect the backend response and preview the uploaded audio.</p>
          )}
        </article>
      </div>
    </section>
  );
}
