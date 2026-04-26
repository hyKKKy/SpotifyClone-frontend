import { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import AppContext from '../../features/context/AppContext';
import { primaryNav } from '../../shared/config/endpoints';
import './ui/Layout.css';

export default function Layout() {
  const { auth } = useContext(AppContext);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <NavLink className="brand-mark" to="/">
            <span className="brand-icon">S</span>
            <span>
              <strong>Spotify Clone</strong>
              <small>frontend x backend bridge</small>
            </span>
          </NavLink>

          <nav className="site-nav" aria-label="Primary">
            {primaryNav.map((item) => (
              <NavLink
                className={({ isActive }) => `nav-pill${isActive ? ' nav-pill--active' : ''}`}
                key={item.route}
                to={item.route}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="auth-badge">
            <span className="eyebrow">Active session</span>
            <strong>{auth.userName || 'Guest'}</strong>
          </div>
        </div>
      </header>

      <main className="main-container">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div>
          <p className="eyebrow">Main page footer</p>
          <strong>Frontend routes now mirror your backend endpoints.</strong>
        </div>
        <div className="footer-meta">
          <span>React + Vite frontend</span>
          <span>ASP.NET backend at `main` branch</span>
        </div>
      </footer>
    </div>
  );
}
