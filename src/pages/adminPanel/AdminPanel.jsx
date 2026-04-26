import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../features/context/AppContext';

export default function AdminPanel() {
  const { catalog } = useContext(AppContext);

  return (
    <section className="music-page page-shell">
      <div className="listen-hero listen-hero--compact">
        <div className="listen-hero__copy">
          <p className="eyebrow">Studio</p>
          <h2>Admin publishing stays separate from the listener experience.</h2>
          <p>
            Use this studio area to add albums, upload tracks, and manage internal upload flows without exposing those
            controls to regular users.
          </p>
        </div>

        <div className="surface-card hero-summary">
          <p className="eyebrow">Current library</p>
          <strong>{catalog.albums.length} albums</strong>
          <span>{catalog.artists.length} artists currently visible in the listener app.</span>
        </div>
      </div>

      <div className="studio-grid">
        <article className="surface-card studio-card">
          <p className="eyebrow">Publish release</p>
          <strong>Add a new album</strong>
          <p>Create an album entry, upload cover art, and push it straight into the home and library views.</p>
          <Link className="button button-primary" to="/albums/add">
            Open album form
          </Link>
        </article>

        <article className="surface-card studio-card">
          <p className="eyebrow">Upload track</p>
          <strong>Add a new track</strong>
          <p>Attach a track to an existing album and upload the audio file through the current backend endpoint.</p>
          <Link className="button button-primary" to="/tracks/add">
            Open track form
          </Link>
        </article>

        <article className="surface-card studio-card">
          <p className="eyebrow">Utilities</p>
          <strong>Storage tools</strong>
          <p>Use the storage upload route when you need to inspect raw file handling outside the album and track flows.</p>
          <Link className="button button-secondary" to="/storage/upload">
            Open storage upload
          </Link>
        </article>

        <article className="surface-card studio-card">
          <p className="eyebrow">Listener app</p>
          <strong>Check the public-facing views</strong>
          <p>Hop back into the browsing experience to confirm how new releases and artists appear to regular users.</p>
          <div className="button-row">
            <Link className="button button-secondary" to="/browse">
              Browse library
            </Link>
            <Link className="button button-secondary" to="/profile">
              Open profile
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
