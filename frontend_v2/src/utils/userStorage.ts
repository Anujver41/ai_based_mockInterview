/**
 * User-Scoped Storage Utility
 * Prevents account data leakage (platforms, resume ATS, GitHub, submissions)
 * across different user logins in production.
 */

export const getActiveUserId = (): string => {
  try {
    const raw = localStorage.getItem('auth_user');
    if (raw) {
      const user = JSON.parse(raw);
      if (user?.id) return String(user.id);
      if (user?.email) return String(user.email);
    }
  } catch {}
  return 'anonymous';
};

export const getUserKey = (prefix: string, userId?: string): string => {
  const uid = userId || getActiveUserId();
  return `${prefix}_${uid}`;
};

export const getUserItem = (prefix: string, userId?: string): string | null => {
  const key = getUserKey(prefix, userId);
  return localStorage.getItem(key);
};

export const setUserItem = (prefix: string, value: string, userId?: string): void => {
  const key = getUserKey(prefix, userId);
  localStorage.setItem(key, value);
};

export const removeUserItem = (prefix: string, userId?: string): void => {
  const key = getUserKey(prefix, userId);
  localStorage.removeItem(key);
};

/**
 * Purges old un-scoped global keys to prevent stale data
 * from bleeding into newly created or switched accounts.
 */
export const purgeLegacyGlobalKeys = (): void => {
  const legacyKeys = [
    'connectedPlatforms',
    'resumeScore',
    'resumeAnalysis',
    'resumeFileName',
    'githubScore',
    'githubUsername',
    'aiReviewsCount',
    'all_submissions',
    'interview_sessions',
  ];
  legacyKeys.forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch {}
  });
};
