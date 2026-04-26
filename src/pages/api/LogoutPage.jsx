import { useContext, useState } from 'react';
import AppContext from '../../features/context/AppContext';
import EndpointHero from '../../shared/ui/EndpointHero';

export default function LogoutPage() {
  const { auth, logout } = useContext(AppContext);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = async () => {
    setError('');
    setFeedback('');
    setIsSubmitting(true);

    try {
      const payload = await logout();
      setFeedback(payload.Status || 'Logged out');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-shell">
      <EndpointHero
        description="This page clears both the backend session and the frontend auth snapshot so you can retest login and signup flows quickly."
        endpoint="/api/user/logout"
        method="POST"
        title="Log out"
      >
        <p className="eyebrow">Current session</p>
        <h3>{auth.userName || 'Guest session'}</h3>
        <p>{auth.token ? 'JWT present in local storage.' : 'No JWT stored.'}</p>
      </EndpointHero>

      {feedback ? <div className="status-banner status-banner--success">{feedback}</div> : null}
      {error ? <div className="status-banner status-banner--error">{error}</div> : null}

      <article className="surface-card form-panel">
        <p className="helper-copy">
          Use this whenever you want to reset the frontend state and backend session before another auth test.
        </p>
        <div className="button-row">
          <button className="button button-danger" disabled={isSubmitting} onClick={handleLogout} type="button">
            {isSubmitting ? 'Logging out...' : 'Log out now'}
          </button>
        </div>
      </article>
    </section>
  );
}
