import { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../../features/context/AppContext';

export default function RouteStubPage({ route }) {
  const { endpointCards } = useContext(AppContext);
  const { itemId } = useParams();
  const endpoint = endpointCards.find((card) => card.route === route);

  return (
    <section className="page-shell">
      <div className="page-hero">
        <div className={`method-badge method-badge--${endpoint?.method || 'GET'}`}>{endpoint?.method}</div>
        <h1>{endpoint?.title}</h1>
        <p>{endpoint?.description}</p>
      </div>

      <div className="page-grid">
        <article className="surface-card">
          <p className="eyebrow">Backend endpoint</p>
          <h2>{endpoint?.endpoint}</h2>
          <p>
            This route is already wired into the app shell. The live form and response viewer land in the next commit.
          </p>
          {itemId ? <p className="inline-note">Requested item id: {itemId}</p> : null}
        </article>

        <article className="surface-card">
          <p className="eyebrow">What is next here</p>
          <p>
            The page will get a real backend form, response feedback, and previews where the endpoint returns files.
          </p>
          <Link className="action-link" to="/">
            Back to dashboard
          </Link>
        </article>
      </div>
    </section>
  );
}
