import { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../../features/context/AppContext';
import '../music/MusicPage.css';
import '../music/ListenHero.css';

const emptyFormValues = () => ({
  albumId: '',
  artist: '',
  genreId: '',
  title: '',
});

export default function AddTrackPage() {
  const { trackId } = useParams();
  const { catalog, refreshCatalog, request, resolveBackendUrl } = useContext(AppContext);
  const isEditMode = Boolean(trackId);
  const selectedTrack = useMemo(
    () => catalog.tracks.find((track) => String(track.id) === String(trackId)),
    [catalog.tracks, trackId],
  );
  const [formValues, setFormValues] = useState(emptyFormValues);
  const [savedTrack, setSavedTrack] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditMode) {
      setFormValues(emptyFormValues());
      return;
    }

    if (selectedTrack) {
      setFormValues({
        albumId: selectedTrack.albumId ? String(selectedTrack.albumId) : '',
        artist: selectedTrack.artist || '',
        genreId: selectedTrack.genreId ? String(selectedTrack.genreId) : '',
        title: selectedTrack.title || '',
      });
    }
  }, [isEditMode, selectedTrack]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    const fieldName = {
      'track-album-id': 'albumId',
      'track-artist': 'artist',
      'track-genre-id': 'genreId',
      'track-title': 'title',
    }[name];

    if (!fieldName) return;

    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const formData = new FormData(form);
      const payload = await request(isEditMode ? `/api/tracks/update/${trackId}` : '/api/tracks/add', {
        method: isEditMode ? 'PUT' : 'POST',
        body: formData,
      });

      setSavedTrack(payload.data || {
        ...selectedTrack,
        albumId: Number(formValues.albumId),
        artist: formValues.artist,
        genreId: Number(formValues.genreId) || selectedTrack?.genreId || null,
        title: formValues.title,
      });
      setSuccessMessage(isEditMode ? 'Track updated.' : 'Track created.');
      await refreshCatalog();

      if (!isEditMode) {
        setFormValues(emptyFormValues());
        form.reset();
      }
    } catch (requestError) {
      setError(requestError.message);
      setSavedTrack(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isMissingTrack = isEditMode && !catalog.isLoading && !selectedTrack;
  const hasAlbums = catalog.albums.length > 0;
  const hasGenres = catalog.genres.length > 0;
  const pageTitle = isEditMode ? 'Update a track already available to listeners.' : 'Upload a new track into an existing album.';
  const submitLabel = isEditMode ? 'Update track' : 'Create track';
  const submittingLabel = isEditMode ? 'Updating track...' : 'Uploading track...';

  return (
    <section className="music-page page-shell">
      <div className="listen-hero listen-hero--compact">
        <div className="listen-hero__copy">
          <p className="eyebrow">Studio</p>
          <h2>{pageTitle}</h2>
          <p>
            Track publishing stays admin-only, while signed-in listeners can browse and play the saved catalog.
          </p>
        </div>

        <div className="surface-card hero-summary">
          <p className="eyebrow">{isEditMode ? 'Editing' : 'Track records'}</p>
          <strong>{isEditMode ? selectedTrack?.title || 'Loading' : catalog.tracks.length}</strong>
          <span>{isEditMode ? selectedTrack?.artist || 'Waiting for the track catalog.' : 'Tracks currently visible to signed-in listeners.'}</span>
        </div>
      </div>

      {error ? <div className="status-banner status-banner--error">{error}</div> : null}
      {successMessage ? <div className="status-banner status-banner--success">{successMessage}</div> : null}
      {isMissingTrack ? <div className="status-banner status-banner--warning">That track is not in the current catalog.</div> : null}

      <div className="panel-grid">
        <form className="surface-card form-panel form-grid" onSubmit={handleSubmit}>
          <div className="form-grid form-grid--two">
            <div className="field">
              <label htmlFor="track-title">Track title</label>
              <input
                id="track-title"
                name="track-title"
                onChange={handleFieldChange}
                placeholder="Glass Hearts"
                required
                type="text"
                value={formValues.title}
              />
            </div>

            <div className="field">
              <label htmlFor="track-artist">Artist</label>
              <input
                id="track-artist"
                name="track-artist"
                onChange={handleFieldChange}
                placeholder="Nova Pulse"
                required
                type="text"
                value={formValues.artist}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="track-album-id">Album</label>
            <select
              id="track-album-id"
              name="track-album-id"
              onChange={handleFieldChange}
              required
              value={formValues.albumId}
            >
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
            <label htmlFor="track-genre-id">Genre</label>
            <select
              id="track-genre-id"
              name="track-genre-id"
              onChange={handleFieldChange}
              value={formValues.genreId || '0'}
            >
              <option value="0">{hasGenres ? 'Use default genre' : 'Uncategorized'}</option>
              {catalog.genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="track-file">Audio file</label>
            <input accept="audio/*" id="track-file" name="track-file" required={!isEditMode} type="file" />
          </div>

          <div className="button-row">
            <button
              className="button button-primary"
              disabled={isSubmitting || isMissingTrack || !hasAlbums}
              type="submit"
            >
              {isSubmitting ? submittingLabel : submitLabel}
            </button>
            <Link className="button button-secondary" to="/tracks">
              Back to tracks
            </Link>
            <Link className="button button-secondary" to="/studio">
              Back to studio
            </Link>
          </div>

          {!hasAlbums ? (
            <p className="helper-copy">You need at least one album before a track can be attached to it.</p>
          ) : null}
        </form>

        <article className="surface-card result-panel">
          <p className="eyebrow">Latest response</p>
          {savedTrack ? (
            <div className="preview-panel">
              <h3>{savedTrack.title}</h3>
              <p className="response-code">Track id: {savedTrack.id}</p>
              <div className="preview-frame">
                {savedTrack.url ? (
                  <audio controls src={resolveBackendUrl(savedTrack.url)} />
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
