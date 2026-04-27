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
import TracksPage from '../pages/api/TracksPage';
import AdminPanel from '../pages/adminPanel/AdminPanel';
import Home from '../pages/home/Home';
import NotFoundPage from '../pages/status/NotFoundPage';
import { extractApiMessage, normalizePayload, resolveBackendUrl } from '../shared/api/http';
import { buildArtistsFromAlbums, normalizeAlbums, normalizeGenres, normalizeTracks } from '../shared/music/catalog';
import AdminOnlyRoute from '../shared/ui/AdminOnlyRoute';
import Layout from '../widgets/layout/Layout';

const AUTH_STORAGE_KEY = 'spotify-clone-auth';
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const NAME_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
const NAME_IDENTIFIER_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
const EMAIL_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
const DEFAULT_AUTH = {
  token: null,
  userId: null,
  userName: null,
  email: null,
  role: null,
  loginName: null,
};

function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') {
    return {};
  }

  const [, encodedPayload] = token.split('.');

  if (!encodedPayload) {
    return {};
  }

  try {
    const normalizedPayload = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      '=',
    );
    const decodedPayload = atob(paddedPayload);
    const payloadBytes = Uint8Array.from(decodedPayload, (character) => character.charCodeAt(0));

    return JSON.parse(new TextDecoder().decode(payloadBytes));
  } catch {
    return {};
  }
}

function normalizeAuthState(nextAuth) {
  const jwtPayload = decodeJwtPayload(nextAuth?.token);

  if (nextAuth?.token && typeof jwtPayload.exp === 'number' && jwtPayload.exp * 1000 <= Date.now()) {
    return DEFAULT_AUTH;
  }

  return {
    ...DEFAULT_AUTH,
    ...nextAuth,
    email: nextAuth?.email || jwtPayload.email || jwtPayload[EMAIL_CLAIM] || null,
    role: inferRole(nextAuth?.role || jwtPayload.role || jwtPayload[ROLE_CLAIM], nextAuth?.loginName),
    userId: nextAuth?.userId || jwtPayload.sub || jwtPayload.nameid || jwtPayload[NAME_IDENTIFIER_CLAIM] || null,
    userName: nextAuth?.userName || jwtPayload.name || jwtPayload[NAME_CLAIM] || null,
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
  const normalizedRole = typeof role === 'string' ? role.trim() : '';

  if (normalizedRole.toLowerCase() === 'admin') {
    return 'Admin';
  }

  if (normalizedRole.toLowerCase() === 'guest') {
    return 'Guest';
  }

  return loginName?.trim().toLowerCase() === 'admin' ? 'Admin' : normalizedRole || null;
}

function buildAuthState(payload, fallbackValues = {}) {
  const token = payload?.token || payload?.accessToken || null;

  if (!token) {
    throw new Error('Authentication response did not include a token.');
  }

  const jwtPayload = decodeJwtPayload(token);
  const loginName = fallbackValues.login || payload.login || null;

  return normalizeAuthState({
    token,
    userId: payload.userId || jwtPayload.sub || jwtPayload.nameid || jwtPayload[NAME_IDENTIFIER_CLAIM] || null,
    userName:
      payload.userName ||
      payload.name ||
      jwtPayload.name ||
      jwtPayload[NAME_CLAIM] ||
      fallbackValues.name ||
      loginName ||
      null,
    email: payload.email || jwtPayload.email || jwtPayload[EMAIL_CLAIM] || fallbackValues.email || null,
    role: payload.role || jwtPayload.role || jwtPayload[ROLE_CLAIM] || null,
    loginName,
  });
}

function App() {
  const [auth, setAuthState] = useState(readStoredAuth);
  const [catalog, setCatalog] = useState({
    albums: [],
    artists: [],
    error: '',
    genres: [],
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
      const { skipAuth = false, ...fetchOptions } = options;
      const requestUrl = resolveBackendUrl(path);
      const headers = new Headers(fetchOptions.headers || {});
      let body = fetchOptions.body;

      if (!(body instanceof FormData) && body && typeof body !== 'string') {
        headers.set('Content-Type', 'application/json');
        body = JSON.stringify(body);
      }

      if (!skipAuth && auth.token) {
        headers.set('Authorization', `Bearer ${auth.token}`);
      }

      const response = await fetch(requestUrl, {
        ...fetchOptions,
        body,
        credentials: 'include',
        headers,
      });

      const contentType = response.headers.get('content-type') || '';
      const payload = contentType.includes('application/json') ? await response.json() : await response.text();
      const normalizedPayload = normalizePayload(payload);

      if (!response.ok || normalizedPayload.isError) {
        if (response.status === 401) {
          setAuth(DEFAULT_AUTH);
        }

        const error = new Error(extractApiMessage(payload, `Request failed with status ${response.status}`));
        error.status = response.status;
        error.payload = payload;
        throw error;
      }

      return payload;
    },
    [auth.token, setAuth],
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
      let genres = [];
      let tracks = [];

      try {
        const genresPayload = await request('/api/genres');
        genres = normalizeGenres(genresPayload.data || genresPayload);
      } catch {
        genres = [];
      }

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
        genres,
        isLoading: false,
        tracks,
      });
    } catch (requestError) {
      setCatalog({
        albums: [],
        artists: [],
        error: requestError.message,
        genres: [],
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
        skipAuth: true,
      });

      setAuth(buildAuthState(payload, { login: userLogin }));

      return payload;
    },
    [request, setAuth],
  );

  const signup = useCallback(
    async (formValues) => {
      const payload = await request('/api/user/signup', {
        body: formValues,
        method: 'POST',
        skipAuth: true,
      });

      setAuth(buildAuthState(payload, formValues));

      return payload;
    },
    [request, setAuth],
  );

  const logout = useCallback(async () => {
    const payload = await request('/api/user/logout', { method: 'POST' });
    setAuth(DEFAULT_AUTH);
    return payload;
  }, [request, setAuth]);

  const isAuthenticated = Boolean(auth.token && auth.userName);
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
            <Route path="tracks" element={<TracksPage />} />
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
              path="albums/:albumId/edit"
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
            <Route
              path="tracks/:trackId/edit"
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
