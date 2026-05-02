import { Link } from 'react-router-dom';
import { useAppContext } from '@shared/lib/app-context';
import '@shared/styles/music-page.css';
import '@shared/styles/listen-hero.css';
import './AdminPanel.css';

export default function AdminPanel() {
  const { catalog } = useAppContext();

  return (
    <section className="music-page page-shell">
      <div className="listen-hero listen-hero--compact">
        <div className="listen-hero__copy">
          <p className="eyebrow">Studio</p>
          <h2>Welcome to Admin Panel!</h2>
        </div>

        <div className="surface-card hero-summary">
          <p className="eyebrow">Current library</p>
          <strong>{catalog.albums.length} albums</strong>
        </div>
      </div>

      <div className="studio-grid">
        <article className="surface-card studio-card">
          <p className="eyebrow">Publish release</p>
          <strong>Add a new album</strong>
          <p>Create an album entry, upload cover art, and push it straight into the home and library views.</p>
          <div className="button-row">
            <Link className="button button-primary" to="/albums/add">
              Add album
            </Link>
            <Link className="button button-secondary" to="/albums">
              Manage albums
            </Link>
          </div>
        </article>

        <article className="surface-card studio-card">
          <p className="eyebrow">Upload track</p>
          <strong>Add a new track</strong>
          <p>Attach a track to an existing album and upload the audio file through the current backend endpoint.</p>
          <div className="button-row">
            <Link className="button button-primary" to="/tracks/add">
              Add track
            </Link>
            <Link className="button button-secondary" to="/tracks">
              Manage tracks
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
