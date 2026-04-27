import { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../../features/context/AppContext';
import '../music/MusicPage.css';
import '../music/ListenHero.css';

const todayInputValue = () => new Date().toISOString().slice(0, 10);

const emptyFormValues = () => ({
  artist: '',
  releaseDate: todayInputValue(),
  title: '',
});

function toDateInputValue(value) {
  if (!value) {
    return todayInputValue();
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const parsedDate = new Date(value);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString().slice(0, 10);
  }

  const dateParts = String(value).match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);

  if (dateParts) {
    const [, firstPart, secondPart, year] = dateParts;
    const day = Number(firstPart) > 12 ? firstPart : secondPart;
    const month = Number(firstPart) > 12 ? secondPart : firstPart;

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return todayInputValue();
}

export default function AddAlbumPage() {
  const { albumId } = useParams();
  const { catalog, refreshCatalog, request, resolveBackendUrl } = useContext(AppContext);
  const isEditMode = Boolean(albumId);
  const selectedAlbum = useMemo(
    () => catalog.albums.find((album) => String(album.id) === String(albumId)),
    [albumId, catalog.albums],
  );
  const [formValues, setFormValues] = useState(emptyFormValues);
  const [savedAlbum, setSavedAlbum] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditMode) {
      setFormValues(emptyFormValues());
      return;
    }

    if (selectedAlbum) {
      setFormValues({
        artist: selectedAlbum.artist || '',
        releaseDate: toDateInputValue(selectedAlbum.releaseDate),
        title: selectedAlbum.title || '',
      });
    }
  }, [isEditMode, selectedAlbum]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    const fieldName = name.replace('album-', '').replace('-date', 'Date');

    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const formData = new FormData(form);
      const payload = await request(isEditMode ? `/api/albums/update/${albumId}` : '/api/albums/add', {
        method: isEditMode ? 'PUT' : 'POST',
        body: formData,
      });

      setSavedAlbum(payload.data || {
        ...selectedAlbum,
        artist: formValues.artist,
        releaseDate: formValues.releaseDate,
        title: formValues.title,
      });
      setSuccessMessage(isEditMode ? 'Album updated.' : 'Album created.');
      await refreshCatalog();

      if (!isEditMode) {
        setFormValues(emptyFormValues());
        form.reset();
      }
    } catch (requestError) {
      setError(requestError.message);
      setSavedAlbum(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isMissingAlbum = isEditMode && !catalog.isLoading && !selectedAlbum;
  const pageTitle = isEditMode ? 'Update an album already published in the listener views.' : 'Create a new album and publish it into the listener views.';
  const submitLabel = isEditMode ? 'Update album' : 'Create album';
  const submittingLabel = isEditMode ? 'Updating album...' : 'Uploading album...';

  return (
    <section className="music-page page-shell">
      <div className="listen-hero listen-hero--compact">
        <div className="listen-hero__copy">
          <p className="eyebrow">Studio</p>
          <h2>{pageTitle}</h2>
          <p>
            Albums saved here appear on the home page, browse page, and album library as soon as the request finishes.
          </p>
        </div>

        <div className="surface-card hero-summary">
          <p className="eyebrow">{isEditMode ? 'Editing' : 'Album records'}</p>
          <strong>{isEditMode ? selectedAlbum?.title || 'Loading' : catalog.albums.length}</strong>
          <span>{isEditMode ? selectedAlbum?.artist || 'Waiting for the album catalog.' : 'Albums currently visible in the app.'}</span>
        </div>
      </div>

      {error ? <div className="status-banner status-banner--error">{error}</div> : null}
      {successMessage ? <div className="status-banner status-banner--success">{successMessage}</div> : null}
      {isMissingAlbum ? <div className="status-banner status-banner--warning">That album is not in the current catalog.</div> : null}

      <div className="panel-grid">
        <form className="surface-card form-panel form-grid" onSubmit={handleSubmit}>
          <div className="form-grid form-grid--two">
            <div className="field">
              <label htmlFor="album-title">Album title</label>
              <input
                id="album-title"
                name="album-title"
                onChange={handleFieldChange}
                placeholder="Midnight Echoes"
                required
                type="text"
                value={formValues.title}
              />
            </div>

            <div className="field">
              <label htmlFor="album-artist">Artist</label>
              <input
                id="album-artist"
                name="album-artist"
                onChange={handleFieldChange}
                placeholder="Nova Pulse"
                required
                type="text"
                value={formValues.artist}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="album-release-date">Release date</label>
            <input
              id="album-release-date"
              name="album-release-date"
              onChange={handleFieldChange}
              required
              type="date"
              value={formValues.releaseDate}
            />
          </div>

          <div className="field">
            <label htmlFor="album-cover">Cover art</label>
            <input accept="image/*" id="album-cover" name="album-cover" type="file" />
          </div>

          <div className="button-row">
            <button className="button button-primary" disabled={isSubmitting || isMissingAlbum} type="submit">
              {isSubmitting ? submittingLabel : submitLabel}
            </button>
            <Link className="button button-secondary" to="/albums">
              Back to albums
            </Link>
            <Link className="button button-secondary" to="/studio">
              Back to studio
            </Link>
          </div>
        </form>

        <article className="surface-card result-panel">
          <p className="eyebrow">Latest response</p>
          {savedAlbum ? (
            <div className="preview-panel">
              <h3>{savedAlbum.title}</h3>
              <p className="response-code">Album id: {savedAlbum.id}</p>
              <div className="preview-frame">
                {savedAlbum.coverUrl ? (
                  <img alt={savedAlbum.title} src={resolveBackendUrl(savedAlbum.coverUrl)} />
                ) : (
                  <span>No cover uploaded for this album.</span>
                )}
              </div>
            </div>
          ) : (
            <p className="empty-state">Submit the form to see the saved album payload and its artwork preview here.</p>
          )}
        </article>
      </div>
    </section>
  );
}
