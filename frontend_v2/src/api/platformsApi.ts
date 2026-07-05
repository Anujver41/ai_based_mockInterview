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

// ─────────────────────────────────────────────
// LocalStorage helpers
// ─────────────────────────────────────────────
const STORAGE_KEY = 'connectedPlatforms';

export const getConnectedPlatforms = (): PlatformConnection[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveConnectedPlatforms = (platforms: PlatformConnection[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(platforms));
};

export const addPlatform = (connection: PlatformConnection) => {
  const existing = getConnectedPlatforms().filter(p => p.id !== connection.id);
  saveConnectedPlatforms([...existing, connection]);
};

export const removePlatform = (id: PlatformId) => {
  const updated = getConnectedPlatforms().filter(p => p.id !== id);
  saveConnectedPlatforms(updated);
};

// ─────────────────────────────────────────────
// LeetCode
// Uses alfa-leetcode-api — a CORS-enabled community proxy (no proxy needed)
// https://github.com/alfaarghya/alfa-leetcode-api
// ─────────────────────────────────────────────
export const fetchLeetcodeStats = async (username: string): Promise<Partial<PlatformStats>> => {
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

// ─────────────────────────────────────────────
// GeeksForGeeks
// Strategy:
//   1. GFG's own internal practice API (practiceapi.geeksforgeeks.org) — most stable
//   2. Community stats API on Vercel — fallback
// Both are proxied through Vite to avoid browser CORS.
// ─────────────────────────────────────────────
export const fetchGFGStats = async (username: string): Promise<Partial<PlatformStats>> => {
  // ── Attempt 1: GFG's own practice API (most reliable) ──────────────────
  try {
    const res = await axios.get(
      `/api-proxy/gfg-practice/api/v1/user/user-stats/?slug=${username}`,
      { timeout: 15000 }
    );
    const d = res.data;
    // The practice API returns { data: { problem_solved_count, coding_score, ... } }
    const info = d?.data ?? d;

    if (!info || d?.status === 'error' || (!info.problem_solved_count && !info.total_problems_solved)) {
      throw new Error('No data in practice API response');
    }

    const toInt = (v: any) => parseInt(v ?? '0', 10) || 0;

    const total  = toInt(info.problem_solved_count ?? info.total_problems_solved);
    const easy   = toInt(info.easy_problem_solved_count  ?? info.Easy   ?? 0);
    const medium = toInt(info.medium_problem_solved_count ?? info.Medium ?? 0);
    const hard   = toInt(info.hard_problem_solved_count  ?? info.Hard   ?? 0);
    const school = toInt(info.school_problem_solved_count ?? 0);
    const basic  = toInt(info.basic_problem_solved_count  ?? 0);

    return {
      totalSolved:  total || (school + basic + easy + medium + hard),
      easySolved:   easy + basic + school,
      mediumSolved: medium,
      hardSolved:   hard,
      rank: info.ranking ?? info.rank,
      profileUrl: `https://www.geeksforgeeks.org/user/${username}`,
    };
  } catch (_practiceErr) {
    // Practice API failed — try the community Vercel API
  }

  // ── Attempt 2: Community stats API on Vercel ───────────────────────────
  let res2;
  try {
    res2 = await axios.get(
      `/api-proxy/gfg/?raw=true&userName=${username}`,
      { timeout: 15000 }
    );
  } catch (httpErr: any) {
    // Axios throws for non-2xx — extract the JSON error message
    const apiMsg: string =
      httpErr?.response?.data?.error ||
      httpErr?.response?.data?.message ||
      httpErr?.message ||
      'Unknown error';
    throw new Error(apiMsg);
  }

  const data = res2.data;

  if (data?.info?.status === 'error' || data?.status === 'error' || data?.error) {
    throw new Error(data?.error || data?.info?.status || 'User not found on GeeksForGeeks — check your username.');
  }

  const info        = data?.info        || data;
  const solvedStats = data?.solvedStats || {};

  const toInt = (v: any) => parseInt(v ?? '0', 10) || 0;

  const total  = toInt(info?.totalProblemsSolved ?? info?.total_problems_solved);
  const school = toInt(solvedStats?.school?.count ?? info?.School);
  const basic  = toInt(solvedStats?.basic?.count  ?? info?.Basic);
  const easy   = toInt(solvedStats?.easy?.count   ?? info?.Easy);
  const medium = toInt(solvedStats?.medium?.count  ?? info?.Medium);
  const hard   = toInt(solvedStats?.hard?.count   ?? info?.Hard);

  const computed = school + basic + easy + medium + hard;

  return {
    totalSolved:  total || computed,
    easySolved:   easy + basic + school,
    mediumSolved: medium,
    hardSolved:   hard,
    rank: info?.rank ?? info?.coding_score,
    profileUrl: `https://www.geeksforgeeks.org/user/${username}`,
  };
};

// ─────────────────────────────────────────────
// Codeforces
// Official public API — has CORS headers natively.
// Proxy also available as fallback: /api-proxy/codeforces
// ─────────────────────────────────────────────
export const fetchCodeforcesStats = async (username: string): Promise<Partial<PlatformStats>> => {
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
// Routed through Vite proxy → bypasses CORS
// Proxy: /api-proxy/hackerrank → https://www.hackerrank.com
// ─────────────────────────────────────────────
export const fetchHackerRankStats = async (username: string): Promise<Partial<PlatformStats>> => {
  // scores_elo endpoint returns contest scores — best approximation for total activity
  const res = await axios.get(
    `/api-proxy/hackerrank/rest/hackers/${username}/scores_elo`,
    { timeout: 15000 }
  );

  const models: any[] = res.data?.models ?? [];
  // Each model is a domain (Algorithms, Data Structures etc.) with a score & rank
  const totalScore = models.reduce((sum: number, m: any) => sum + (m.score ?? 0), 0);

  return {
    totalSolved: Math.round(totalScore), // score as proxy for activity
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
    return { ...base, ...partial };
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
