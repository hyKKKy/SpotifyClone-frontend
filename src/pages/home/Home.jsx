import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../features/context/AppContext';
import './Home.css';

export default function Home() {
  const { auth, endpointCards } = useContext(AppContext);

  return (
    <section className="page-shell">
      <div className="home-hero">
        <div className="home-copy">
          <p className="eyebrow">Spotify Clone frontend</p>
          <h1>Every backend endpoint now has a route in the UI.</h1>
          <p className="hero-text">
            This dashboard is the handoff layer between your React frontend and the ASP.NET backend in
            `D:\SpotifyClone\SpotifyClone`.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/albums">
              Open albums
            </Link>
            <Link className="button button-secondary" to="/auth/login">
              Test login
            </Link>
          </div>
        </div>

        <div className="surface-card home-status">
          <p className="eyebrow">Session snapshot</p>
          <div className="status-row">
            <span>Current user</span>
            <strong>{auth.userName || 'Guest session'}</strong>
          </div>
          <div className="status-row">
            <span>JWT stored</span>
            <strong>{auth.token ? 'Yes' : 'No'}</strong>
          </div>
          <div className="status-row">
            <span>Backend origin</span>
            <strong>{import.meta.env.VITE_API_BASE_URL || 'Vite proxy to localhost:7243'}</strong>
          </div>
        </div>
      </div>

      <div className="home-grid">
        {endpointCards.map((card) => (
          <Link className="surface-card endpoint-card" key={card.id} to={card.route}>
            <div className={`method-badge method-badge--${card.method}`}>{card.method}</div>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <code>{card.endpoint}</code>
          </Link>
        ))}
      </div>
    </section>
  );
}
