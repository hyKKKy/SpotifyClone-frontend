import { useEffect } from 'react';
import { Music } from 'lucide-react';
import { NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '@shared/lib/app-context';
import './LayoutHeader.css';

export default function LayoutHeader() {
  const { auth, isAdmin, isAuthenticated, logout, searchQuery, setSearchQuery } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get('q') || '';

  useEffect(() => {
    if (location.pathname === '/search') {
      setSearchQuery(urlSearchQuery);
    }
  }, [location.pathname, setSearchQuery, urlSearchQuery]);

  const handleHeaderLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch {
      navigate('/auth/logout');
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const nextQuery = searchQuery.trim();
    setSearchQuery(nextQuery);

    if (!nextQuery) {
      navigate('/browse');
      return;
    }

    navigate(`/search?q=${encodeURIComponent(nextQuery)}`);
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

      <form className="spotify-header__search" role="search" onSubmit={handleSearchSubmit}>
        <input
          aria-label="Search"
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search albums, artists, tracks"
          type="search"
          value={searchQuery}
        />
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
