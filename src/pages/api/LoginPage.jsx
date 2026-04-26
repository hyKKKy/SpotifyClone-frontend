import { useContext, useState } from 'react';
import AppContext from '../../features/context/AppContext';
import EndpointHero from '../../shared/ui/EndpointHero';

export default function LoginPage() {
  const { auth, login } = useContext(AppContext);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setError('');
    setFeedback('');
    setIsSubmitting(true);

    try {
      const payload = await login({
        login: formData.get('login'),
        password: formData.get('password'),
      });

      setFeedback(payload.Status ? `${payload.Status}: ${payload.userName}` : `Logged in as ${payload.userName}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-shell">
      <EndpointHero
        description="The login page uses the backend session endpoint. During local development it works through the Vite proxy so the cookie stays same-origin."
        endpoint="/api/user/login"
        method="POST"
        title="Log in"
      >
        <p className="eyebrow">Current frontend state</p>
        <h3>{auth.userName || 'Guest session'}</h3>
        <p>{auth.token ? 'A JWT is currently stored from signup.' : 'No JWT stored right now.'}</p>
      </EndpointHero>

      {feedback ? <div className="status-banner status-banner--success">{feedback}</div> : null}
      {error ? <div className="status-banner status-banner--error">{error}</div> : null}

      <form className="surface-card form-panel form-grid" onSubmit={handleSubmit}>
        <div className="form-grid form-grid--two">
          <div className="field">
            <label htmlFor="login">Login</label>
            <input autoComplete="username" id="login" name="login" placeholder="Admin" required type="text" />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              autoComplete="current-password"
              id="password"
              name="password"
              placeholder="Password"
              required
              type="password"
            />
          </div>
        </div>

        <div className="button-row">
          <button className="button button-primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
    </section>
  );
}
