import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../features/context/AppContext';

export default function AddTrackPage() {
  const { catalog, request, resolveBackendUrl } = useContext(AppContext);
  const [createdTrack, setCreatedTrack] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setError('');
    setIsSubmitting(true);

    try {
      const formData = new FormData(form);
      const payload = await request('/api/tracks/add', {
        method: 'POST',
        body: formData,
      });

      setCreatedTrack(payload.data || null);
      form.reset();
    } catch (requestError) {
      setError(requestError.message);
      setCreatedTrack(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="music-page page-shell">
      <div className="listen-hero listen-hero--compact">
        <div className="listen-hero__copy">
          <p className="eyebrow">Studio</p>
          <h2>Upload a new track into an existing album.</h2>
          <p>
            Track uploads stay admin-only, and the album selector here is powered directly by the live catalog already
            loaded into the app.
          </p>
        </div>

        <div className="surface-card hero-summary">
          <p className="eyebrow">Album choices</p>
          <strong>{catalog.albums.length}</strong>
          <span>{catalog.albums.length ? 'Albums are ready for track assignment.' : 'Create an album before uploading tracks.'}</span>
        </div>
      </div>

      {error ? <div className="status-banner status-banner--error">{error}</div> : null}

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
              {catalog.albums.map((album) => (
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
            <button className="button button-primary" disabled={isSubmitting || !catalog.albums.length} type="submit">
              {isSubmitting ? 'Uploading track...' : 'Create track'}
            </button>
            <Link className="button button-secondary" to="/studio">
              Back to studio
            </Link>
          </div>

          {!catalog.albums.length ? (
            <p className="helper-copy">You need at least one album before a track can be attached to it.</p>
          ) : null}
          {error ? (
            <p className="helper-copy">
              If the error is a backend save failure, restart the backend bound to `https://localhost:7243` and try again.
            </p>
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
