import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppContext } from '@shared/lib/app-context';
import useCatalog from '@entities/music/model/useCatalog';
import {
  AUTH_STORAGE_KEY,
  DEFAULT_AUTH,
  buildAuthState,
  inferRole,
  normalizeAuthState,
  readStoredAuth,
} from '@features/auth/model/auth';
import usePlayer from '@features/player/model/usePlayer';
import useApiRequest, { resolveBackendUrl } from '@shared/api/useApiRequest';

export default function AppProvider({ children }) {
  const [auth, setAuthState] = useState(readStoredAuth);
  const [searchQuery, setSearchQuery] = useState('');

  const setAuth = useCallback((nextValue) => {
    setAuthState((currentValue) =>
      normalizeAuthState(typeof nextValue === 'function' ? nextValue(currentValue) : nextValue),
    );
  }, []);

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  const handleUnauthorized = useCallback(() => {
    setAuth(DEFAULT_AUTH);
  }, [setAuth]);

  const request = useApiRequest(auth.token, handleUnauthorized);
  const { catalog, refreshCatalog } = useCatalog(request);
  const player = usePlayer(catalog.tracks);

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
      player,
      refreshCatalog,
      request,
      resolveBackendUrl,
      searchQuery,
      setAuth,
      setSearchQuery,
      signup,
    }),
    [
      auth,
      catalog,
      isAdmin,
      isAuthenticated,
      login,
      logout,
      player,
      refreshCatalog,
      request,
      searchQuery,
      setAuth,
      signup,
    ],
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}
