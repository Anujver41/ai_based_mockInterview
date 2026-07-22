import axios from 'axios';

// ─────────────────────────────────────────────
// Platform connection model
// ─────────────────────────────────────────────
export type PlatformId = 'leetcode' | 'gfg' | 'codeforces' | 'hackerrank';

export interface PlatformConnection {
  id: PlatformId;
  username: string;
}

export interface PlatformStats {
  id: PlatformId;
  name: string;
  username: string;
  totalSolved: number;
  easySolved?: number;
  mediumSolved?: number;
  hardSolved?: number;
  rank?: string | number;
  rating?: number;
  avatarUrl?: string;
  profileUrl: string;
  loading: boolean;
  error: string | null;
}

// dailyMap: ISO date string (YYYY-MM-DD) -> submission count for that day
export interface PlatformDailyData {
  id: PlatformId;
  dailyMap: Record<string, number>; // e.g. { '2026-07-20': 3, '2026-07-19': 1 }
  error: string | null;
}

// ─────────────────────────────────────────────
// LocalStorage helpers
// ─────────────────────────────────────────────
const STORAGE_KEY = 'connectedPlatforms';

export const cleanUsername = (input: string, _platformId?: PlatformId): string => {
  if (!input) return '';
  let u = input.trim();

  // Strip full URLs (http/https, domain prefixes)
  u = u.replace(/^https?:\/\/(www\.)?/i, '');

  // Strip platform-specific path prefixes
  u = u.replace(/^(geeksforgeeks\.org\/(profile|user)\/)/i, '');
  u = u.replace(/^(leetcode\.com\/(u|profile)?\/)/i, '');
  u = u.replace(/^(codeforces\.com\/profile\/)/i, '');
  u = u.replace(/^(hackerrank\.com\/(profile\/)?)/i, '');

  // Remove query parameters or hash fragments
  u = u.split('?')[0].split('#')[0];

  // If slashes remain, extract last non-empty path component
  if (u.includes('/')) {
    const parts = u.split('/').filter(Boolean);
    u = parts[parts.length - 1] || u;
  }

  // Strip leading @
  return u.replace(/^@/, '');
};

export const getConnectedPlatforms = (): PlatformConnection[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: PlatformConnection[] = raw ? JSON.parse(raw) : [];
    // Ensure all stored usernames are cleaned
    return list.map(p => ({ ...p, username: cleanUsername(p.username, p.id) }));
  } catch {
    return [];
  }
};

export const saveConnectedPlatforms = (platforms: PlatformConnection[]) => {
  const cleaned = platforms.map(p => ({ ...p, username: cleanUsername(p.username, p.id) }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
};

export const addPlatform = (connection: PlatformConnection) => {
  const cleanConn = { ...connection, username: cleanUsername(connection.username, connection.id) };
  const existing = getConnectedPlatforms().filter(p => p.id !== cleanConn.id);
  saveConnectedPlatforms([...existing, cleanConn]);
};

export const removePlatform = (id: PlatformId) => {
  const updated = getConnectedPlatforms().filter(p => p.id !== id);
  saveConnectedPlatforms(updated);
};

// ─────────────────────────────────────────────
// LeetCode
// Uses alfa-leetcode-api — a CORS-enabled community proxy
// ─────────────────────────────────────────────
export const fetchLeetcodeStats = async (rawUsername: string): Promise<Partial<PlatformStats>> => {
  const username = cleanUsername(rawUsername, 'leetcode');
  if (!username) throw new Error('Invalid LeetCode username or profile URL');

  const res = await axios.get(
    `https://alfa-leetcode-api.onrender.com/userProfile/${username}`,
    { timeout: 15000 }
  );

  const d = res.data;
  if (!d || d.errors) throw new Error('User not found on LeetCode');

  return {
    totalSolved:  d.totalSolved  ?? 0,
    easySolved:   d.easySolved   ?? 0,
    mediumSolved: d.mediumSolved ?? 0,
    hardSolved:   d.hardSolved   ?? 0,
    rank: d.ranking,
    profileUrl: `https://leetcode.com/${username}`,
  };
};

/** Fetches actual real topic problem counts per skill category from LeetCode */
export const fetchLeetCodeSkillTopics = async (rawUsername: string): Promise<Record<string, number>> => {
  const username = cleanUsername(rawUsername, 'leetcode');
  if (!username) return {};

  try {
    const res = await axios.get(
      `https://alfa-leetcode-api.onrender.com/${username}/skill`,
      { timeout: 15000 }
    );
    const data = res.data || {};
    const skillMap: Record<string, number> = {};

    const categories = ['fundamental', 'intermediate', 'advanced'];
    for (const cat of categories) {
      if (Array.isArray(data[cat])) {
        data[cat].forEach((item: any) => {
          if (item.tagName && typeof item.problemsSolved === 'number') {
            skillMap[item.tagName] = item.problemsSolved;
          }
        });
      }
    }
    return skillMap;
  } catch {
    return {};
  }
};

// ─────────────────────────────────────────────
// GeeksForGeeks
// Scrapes user profile stats directly from GFG HTML hydration payload
// Strategy:
//   1. Vite Proxy (/api-proxy/gfg-site) in dev mode
// Cache helpers for platform stats persistence
const CACHE_PREFIX = 'platform_stats_cache_v1_';

const saveStatsCache = (platformId: string, stats: Partial<PlatformStats>) => {
  try {
    localStorage.setItem(CACHE_PREFIX + platformId, JSON.stringify({
      stats,
      cachedAt: Date.now()
    }));
  } catch {}
};

const getStatsCache = (platformId: string): Partial<PlatformStats> | null => {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + platformId);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.stats || null;
  } catch {
    return null;
  }
};

export const fetchGFGStats = async (rawUsername: string): Promise<Partial<PlatformStats>> => {
  const username = cleanUsername(rawUsername, 'gfg');
  if (!username) throw new Error('Invalid GeeksForGeeks username or profile URL');

  const profileUrl = `https://www.geeksforgeeks.org/profile/${username}`;

  const parseGFGHtml = (html: string): Partial<PlatformStats> | null => {
    if (!html || typeof html !== 'string') return null;

    // Combine raw HTML + Next.js hydration chunks
    const nextChunks = html.match(/self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g) || [];
    let combinedText = html + ' ';
    for (const chunk of nextChunks) {
      combinedText += chunk
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/\\u0022/g, '"')
        .replace(/\\u003c/g, '<')
        .replace(/\\u003e/g, '>') + ' ';
    }

    const totalMatch = combinedText.match(/"total_problems_solved"\s*:\s*(\d+)/i) ||
                        combinedText.match(/total_problems_solved[^\d]*(\d+)/i) ||
                        combinedText.match(/problem_solved_count[^\d]*(\d+)/i) ||
                        combinedText.match(/Total Problems Solved[^\d]*(\d+)/i) ||
                        combinedText.match(/(\d+)\s*Problems Solved/i);

    const scoreMatch = combinedText.match(/"score"\s*:\s*(\d+)/i) ||
                        combinedText.match(/coding_score[^\d]*(\d+)/i) ||
                        combinedText.match(/score[^\d]*(\d+)/i) ||
                        combinedText.match(/Coding Score[^\d]*(\d+)/i);

    const rankMatch  = combinedText.match(/"institute_rank"\s*:\s*(\d+)/i) ||
                        combinedText.match(/institute_rank[^\d]*(\d+)/i) ||
                        combinedText.match(/"rank"\s*:\s*(\d+)/i);

    if (!totalMatch) return null;

    const total = parseInt(totalMatch[1], 10);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : undefined;
    const rank  = rankMatch ? parseInt(rankMatch[1], 10) : undefined;

    const result: Partial<PlatformStats> = {
      totalSolved: total,
      rating: score,
      rank: rank ? `#${rank} (Inst)` : (score ? `Score: ${score}` : undefined),
      profileUrl,
    };

    saveStatsCache('gfg', result);
    return result;
  };

  // Attempt 1: Vite proxy to GFG user page
  try {
    const res = await axios.get(
      `/api-proxy/gfg-site/user/${username}/`,
      { timeout: 12000, headers: { 'Accept': 'text/html' } }
    );
    const parsed = parseGFGHtml(res.data);
    if (parsed) return parsed;
  } catch (_err) {}

  // Attempt 2: Vite proxy to GFG profile page
  try {
    const res = await axios.get(
      `/api-proxy/gfg-site/profile/${username}`,
      { timeout: 12000, headers: { 'Accept': 'text/html' } }
    );
    const parsed = parseGFGHtml(res.data);
    if (parsed) return parsed;
  } catch (_err) {}

  // Attempt 3: AllOrigins proxy (user)
  try {
    const targetUrl = `https://www.geeksforgeeks.org/user/${username}/`;
    const res = await axios.get(
      `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
      { timeout: 15000 }
    );
    const parsed = parseGFGHtml(res.data);
    if (parsed) return parsed;
  } catch (_err) {}

  // Attempt 4: AllOrigins proxy (profile)
  try {
    const targetUrl = `https://www.geeksforgeeks.org/profile/${username}`;
    const res = await axios.get(
      `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
      { timeout: 15000 }
    );
    const parsed = parseGFGHtml(res.data);
    if (parsed) return parsed;
  } catch (_err) {}

  // Fallback: return cached stats if available to prevent UI error cards
  const cached = getStatsCache('gfg');
  if (cached) {
    return cached;
  }

  throw new Error('User not found on GeeksForGeeks — check your username or profile URL.');
};

// ─────────────────────────────────────────────
// Codeforces
// ─────────────────────────────────────────────
export const fetchCodeforcesStats = async (rawUsername: string): Promise<Partial<PlatformStats>> => {
  const username = cleanUsername(rawUsername, 'codeforces');
  if (!username) throw new Error('Invalid Codeforces username or profile URL');

  const [userRes, statusRes] = await Promise.all([
    axios.get(
      `/api-proxy/codeforces/api/user.info?handles=${username}`,
      { timeout: 12000 }
    ),
    axios.get(
      `/api-proxy/codeforces/api/user.status?handle=${username}&from=1&count=3000`,
      { timeout: 20000 }
    ),
  ]);

  if (userRes.data?.status !== 'OK') throw new Error('User not found on Codeforces');

  const cfUser = userRes.data.result[0];

  const accepted = new Set<string>();
  (statusRes.data?.result || []).forEach((sub: any) => {
    if (sub.verdict === 'OK') {
      accepted.add(`${sub.problem.contestId}-${sub.problem.index}`);
    }
  });

  return {
    totalSolved: accepted.size,
    rank:        cfUser.rank,
    rating:      cfUser.rating,
    avatarUrl:   cfUser.titlePhoto,
    profileUrl:  `https://codeforces.com/profile/${username}`,
  };
};

// ─────────────────────────────────────────────
// HackerRank
// ─────────────────────────────────────────────
export const fetchHackerRankStats = async (rawUsername: string): Promise<Partial<PlatformStats>> => {
  const username = cleanUsername(rawUsername, 'hackerrank');
  if (!username) throw new Error('Invalid HackerRank username or profile URL');

  const res = await axios.get(
    `/api-proxy/hackerrank/rest/hackers/${username}/scores_elo`,
    { timeout: 15000 }
  );

  const models: any[] = res.data?.models ?? [];
  const totalScore = models.reduce((sum: number, m: any) => sum + (m.score ?? 0), 0);

  return {
    totalSolved: Math.round(totalScore),
    rank: models[0]?.rank,
    profileUrl: `https://www.hackerrank.com/${username}`,
  };
};

// ─────────────────────────────────────────────
// Unified fetcher — normalises all errors into the result
// ─────────────────────────────────────────────
export const fetchPlatformStats = async (connection: PlatformConnection): Promise<PlatformStats> => {
  const base: PlatformStats = {
    id:           connection.id,
    name:         PLATFORM_META[connection.id].name,
    username:     connection.username,
    totalSolved:  0,
    profileUrl:   `${PLATFORM_META[connection.id].profileBaseUrl}${connection.username}`,
    loading:      false,
    error:        null,
  };

  try {
    let partial: Partial<PlatformStats>;
    switch (connection.id) {
      case 'leetcode':   partial = await fetchLeetcodeStats(connection.username);   break;
      case 'gfg':        partial = await fetchGFGStats(connection.username);         break;
      case 'codeforces': partial = await fetchCodeforcesStats(connection.username);  break;
      case 'hackerrank': partial = await fetchHackerRankStats(connection.username);  break;
      default:           throw new Error('Unsupported platform');
    }
    const res = { ...base, ...partial };
    if (res.totalSolved) {
      recordPlatformTotal(connection.id, res.totalSolved);
    }
    return res;
  } catch (err: any) {
    const msg: string =
      err?.response?.data?.message ||
      err?.response?.data?.error   ||
      err?.message                 ||
      'Failed to load stats';
    return { ...base, error: msg };
  }
};

// ─────────────────────────────────────────────
// Daily snapshot tracker for platforms (GFG, HackerRank, LeetCode, Codeforces)
// Tracks totalSolved changes per day to attribute solved problems to today's date
// ─────────────────────────────────────────────
const SNAPSHOT_KEY = 'platform_daily_snapshots_v2';

export const recordPlatformTotal = (platformId: PlatformId, totalSolved: number): Record<string, number> => {
  if (!totalSolved || totalSolved <= 0) return {};
  const todayStr = new Date().toISOString().split('T')[0];

  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY);
    const snapshots: Record<string, { baseline: number; lastDate: string; dailyHistory: Record<string, number> }> =
      raw ? JSON.parse(raw) : {};

    const pData = snapshots[platformId] || {
      baseline: totalSolved,
      lastDate: todayStr,
      dailyHistory: {}
    };

    // If day changed, compute starting baseline for the new day
    if (pData.lastDate !== todayStr) {
      // Sum up previous total
      const prevAdded = pData.dailyHistory[pData.lastDate] || 0;
      pData.baseline = pData.baseline + prevAdded;
      pData.lastDate = todayStr;
    }

    // If totalSolved increased beyond baseline, record the diff for today
    if (totalSolved > pData.baseline) {
      pData.dailyHistory[todayStr] = totalSolved - pData.baseline;
    } else if (totalSolved < pData.baseline) {
      // Adjusted baseline down if profile reset or count decreased
      pData.baseline = totalSolved;
    }

    snapshots[platformId] = pData;
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshots));

    return pData.dailyHistory || {};
  } catch {
    return {};
  }
};

export const getRecordedPlatformDailyMap = (platformId: PlatformId): Record<string, number> => {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY);
    if (!raw) return {};
    const snapshots = JSON.parse(raw);
    return snapshots[platformId]?.dailyHistory || {};
  } catch {
    return {};
  }
};


// ─────────────────────────────────────────────
// Daily submission calendar fetchers
// Returns a map of ISO date string -> submission count
// ─────────────────────────────────────────────

/** LeetCode: uses /userCalendar which returns submissionCalendar as {unixTimestamp: count} */
export const fetchLeetCodeDailyData = async (rawUsername: string): Promise<Record<string, number>> => {
  const username = cleanUsername(rawUsername, 'leetcode');
  try {
    const res = await axios.get(
      `https://alfa-leetcode-api.onrender.com/${username}/calendar`,
      { timeout: 15000 }
    );
    const calendarStr: string = res.data?.submissionCalendar || res.data?.calendar || '{}';
    const calendarObj: Record<string, number> = typeof calendarStr === 'string'
      ? JSON.parse(calendarStr)
      : calendarStr;
    // Convert unix timestamps (seconds) to YYYY-MM-DD keys
    const dailyMap: Record<string, number> = {};
    for (const [tsStr, count] of Object.entries(calendarObj)) {
      const date = new Date(parseInt(tsStr, 10) * 1000);
      const key = date.toISOString().split('T')[0]; // YYYY-MM-DD
      dailyMap[key] = (dailyMap[key] || 0) + (count as number);
    }
    return dailyMap;
  } catch {
    return {};
  }
};

/** Codeforces: derive from user.status submissions (we already have timestamps) */
export const fetchCodeforcesDailyData = async (rawUsername: string): Promise<Record<string, number>> => {
  const username = cleanUsername(rawUsername, 'codeforces');
  try {
    const res = await axios.get(
      `/api-proxy/codeforces/api/user.status?handle=${username}&from=1&count=3000`,
      { timeout: 20000 }
    );
    const dailyMap: Record<string, number> = {};
    (res.data?.result || []).forEach((sub: any) => {
      if (sub.verdict === 'OK' && sub.creationTimeSeconds) {
        const date = new Date(sub.creationTimeSeconds * 1000);
        const key = date.toISOString().split('T')[0];
        dailyMap[key] = (dailyMap[key] || 0) + 1;
      }
    });
    return dailyMap;
  } catch {
    return {};
  }
};

/** GFG: returns recorded daily map from live snapshot tracker */
export const fetchGFGDailyData = async (rawUsername: string): Promise<Record<string, number>> => {
  try {
    const stats = await fetchGFGStats(rawUsername);
    if (stats.totalSolved) {
      recordPlatformTotal('gfg', stats.totalSolved);
    }
  } catch {}
  return getRecordedPlatformDailyMap('gfg');
};

/** HackerRank: returns recorded daily map from live snapshot tracker */
export const fetchHackerRankDailyData = async (rawUsername: string): Promise<Record<string, number>> => {
  try {
    const stats = await fetchHackerRankStats(rawUsername);
    if (stats.totalSolved) {
      recordPlatformTotal('hackerrank', stats.totalSolved);
    }
  } catch {}
  return getRecordedPlatformDailyMap('hackerrank');
};

/** Unified daily data fetcher */
export const fetchPlatformDailyData = async (connection: PlatformConnection): Promise<PlatformDailyData> => {
  try {
    let dailyMap: Record<string, number> = {};
    switch (connection.id) {
      case 'leetcode': {
        const calendarMap = await fetchLeetCodeDailyData(connection.username);
        const recordedMap = getRecordedPlatformDailyMap('leetcode');
        dailyMap = { ...recordedMap, ...calendarMap };
        break;
      }
      case 'codeforces': {
        const cfMap = await fetchCodeforcesDailyData(connection.username);
        const recordedMap = getRecordedPlatformDailyMap('codeforces');
        dailyMap = { ...recordedMap, ...cfMap };
        break;
      }
      case 'gfg': {
        dailyMap = await fetchGFGDailyData(connection.username);
        break;
      }
      case 'hackerrank': {
        dailyMap = await fetchHackerRankDailyData(connection.username);
        break;
      }
    }
    return { id: connection.id, dailyMap, error: null };
  } catch (err: any) {
    return { id: connection.id, dailyMap: getRecordedPlatformDailyMap(connection.id), error: err?.message || 'Failed to fetch daily data' };
  }
};

// ─────────────────────────────────────────────
// Platform metadata (colours, logos, labels)
// ─────────────────────────────────────────────
export const PLATFORM_META: Record<
  PlatformId,
  {
    name:           string;
    color:          string;
    bgColor:        string;
    borderColor:    string;
    logo:           string;
    placeholder:    string;
    profileBaseUrl: string;
  }
> = {
  leetcode: {
    name:           'LeetCode',
    color:          'text-yellow-400',
    bgColor:        'bg-yellow-500/10',
    borderColor:    'border-yellow-500/30',
    logo:           '🧠',
    placeholder:    'e.g. john_doe',
    profileBaseUrl: 'https://leetcode.com/',
  },
  gfg: {
    name:           'GeeksForGeeks',
    color:          'text-green-400',
    bgColor:        'bg-green-500/10',
    borderColor:    'border-green-500/30',
    logo:           '🌱',
    placeholder:    'e.g. johndoe123',
    profileBaseUrl: 'https://www.geeksforgeeks.org/user/',
  },
  codeforces: {
    name:           'Codeforces',
    color:          'text-blue-400',
    bgColor:        'bg-blue-500/10',
    borderColor:    'border-blue-500/30',
    logo:           '⚡',
    placeholder:    'e.g. tourist',
    profileBaseUrl: 'https://codeforces.com/profile/',
  },
  hackerrank: {
    name:           'HackerRank',
    color:          'text-emerald-400',
    bgColor:        'bg-emerald-500/10',
    borderColor:    'border-emerald-500/30',
    logo:           '🎯',
    placeholder:    'e.g. johndoe',
    profileBaseUrl: 'https://www.hackerrank.com/',
  },
};
