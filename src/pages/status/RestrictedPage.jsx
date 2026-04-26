import { Link } from 'react-router-dom';

export default function RestrictedPage() {
  return (
    <section className="music-page page-shell">
      <article className="surface-card restricted-card">
        <p className="eyebrow">Admin only</p>
        <h2>This area is reserved for admins.</h2>
        <p>
          Regular users can browse albums, artists, and profile details, but publishing new tracks or albums stays behind
          admin access.
        </p>
        <div className="button-row">
          <Link className="button button-secondary" to="/browse">
            Back to library
          </Link>
          <Link className="button button-primary" to="/profile">
            Open profile
          </Link>
        </div>
      </article>
    </section>
  );
}
