import { useContext, useState } from 'react';
import AppContext from '../../features/context/AppContext';
import EndpointHero from '../../shared/ui/EndpointHero';

export default function SignupPage() {
  const { auth, signup } = useContext(AppContext);
  const [createdUser, setCreatedUser] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setError('');
    setCreatedUser(null);
    setIsSubmitting(true);

    try {
      const payload = await signup({
        name: formData.get('name'),
        email: formData.get('email'),
        login: formData.get('login'),
        password: formData.get('password'),
      });

      setCreatedUser(payload);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-shell">
      <EndpointHero
        description="This form calls the backend signup action and stores the returned JWT in local storage so the rest of the frontend can reuse it."
        endpoint="/api/user/signup"
        method="POST"
        title="Create an account"
      >
        <p className="eyebrow">Stored user</p>
        <h3>{auth.userName || 'No signed-up user yet'}</h3>
        <p>{auth.email || 'Email will appear here after a successful signup.'}</p>
      </EndpointHero>

      {error ? <div className="status-banner status-banner--error">{error}</div> : null}

      <div className="panel-grid">
        <form className="surface-card form-panel form-grid" onSubmit={handleSubmit}>
          <div className="form-grid form-grid--two">
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" placeholder="Dmytro" required type="text" />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" placeholder="hello@example.com" required type="email" />
            </div>
          </div>

          <div className="form-grid form-grid--two">
            <div className="field">
              <label htmlFor="signup-login">Login</label>
              <input id="signup-login" name="login" placeholder="dmytro404" required type="text" />
            </div>

            <div className="field">
              <label htmlFor="signup-password">Password</label>
              <input id="signup-password" name="password" required type="password" />
            </div>
          </div>

          <div className="button-row">
            <button className="button button-primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>

        <article className="surface-card result-panel">
          <p className="eyebrow">Latest response</p>
          {createdUser ? (
            <dl className="detail-list">
              <div>
                <dt>Name</dt>
                <dd>{createdUser.name}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{createdUser.email}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{createdUser.role}</dd>
              </div>
              <div>
                <dt>User id</dt>
                <dd>{createdUser.userId}</dd>
              </div>
              <div>
                <dt>Token</dt>
                <dd>{createdUser.token ? `${createdUser.token.slice(0, 26)}...` : 'Not returned'}</dd>
              </div>
            </dl>
          ) : (
            <p className="empty-state">Successful signup details will show here, including the returned JWT.</p>
          )}
        </article>
      </div>
    </section>
  );
}
