import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="page-shell">
      <div className="page-hero">
        <div className="method-badge method-badge--POST">404</div>
        <h1>That route is not part of this frontend.</h1>
        <p>The dashboard only exposes pages that map to the backend endpoints we found in your current `main` branch.</p>
      </div>

      <article className="surface-card">
        <p>Head back to the endpoint dashboard and we can keep moving from there.</p>
        <Link className="action-link" to="/">
          Open dashboard
        </Link>
      </article>
    </section>
  );
}
