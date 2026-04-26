import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../../features/context/AppContext';

export default function LoginPage() {
  const { isAdmin, login } = useContext(AppContext);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = (formData) => {
    const nextErrors = {};
    const loginValue = formData.get('login')?.trim() || '';
    const passwordValue = formData.get('password') || '';

    if (!loginValue) {
      nextErrors.login = 'Login is required.';
    }

    if (!passwordValue) {
      nextErrors.password = 'Password is required.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextFieldErrors = validateForm(formData);

    setError('');
    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        login: formData.get('login').trim(),
        password: formData.get('password'),
      });

      navigate('/');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="music-page page-shell">
      <div className="auth-layout auth-layout--single">
        <form className="surface-card form-panel form-grid auth-form" noValidate onSubmit={handleSubmit}>
          <div className="auth-form__heading">
            <p className="eyebrow">Log in</p>
            <h2>Welcome back</h2>
          </div>
          {error ? <div className="status-banner status-banner--error">{error}</div> : null}

          <div className="field">
            <label htmlFor="login">Login</label>
            <input
              aria-describedby={fieldErrors.login ? 'login-error' : undefined}
              aria-invalid={Boolean(fieldErrors.login)}
              autoComplete="username"
              id="login"
              name="login"
              placeholder="Admin"
              required
              type="text"
            />
            {fieldErrors.login ? <span className="field-error" id="login-error">{fieldErrors.login}</span> : null}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              aria-invalid={Boolean(fieldErrors.password)}
              autoComplete="current-password"
              id="password"
              name="password"
              required
              type="password"
            />
            {fieldErrors.password ? <span className="field-error" id="password-error">{fieldErrors.password}</span> : null}
          </div>

          <div className="button-row">
            <button className="button button-primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
            <Link className="button button-secondary" to="/auth/signup">
              Create account
            </Link>
          </div>

          <p className="helper-copy">{isAdmin ? 'Admin access is active for this session.' : 'Regular users stay in browse-only mode.'}</p>
        </form>
      </div>
    </section>
  );
}
