import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import './ui/App.css';
import '../pages/api/ApiPages.css';
import AppContext from '../features/context/AppContext';
import AddAlbumPage from '../pages/api/AddAlbumPage';
import AddTrackPage from '../pages/api/AddTrackPage';
import AlbumsPage from '../pages/api/AlbumsPage';
import LoginPage from '../pages/api/LoginPage';
import LogoutPage from '../pages/api/LogoutPage';
import SignupPage from '../pages/api/SignupPage';
import StorageItemPage from '../pages/api/StorageItemPage';
import StorageUploadPage from '../pages/api/StorageUploadPage';
import Home from '../pages/home/Home';
import NotFoundPage from '../pages/status/NotFoundPage';
import { extractApiMessage, normalizePayload, resolveBackendUrl } from '../shared/api/http';
import { endpointCards } from '../shared/config/endpoints';
import Layout from '../widgets/layout/Layout';

const AUTH_STORAGE_KEY = 'spotify-clone-auth';

function readStoredAuth() {
  try {
    const storedValue = localStorage.getItem(AUTH_STORAGE_KEY);
    return storedValue ? JSON.parse(storedValue) : { token: null, userName: null, email: null, role: null };
  } catch {
    return { token: null, userName: null, email: null, role: null };
  }
}

function App() {
  const [auth, setAuth] = useState(readStoredAuth);

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  const request = useCallback(async (path, options = {}) => {
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
      headers,
      credentials: 'include',
    });

    let payload = null;
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      payload = await response.json();
    } else {
      payload = await response.text();
    }

    const normalizedPayload = normalizePayload(payload);

    if (!response.ok || normalizedPayload.isError) {
      const error = new Error(extractApiMessage(payload, `Request failed with status ${response.status}`));
      error.status = response.status;
      error.payload = payload;
      throw error;
    }

    return payload;
  }, [auth.token]);

  const login = useCallback(async ({ login: userLogin, password }) => {
    const payload = await request('/api/user/login', {
      method: 'POST',
      body: { login: userLogin, password },
    });

    setAuth({
      token: null,
      userName: payload.userName || userLogin,
      email: null,
      role: null,
    });

    return payload;
  }, [request]);

  const signup = useCallback(async (formValues) => {
    const payload = await request('/api/user/signup', {
      method: 'POST',
      body: formValues,
    });

    setAuth({
      token: payload.token || null,
      userName: payload.name || null,
      email: payload.email || null,
      role: payload.role || null,
    });

    return payload;
  }, [request]);

  const logout = useCallback(async () => {
    const payload = await request('/api/user/logout', { method: 'POST' });
    setAuth({ token: null, userName: null, email: null, role: null });
    return payload;
  }, [request]);

  return (
    <AppContext.Provider
      value={{
        auth,
        endpointCards,
        login,
        logout,
        request,
        resolveBackendUrl,
        setAuth,
        signup,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="albums" element={<AlbumsPage />} />
            <Route path="albums/add" element={<AddAlbumPage />} />
            <Route path="tracks/add" element={<AddTrackPage />} />
            <Route path="auth/login" element={<LoginPage />} />
            <Route path="auth/signup" element={<SignupPage />} />
            <Route path="auth/logout" element={<LogoutPage />} />
            <Route path="storage/upload" element={<StorageUploadPage />} />
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
