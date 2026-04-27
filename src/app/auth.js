export const AUTH_STORAGE_KEY = 'spotify-clone-auth';

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const NAME_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
const NAME_IDENTIFIER_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
const EMAIL_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';

export const DEFAULT_AUTH = {
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

export function inferRole(role, loginName) {
  const normalizedRole = typeof role === 'string' ? role.trim() : '';

  if (normalizedRole.toLowerCase() === 'admin') {
    return 'Admin';
  }

  if (normalizedRole.toLowerCase() === 'guest') {
    return 'Guest';
  }

  return loginName?.trim().toLowerCase() === 'admin' ? 'Admin' : normalizedRole || null;
}

export function normalizeAuthState(nextAuth) {
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

export function readStoredAuth() {
  try {
    const storedValue = localStorage.getItem(AUTH_STORAGE_KEY);
    return storedValue ? normalizeAuthState(JSON.parse(storedValue)) : DEFAULT_AUTH;
  } catch {
    return DEFAULT_AUTH;
  }
}

export function buildAuthState(payload, fallbackValues = {}) {
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
