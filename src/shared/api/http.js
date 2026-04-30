const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export function resolveBackendUrl(path = '') {
  if (!path) {
    return API_BASE_URL || '/';
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (!API_BASE_URL) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function normalizePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { isError: false };
  }

  if (typeof payload.code === 'number') {
    return { isError: payload.code >= 400, code: payload.code };
  }

  if (payload.status && typeof payload.status === 'object' && 'isOk' in payload.status) {
    return { isError: !payload.status.isOk };
  }

  return { isError: false };
}

export function extractApiMessage(payload, fallbackMessage = 'Unexpected server response') {
  if (!payload) {
    return fallbackMessage;
  }

  if (typeof payload === 'string') {
    return payload;
  }

  return (
    payload.message ||
    payload.Message ||
    payload.status ||
    payload.Status ||
    payload.error ||
    payload.title ||
    fallbackMessage
  );
}
