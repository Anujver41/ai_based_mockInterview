/**
 * User-Scoped Storage Utility
 *
 * KEY DESIGN DECISION:
 *   We ALWAYS use the user's EMAIL (normalized) as the stable identifier,
 *   NEVER the backend-assigned numeric/UUID `user.id`.
 *
 *   Reason: The backend may return different IDs on different deployments
 *   (e.g. numeric in prod, UUID in demo), whereas the email is constant.
 *   Using email guarantees the same localStorage key across every login.
 */

/** Normalize any email or raw string into a safe localStorage key segment */
const normalizeToKey = (raw: string): string =>
  raw.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');

/**
 * Get the stable email-based identifier for the currently logged-in user.
 * Falls back to 'default' only when no auth state is present.
 */
export const getActiveUserId = (): string => {
  try {
    const raw = localStorage.getItem('auth_user');
    if (raw) {
      const user = JSON.parse(raw);
      // Always prefer email — it is the stable, consistent identifier
      if (user?.email) return normalizeToKey(user.email);
    }
  } catch {}
  return 'default';
};

/**
 * Build the full scoped key for a given prefix + user identifier.
 *
 * IMPORTANT: If `userIdentifier` looks like a pure numeric backend ID
 * (e.g. "123"), we resolve to the email-based key instead, so data
 * written with a backend ID is always read back correctly on next login.
 */
export const getUserKey = (prefix: string, userIdentifier?: string): string => {
  let uid = userIdentifier;

  if (!uid) {
    uid = getActiveUserId();
  } else if (uid.includes('@')) {
    // Raw email passed in — normalize it
    uid = normalizeToKey(uid);
  } else if (/^\d+$/.test(uid)) {
    // Pure numeric ID from backend — resolve to stable email-based key
    uid = getActiveUserId();
  }
  // Otherwise uid is already a normalized slug (e.g. 'user_jatanujverma_gmail_com')

  return `${prefix}_${uid}`;
};

/**
 * Read a user-scoped value, with automatic migration from:
 *   1. A numeric-ID scoped key  (e.g. prefix_123)
 *   2. The legacy global un-scoped key  (e.g. prefix)
 */
export const getUserItem = (prefix: string, userId?: string): string | null => {
  const key = getUserKey(prefix, userId);
  const val = localStorage.getItem(key);
  if (val !== null) return val;

  // Migration pass 1: data may have been written under a numeric backend ID key
  try {
    const raw = localStorage.getItem('auth_user');
    if (raw) {
      const user = JSON.parse(raw);
      if (user?.id && /^\d+$/.test(String(user.id))) {
        const numericKey = `${prefix}_${user.id}`;
        const numericVal = localStorage.getItem(numericKey);
        if (numericVal !== null) {
          try { localStorage.setItem(key, numericVal); } catch {}
          return numericVal;
        }
      }
    }
  } catch {}

  // Migration pass 2: legacy un-scoped global key
  const legacyVal = localStorage.getItem(prefix);
  if (legacyVal !== null) {
    try { localStorage.setItem(key, legacyVal); } catch {}
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
