import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../../features/context/AppContext';
import '../music/MusicPage.css';
import './AuthPages.css';

export default function SignupPage() {
  const { signup } = useContext(AppContext);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = (formData) => {
    const nextErrors = {};
    const emailValue = formData.get('email')?.trim() || '';
    const loginValue = formData.get('login')?.trim() || '';
    const nameValue = formData.get('name')?.trim() || '';
    const passwordValue = formData.get('password') || '';

    if (!nameValue) {
      nextErrors.name = 'Display name is required.';
    } else if (nameValue.length < 2) {
      nextErrors.name = 'Display name must be at least 2 characters.';
    }

    if (!emailValue) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!loginValue) {
      nextErrors.login = 'Login is required.';
    } else if (loginValue.length < 3) {
      nextErrors.login = 'Login must be at least 3 characters.';
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
      await signup({
        email: formData.get('email').trim(),
        login: formData.get('login').trim(),
        name: formData.get('name').trim(),
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
        <div className="surface-card form-panel form-grid auth-form">
          <div className="auth-form__heading">
            <p className="eyebrow">Sign up</p>
            <h2>Create account</h2>
          </div>
          {error ? <div className="status-banner status-banner--error">{error}</div> : null}

          <form className="form-grid" noValidate onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Display name</label>
              <input
                aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                aria-invalid={Boolean(fieldErrors.name)}
                id="name"
                minLength={2}
                name="name"
                placeholder="Dmytro"
                required
                type="text"
              />
              {fieldErrors.name ? <span className="field-error" id="name-error">{fieldErrors.name}</span> : null}
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                aria-invalid={Boolean(fieldErrors.email)}
                id="email"
                name="email"
                placeholder="hello@example.com"
                required
                type="email"
              />
              {fieldErrors.email ? <span className="field-error" id="email-error">{fieldErrors.email}</span> : null}
            </div>

            <div className="field">
              <label htmlFor="signup-login">Login</label>
              <input
                aria-describedby={fieldErrors.login ? 'signup-login-error' : undefined}
                aria-invalid={Boolean(fieldErrors.login)}
                id="signup-login"
                minLength={3}
                name="login"
                placeholder="dmytro404"
                required
                type="text"
              />
              {fieldErrors.login ? <span className="field-error" id="signup-login-error">{fieldErrors.login}</span> : null}
            </div>

            <div className="field">
              <label htmlFor="signup-password">Password</label>
              <input
                aria-describedby={fieldErrors.password ? 'signup-password-error' : undefined}
                aria-invalid={Boolean(fieldErrors.password)}
                id="signup-password"
                name="password"
                required
                type="password"
              />
              {fieldErrors.password ? (
                <span className="field-error" id="signup-password-error">{fieldErrors.password}</span>
              ) : null}
            </div>

            <div className="button-row">
              <button className="button button-primary" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </button>
              <Link className="button button-secondary" to="/auth/login">
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
