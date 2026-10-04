/**
 * User-Scoped Storage Utility
 * Ensures data isolation across different user logins in production,
 * while safely migrating and preserving existing user account data.
 */

export const getActiveUserId = (): string => {
  try {
    const raw = localStorage.getItem('auth_user');
    if (raw) {
      const user = JSON.parse(raw);
      if (user?.email) return user.email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
      if (user?.id) return String(user.id);
    }
  } catch {}
  return 'default';
};

export const getUserKey = (prefix: string, userIdentifier?: string): string => {
  let uid = userIdentifier || getActiveUserId();
  if (uid.includes('@')) {
    uid = uid.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
  }
  return `${prefix}_${uid}`;
};

export const getUserItem = (prefix: string, userId?: string): string | null => {
  const key = getUserKey(prefix, userId);
  const val = localStorage.getItem(key);
  if (val !== null) return val;

  // Auto-migration fallback: if user-scoped data does not exist yet,
  // check if legacy un-scoped key exists in localStorage and copy it over
  const legacyVal = localStorage.getItem(prefix);
  if (legacyVal !== null) {
    try {
      localStorage.setItem(key, legacyVal);
    } catch {}
    return legacyVal;
  }

  return null;
};

export const setUserItem = (prefix: string, value: string, userId?: string): void => {
  const key = getUserKey(prefix, userId);
  localStorage.setItem(key, value);
};

export const removeUserItem = (prefix: string, userId?: string): void => {
  const key = getUserKey(prefix, userId);
  localStorage.removeItem(key);
};
