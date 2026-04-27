import { useContext } from 'react';
import { Music } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import AppContext from '../../features/context/AppContext';
import './ui/LayoutHeader.css';

export default function LayoutHeader() {
  const { auth, isAdmin, isAuthenticated, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleHeaderLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch {
      navigate('/auth/logout');
    }
  };

  return (
    <header className="spotify-header">
      <NavLink className="spotify-header__brand" to="/">
        <span className="spotify-header__brandMark">
          <Music size={18} />
        </span>
        <span className="spotify-header__brandText">
          <strong>Spotify</strong>
          <small>{isAdmin ? 'Studio mode' : isAuthenticated ? 'Premium' : 'Free'}</small>
        </span>
      </NavLink>

      <form className="spotify-header__search" role="search" onSubmit={(event) => event.preventDefault()}>
        <input aria-label="Search" placeholder="Search" type="search" />
      </form>

      <div className="spotify-header__left">
        {isAuthenticated ? (
          <>
            <NavLink className="button button-secondary spotify-header__button" to="/profile">
              {auth.userName || 'Profile'}
            </NavLink>
            <button className="button button-primary spotify-header__button" onClick={handleHeaderLogout} type="button">
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink className="button button-secondary spotify-header__button" to="/auth/login">
              Log in
            </NavLink>
            <NavLink className="button button-primary spotify-header__button" to="/auth/signup">
              Sign up
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}
