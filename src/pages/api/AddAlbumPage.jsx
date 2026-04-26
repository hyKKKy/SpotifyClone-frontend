import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../features/context/AppContext';

export default function AddAlbumPage() {
  const { refreshCatalog, request, resolveBackendUrl } = useContext(AppContext);
  const [createdAlbum, setCreatedAlbum] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData(form);
      const payload = await request('/api/albums/add', {
        method: 'POST',
        body: formData,
      });

      setCreatedAlbum(payload.data || null);
      await refreshCatalog();
      form.reset();
    } catch (requestError) {
      setError(requestError.message);
      setCreatedAlbum(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="music-page page-shell">
      <div className="listen-hero listen-hero--compact">
        <div className="listen-hero__copy">
          <p className="eyebrow">Studio</p>
          <h2>Create a new album and publish it into the listener views.</h2>
          <p>
            Albums created here appear on the home page, browse page, and album library as soon as the request finishes.
          </p>
        </div>

        <div className="surface-card hero-summary">
          <p className="eyebrow">Expected fields</p>
          <div className="pill-list">
            <span>album-title</span>
            <span>album-artist</span>
            <span>album-release-date</span>
            <span>album-cover</span>
          </div>
        </div>
      </div>

      {error ? <div className="status-banner status-banner--error">{error}</div> : null}

      <div className="panel-grid">
        <form className="surface-card form-panel form-grid" onSubmit={handleSubmit}>
          <div className="form-grid form-grid--two">
            <div className="field">
              <label htmlFor="album-title">Album title</label>
              <input id="album-title" name="album-title" placeholder="Midnight Echoes" required type="text" />
            </div>

            <div className="field">
              <label htmlFor="album-artist">Artist</label>
              <input id="album-artist" name="album-artist" placeholder="Nova Pulse" required type="text" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="album-release-date">Release date</label>
            <input
              defaultValue={new Date().toISOString().slice(0, 10)}
              id="album-release-date"
              name="album-release-date"
              required
              type="date"
            />
          </div>

          <div className="field">
            <label htmlFor="album-cover">Cover art</label>
            <input accept="image/*" id="album-cover" name="album-cover" type="file" />
          </div>

          <div className="button-row">
            <button className="button button-primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Uploading album...' : 'Create album'}
            </button>
            <Link className="button button-secondary" to="/studio">
              Back to studio
            </Link>
          </div>
        </form>

        <article className="surface-card result-panel">
          <p className="eyebrow">Latest response</p>
          {createdAlbum ? (
            <div className="preview-panel">
              <h3>{createdAlbum.title}</h3>
              <p className="response-code">Album id: {createdAlbum.id}</p>
              <div className="preview-frame">
                {createdAlbum.coverUrl ? (
                  <img alt={createdAlbum.title} src={resolveBackendUrl(createdAlbum.coverUrl)} />
                ) : (
                  <span>No cover uploaded for this album.</span>
                )}
              </div>
            </div>
          ) : (
            <p className="empty-state">Submit the form to see the created album payload and its artwork preview here.</p>
          )}
        </article>
      </div>
    </section>
  );
}
