import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../../features/context/AppContext';

export default function ProfilePage() {
  const { auth, isAdmin, isAuthenticated, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <section className="music-page page-shell profile-simple">
      <div className="profile-simple__greeting">
        <p className="eyebrow">Profile</p>
        <h2>{isAuthenticated ? `Hello, ${auth.userName}.` : 'Hello, guest.'}</h2>
        <p>{isAdmin ? 'Admin access is active.' : isAuthenticated ? 'You are signed in as a listener.' : 'Sign in to start listening.'}</p>
      </div>

      <div className="profile-simple__bottom">
        {isAuthenticated ? (
          <button className="button button-primary" onClick={handleLogout} type="button">
            Log out
          </button>
        ) : (
          <Link className="button button-primary" to="/auth/login">
            Log in
          </Link>
        )}
      </div>
    </section>
  );
}
