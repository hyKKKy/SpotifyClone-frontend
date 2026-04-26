import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import './ui/App.css';
import '../pages/api/ApiPages.css';
import '../pages/music/MusicPages.css';
import AppContext from '../features/context/AppContext';
import AddAlbumPage from '../pages/api/AddAlbumPage';
import AddTrackPage from '../pages/api/AddTrackPage';
import AlbumsPage from '../pages/api/AlbumsPage';
import ArtistsPage from '../pages/library/ArtistsPage';
import LibraryPage from '../pages/library/LibraryPage';
import LoginPage from '../pages/api/LoginPage';
import LogoutPage from '../pages/api/LogoutPage';
import ProfilePage from '../pages/profile/ProfilePage';
import SignupPage from '../pages/api/SignupPage';
import StorageItemPage from '../pages/api/StorageItemPage';
import StorageUploadPage from '../pages/api/StorageUploadPage';
import AdminPanel from '../pages/adminPanel/AdminPanel';
import Home from '../pages/home/Home';
import NotFoundPage from '../pages/status/NotFoundPage';
import { extractApiMessage, normalizePayload, resolveBackendUrl } from '../shared/api/http';
import { buildArtistsFromAlbums, normalizeAlbums, normalizeTracks } from '../shared/music/catalog';
import AdminOnlyRoute from '../shared/ui/AdminOnlyRoute';
import Layout from '../widgets/layout/Layout';

const AUTH_STORAGE_KEY = 'spotify-clone-auth';
const DEFAULT_AUTH = {
  token: null,
  userName: null,
  email: null,
  role: null,
  loginName: null,
};

function normalizeAuthState(nextAuth) {
  return {
    ...DEFAULT_AUTH,
    ...nextAuth,
  };
}

function readStoredAuth() {
  try {
    const storedValue = localStorage.getItem(AUTH_STORAGE_KEY);
    return storedValue ? normalizeAuthState(JSON.parse(storedValue)) : DEFAULT_AUTH;
  } catch {
    return DEFAULT_AUTH;
  }
}

function inferRole(role, loginName) {
  if (role && role.toLowerCase() === 'admin') {
    return 'Admin';
  }

  return loginName?.trim().toLowerCase() === 'admin' ? 'Admin' : 'user';
}

function App() {
  const [auth, setAuthState] = useState(readStoredAuth);
  const [catalog, setCatalog] = useState({
    albums: [],
    artists: [],
    error: '',
    isLoading: true,
    tracks: [],
  });

  const setAuth = useCallback((nextValue) => {
    setAuthState((currentValue) =>
      normalizeAuthState(typeof nextValue === 'function' ? nextValue(currentValue) : nextValue),
    );
  }, []);

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  const request = useCallback(
    async (path, options = {}) => {
      const requestUrl = resolveBackendUrl(path);
      const headers = new Headers(options.headers || {});
      let body = options.body;

      if (!(body instanceof FormData) && body && typeof body !== 'string') {
        headers.set('Content-Type', 'application/json');
        body = JSON.stringify(body);
      }

      if (auth.token) {
        headers.set('Authorization', `Bearer ${auth.token}`);
      }

      const response = await fetch(requestUrl, {
        ...options,
        body,
        credentials: 'include',
        headers,
      });

      const contentType = response.headers.get('content-type') || '';
      const payload = contentType.includes('application/json') ? await response.json() : await response.text();
      const normalizedPayload = normalizePayload(payload);

      if (!response.ok || normalizedPayload.isError) {
        const error = new Error(extractApiMessage(payload, `Request failed with status ${response.status}`));
        error.status = response.status;
        error.payload = payload;
        throw error;
      }

      return payload;
    },
    [auth.token],
  );

  const refreshCatalog = useCallback(async () => {
    setCatalog((currentCatalog) => ({
      ...currentCatalog,
      error: '',
      isLoading: true,
    }));

    try {
      const payload = await request('/api/albums');
      const albums = normalizeAlbums(payload.data);
      const artists = buildArtistsFromAlbums(albums);
      let tracks = [];

      try {
        const tracksPayload = await request('/api/tracks');
        tracks = normalizeTracks(tracksPayload.data || tracksPayload);
      } catch {
        tracks = [];
      }

      setCatalog({
        albums,
        artists,
        error: '',
        isLoading: false,
        tracks,
      });
    } catch (requestError) {
      setCatalog({
        albums: [],
        artists: [],
        error: requestError.message,
        isLoading: false,
        tracks: [],
      });
    }
  }, [request]);

  useEffect(() => {
    void refreshCatalog();
  }, [refreshCatalog]);

  const login = useCallback(
    async ({ login: userLogin, password }) => {
      const payload = await request('/api/user/login', {
        body: { login: userLogin, password },
        method: 'POST',
      });

      setAuth({
        token: null,
        userName: payload.userName || userLogin,
        email: payload.email || null,
        role: inferRole(payload.role, userLogin),
        loginName: userLogin,
      });

      return payload;
    },
    [request, setAuth],
  );

  const signup = useCallback(
    async (formValues) => {
      const payload = await request('/api/user/signup', {
        body: formValues,
        method: 'POST',
      });

      setAuth({
        token: payload.token || null,
        userName: payload.name || formValues.name || null,
        email: payload.email || formValues.email || null,
        role: inferRole(payload.role, formValues.login),
        loginName: formValues.login || null,
      });

      return payload;
    },
    [request, setAuth],
  );

  const logout = useCallback(async () => {
    const payload = await request('/api/user/logout', { method: 'POST' });
    setAuth(DEFAULT_AUTH);
    return payload;
  }, [request, setAuth]);

  const isAuthenticated = Boolean(auth.userName);
  const isAdmin = inferRole(auth.role, auth.loginName) === 'Admin';

  const contextValue = useMemo(
    () => ({
      auth,
      catalog,
      isAdmin,
      isAuthenticated,
      login,
      logout,
      refreshCatalog,
      request,
      resolveBackendUrl,
      setAuth,
      signup,
    }),
    [auth, catalog, isAdmin, isAuthenticated, login, logout, refreshCatalog, request, setAuth, signup],
  );

  return (
    <AppContext.Provider value={contextValue}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="browse" element={<LibraryPage />} />
            <Route path="albums" element={<AlbumsPage />} />
            <Route path="artists" element={<ArtistsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route
              path="studio"
              element={
                <AdminOnlyRoute>
                  <AdminPanel />
                </AdminOnlyRoute>
              }
            />
            <Route
              path="admin"
              element={
                <AdminOnlyRoute>
                  <AdminPanel />
                </AdminOnlyRoute>
              }
            />
            <Route
              path="albums/add"
              element={
                <AdminOnlyRoute>
                  <AddAlbumPage />
                </AdminOnlyRoute>
              }
            />
            <Route
              path="tracks/add"
              element={
                <AdminOnlyRoute>
                  <AddTrackPage />
                </AdminOnlyRoute>
              }
            />
            <Route path="auth/login" element={<LoginPage />} />
            <Route path="auth/signup" element={<SignupPage />} />
            <Route path="auth/logout" element={<LogoutPage />} />
            <Route
              path="storage/upload"
              element={
                <AdminOnlyRoute>
                  <StorageUploadPage />
                </AdminOnlyRoute>
              }
            />
            <Route path="storage/item" element={<StorageItemPage />} />
            <Route path="storage/item/:itemId" element={<StorageItemPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
