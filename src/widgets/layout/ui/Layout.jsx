import { Outlet, useLocation } from 'react-router-dom';
import LayoutHeader from './LayoutHeader';
import PlayerBar from './PlayerBar';
import TrackSidebar from './TrackSidebar';
import './Layout.css';

export default function Layout() {
  const location = useLocation();
  const isAuthScreen = location.pathname === '/auth/login' || location.pathname === '/auth/signup';

  return (
    <div className="layout-shell">
      <LayoutHeader />

      <div className={isAuthScreen ? 'spotify-shell spotify-shell--auth' : 'spotify-shell'}>
        {!isAuthScreen ? <TrackSidebar /> : null}

        <div className={isAuthScreen ? 'spotify-main spotify-main--auth' : 'spotify-main'}>
          <main className="main-container">
            <Outlet />
          </main>

          <PlayerBar />
        </div>
      </div>
    </div>
  );
}
