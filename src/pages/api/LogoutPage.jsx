import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../../features/context/AppContext';

export default function LogoutPage() {
  const { auth, isAuthenticated, logout } = useContext(AppContext);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      await logout();
      navigate('/');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="music-page page-shell">
      <article className="surface-card restricted-card">
        <p className="eyebrow">Log out</p>
        <h2>{isAuthenticated ? `End the session for ${auth.userName}?` : 'There is no active session right now.'}</h2>
        <p>
          Logging out clears the frontend auth snapshot and tells the backend to close the current session as well.
        </p>

        {error ? <div className="status-banner status-banner--error">{error}</div> : null}

        <div className="button-row">
          <button className="button button-primary" disabled={isSubmitting || !isAuthenticated} onClick={handleLogout} type="button">
            {isSubmitting ? 'Logging out...' : 'Log out'}
          </button>
          <Link className="button button-secondary" to="/profile">
            Back to profile
          </Link>
        </div>
      </article>
    </section>
  );
}
