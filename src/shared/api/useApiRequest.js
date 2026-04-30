import { useCallback } from 'react';
import { extractApiMessage, normalizePayload, resolveBackendUrl } from './http';

export { resolveBackendUrl };

export default function useApiRequest(authToken, onUnauthorized) {
  return useCallback(
    async (path, options = {}) => {
      const { skipAuth = false, ...fetchOptions } = options;
      const requestUrl = resolveBackendUrl(path);
      const headers = new Headers(fetchOptions.headers || {});
      let body = fetchOptions.body;

      if (!(body instanceof FormData) && body && typeof body !== 'string') {
        headers.set('Content-Type', 'application/json');
        body = JSON.stringify(body);
      }

      if (!skipAuth && authToken) {
        headers.set('Authorization', `Bearer ${authToken}`);
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
          onUnauthorized?.();
        }

        const error = new Error(extractApiMessage(payload, `Request failed with status ${response.status}`));
        error.status = response.status;
        error.payload = payload;
        throw error;
      }

      return payload;
    },
    [authToken, onUnauthorized],
  );
}
