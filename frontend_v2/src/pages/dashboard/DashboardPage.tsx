import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, Code2, Brain, Activity, TrendingUp, Trophy, Target, 
  GitBranch, FileText, ChevronRight, Zap, ListTodo, Flame, Link2, ExternalLink, RefreshCw,
  Dumbbell
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { getUserSubmissions } from '../../api/submissionApi';
import { getUserSessions } from '../../api/interviewApi';
import { getProblems } from '../../api/problemApi';
import {
  getConnectedPlatforms, fetchPlatformStats, fetchPlatformDailyData, fetchLeetCodeSkillTopics, PLATFORM_META,
  type PlatformStats, type PlatformDailyData
} from '../../api/platformsApi';
import { TopicDrillModal } from '../../components/TopicDrillModal';

export const DashboardPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();

  // Drill modal state
  const [drillTopic, setDrillTopic] = useState<{ name: string; mastery: number; solvedCount: number } | null>(null);

  // Fetch submissions
  const { data: submissions, isLoading: submissionsLoading } = useQuery({
    queryKey: ['all-submissions', user?.id],
    queryFn: () => getUserSubmissions(user?.id!),
    enabled: !!user?.id,
  });

  // Fetch interview sessions
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['interview-sessions-dashboard'],
    queryFn: getUserSessions,
    enabled: !!user?.id,
  });

  // Fetch problems to map IDs to details (like difficulty, title, tags)
  const { data: problemsPage, isLoading: problemsLoading } = useQuery({
    queryKey: ['all-problems-dashboard'],
    queryFn: () => getProblems(0, 100),
    enabled: !!user?.id,
  });
  const problems = problemsPage?.content || [];
  const problemMap = new Map(problems.map(p => [p.id, p]));

  // 4. Connected external platforms stats (15s stale time + refetch on focus for live updating)
  const connectedPlatforms = getConnectedPlatforms();
  const {
    data: platformStatsList = [],
    refetch: refetchPlatformStats,
    isFetching: isFetchingStats
  } = useQuery<PlatformStats[]>({
    queryKey: ['all-platform-stats', connectedPlatforms.map(c => `${c.id}:${c.username}`).join(',')],
    queryFn: () => Promise.all(connectedPlatforms.map(c => fetchPlatformStats(c))),
    enabled: connectedPlatforms.length > 0,
    staleTime: 1000 * 15,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  // 4b. Daily calendar data for the line chart
  const {
    data: platformDailyList = [],
    refetch: refetchPlatformDaily,
    isFetching: isFetchingDaily
  } = useQuery<PlatformDailyData[]>({
    queryKey: ['platform-daily-data', connectedPlatforms.map(c => `${c.id}:${c.username}`).join(',')],
    queryFn: () => Promise.all(connectedPlatforms.map(c => fetchPlatformDailyData(c))),
    enabled: connectedPlatforms.length > 0,
    staleTime: 1000 * 15,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  // 4c. Real skill topics for LeetCode
  const { data: leetcodeSkillMap = {} } = useQuery<Record<string, number>>({
    queryKey: ['leetcode-skill-topics', connectedPlatforms.find(c => c.id === 'leetcode')?.username],
    queryFn: () => {
      const conn = connectedPlatforms.find(c => c.id === 'leetcode');
      return conn ? fetchLeetCodeSkillTopics(conn.username) : Promise.resolve({});
    },
    enabled: !!connectedPlatforms.find(c => c.id === 'leetcode'),
    staleTime: 1000 * 60 * 30,
  });

  const handleSyncAll = async () => {
    await Promise.all([
      refetchPlatformStats(),
      refetchPlatformDaily(),
      queryClient.invalidateQueries({ queryKey: ['all-submissions'] })
    ]);
  };

  // 1. Calculate Combined Coding Streak across ALL platforms (local + LeetCode + GFG + Codeforces + HackerRank)
  const calculateCombinedStreak = (
    subs: any[],
    dailyList: PlatformDailyData[]
  ): number => {
    const activeDates = new Set<string>();

    // Add local submission dates
    (subs || []).forEach(s => {
      if (s.createdAt) {
        const d = new Date(s.createdAt);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        activeDates.add(`${yyyy}-${mm}-${dd}`);
      }
    });

    // Add external platform submission dates from daily maps
    (dailyList || []).forEach(pd => {
      if (pd.dailyMap) {
        Object.entries(pd.dailyMap).forEach(([dateStr, count]) => {
          if (count > 0) {
            activeDates.add(dateStr);
          }
        });
      }
    });

    if (activeDates.size === 0) return 0;

    const formatDateKey = (d: Date) => {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    const today = new Date();
    const todayKey = formatDateKey(today);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = formatDateKey(yesterday);

    let checkDate: Date;
    if (activeDates.has(todayKey)) {
      checkDate = new Date(today);
    } else if (activeDates.has(yesterdayKey)) {
      checkDate = new Date(yesterday);
    } else {
      // Missed both today and yesterday -> streak is 0!
      return 0;
    }

    let streakCount = 0;
    while (activeDates.has(formatDateKey(checkDate))) {
      streakCount++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return streakCount;
  };

  const streak = calculateCombinedStreak(submissions || [], platformDailyList);

  // 2. Problems Solved count & weekly progress (this platform only)
  const solvedProblems = Array.from(new Set(
    submissions?.filter(s => s.status === 'PASSED').map(s => s.problemId) || []
  ));
  const solvedCount = solvedProblems.length;

  // External platforms combined total
  const externalSolved = platformStatsList.reduce((sum, p) => sum + (p.totalSolved || 0), 0);
  const combinedSolved = solvedCount + externalSolved;
  const hasExternalPlatforms = connectedPlatforms.length > 0;

  // External solved this week
  const externalSolvedThisWeek = (platformDailyList || []).reduce((sum, pd) => {
    if (!pd.dailyMap) return sum;
    let pSum = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const isoKey = `${yyyy}-${mm}-${dd}`;
      pSum += pd.dailyMap[isoKey] || 0;
    }
    return sum + pSum;
  }, 0);

  const localSolvedThisWeek = Array.from(new Set(
    submissions?.filter(s => {
      if (s.status !== 'PASSED') return false;
      const diffTime = Date.now() - new Date(s.createdAt).getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    }).map(s => s.problemId) || []
  )).length;

  const solvedThisWeekCount = localSolvedThisWeek + externalSolvedThisWeek;

  const goal = 5;
  const remaining = goal - solvedThisWeekCount;
  const problemsGoalText = remaining > 0 
    ? `You're ${remaining} problem${remaining === 1 ? '' : 's'} away from your weekly goal.`
    : `You've reached your weekly goal of ${goal} problems! 🎉`;

  // 3. Interview Sessions weekly count
  const sessionsCount = sessions?.length || 0;
  const sessionsThisWeek = sessions?.filter(s => {
    const diffTime = Date.now() - new Date(s.createdAt).getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }).length || 0;

  // 4. Success Rate
  const totalSubmissions = submissions?.length || 0;
  const passedSubmissions = submissions?.filter(s => s.status === 'PASSED').length || 0;
  const successRate = totalSubmissions > 0 ? Math.round((passedSubmissions / totalSubmissions) * 100) : 0;

  // Build the label for the "Problems Solved" stat card, combining platform totals
  const todayCombinedLabel = hasExternalPlatforms
    ? `${solvedCount} here + ${externalSolved} across ${platformStatsList.length} platform${platformStatsList.length === 1 ? '' : 's'}`
    : `+${solvedThisWeekCount} this week`;

  // 5. Build dynamic primary stats (combined across platforms)
  const statsData = [
    {
      label: 'Problems Solved',
      value: combinedSolved.toLocaleString(),
      change: todayCombinedLabel,
      icon: Code2, color: 'text-blue-500', bg: 'bg-blue-500/10'
    },
    { label: 'Interview Sessions', value: sessionsCount.toString(), change: `+${sessionsThisWeek} this week`, icon: Brain, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { label: 'Success Rate', value: `${successRate}%`, change: 'Based on submissions', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Coding Streak', value: `${streak} Day${streak === 1 ? '' : 's'}`, change: streak > 0 ? 'Active streak!' : 'Submit code to start!', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  // 6. Build dynamic secondary stats
  const getGithubGrade = (scoreStr: string | null) => {
    if (!scoreStr) return 'N/A';
    const score = parseInt(scoreStr, 10);
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  };

  const resumeScore = localStorage.getItem('resumeScore') || (localStorage.getItem('resumeAnalysis') ? JSON.parse(localStorage.getItem('resumeAnalysis')!).score.toString() : '68');
  const githubScore = localStorage.getItem('githubScore') || '87';

  const secondaryStats = [
    { label: 'Total Submissions', value: totalSubmissions.toString(), icon: Activity, color: 'text-cyan-500', link: '/submissions' },
    { label: 'AI Reviews', value: localStorage.getItem('aiReviewsCount') || '0', icon: Zap, color: 'text-yellow-500', link: '/problems' },
    { label: 'Resume ATS Score', value: `${resumeScore} / 100`, icon: FileText, color: 'text-pink-500', link: '/resume' },
    { label: 'GitHub Profile Score', value: `${githubScore} / 100 (${getGithubGrade(githubScore)})`, icon: GitBranch, color: 'text-blue-400', link: '/github' },
  ];

  // 7. Line Chart: aggregate daily solved from ALL platforms (this + external)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const lineData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const isoKey = d.toISOString().split('T')[0]; // YYYY-MM-DD
    const dayName = daysOfWeek[d.getDay()];

    // Local platform: count unique solved problems
    const localPassedSubs = submissions?.filter(s =>
      s.status === 'PASSED' && new Date(s.createdAt).toISOString().split('T')[0] === isoKey
    ) || [];
    const localCount = Array.from(new Set(localPassedSubs.map(s => s.problemId))).length;

    // External platforms: sum from their daily maps
    const externalCount = platformDailyList.reduce((sum, pd) => {
      return sum + (pd.dailyMap[isoKey] || 0);
    }, 0);

    const total = localCount + externalCount;

    // Build breakdown for tooltip
    const breakdown: Record<string, number> = { 'This Platform': localCount };
    platformDailyList.forEach(pd => {
      if (pd.dailyMap[isoKey]) {
        const meta = PLATFORM_META[pd.id];
        breakdown[meta.name] = pd.dailyMap[isoKey];
      }
    });

    return { name: dayName, date: isoKey, total, localCount, externalCount, breakdown };
  });

  // Max for dynamic Y-axis
  const maxDaySolved = Math.max(...lineData.map(d => d.total), 0);
  const yAxisMax = Math.max(maxDaySolved + 1, 5);

  // 8. Bar Chart: Weekly Consistency (submissions per week over past 4 weeks)
  // Calculates ACTUAL daily submissions per week from local + external daily maps (no fake averaging)
  const getWeeklyCounts = (startDaysAgo: number, endDaysAgo: number) => {
    const now = new Date();
    const end = new Date(now);
    end.setDate(now.getDate() - endDaysAgo);
    const start = new Date(now);
    start.setDate(now.getDate() - startDaysAgo);

    const startIso = start.toISOString().split('T')[0];
    const endIso = end.toISOString().split('T')[0];

    // Local platform passed submissions in date range
    const localPassedSubs = submissions?.filter(s => {
      if (s.status !== 'PASSED') return false;
      const subIso = new Date(s.createdAt).toISOString().split('T')[0];
      return subIso >= startIso && subIso <= endIso;
    }) || [];
    const localCount = Array.from(new Set(localPassedSubs.map(s => s.problemId))).length;

    // External platforms actual submissions in date range
    let externalCount = 0;
    platformDailyList.forEach(pd => {
      Object.entries(pd.dailyMap || {}).forEach(([dateKey, count]) => {
        if (dateKey >= startIso && dateKey <= endIso) {
          externalCount += (count as number);
        }
      });
    });

    return { localCount, externalCount };
  };

  const wk1 = getWeeklyCounts(27, 21);
  const wk2 = getWeeklyCounts(20, 14);
  const wk3 = getWeeklyCounts(13, 7);
  const wk4 = getWeeklyCounts(6, 0);

  const barData = [
    { name: 'Wk 1', 'This Platform': wk1.localCount, External: wk1.externalCount },
    { name: 'Wk 2', 'This Platform': wk2.localCount, External: wk2.externalCount },
    { name: 'Wk 3', 'This Platform': wk3.localCount, External: wk3.externalCount },
    { name: 'Wk 4', 'This Platform': wk4.localCount, External: wk4.externalCount },
  ];

  // 9. Pie Chart: Difficulty Distribution — aggregate across ALL platforms
  const localEasySolved = solvedProblems.filter(pid => problemMap.get(pid)?.difficulty === 'EASY').length;
  const localMediumSolved = solvedProblems.filter(pid => problemMap.get(pid)?.difficulty === 'MEDIUM').length;
  const localHardSolved = solvedProblems.filter(pid => problemMap.get(pid)?.difficulty === 'HARD').length;

  const extEasySolved = platformStatsList.reduce((sum, p) => sum + (p.easySolved || 0), 0);
  const extMediumSolved = platformStatsList.reduce((sum, p) => sum + (p.mediumSolved || 0), 0);
  const extHardSolved = platformStatsList.reduce((sum, p) => sum + (p.hardSolved || 0), 0);

  const easySolved = localEasySolved + extEasySolved;
  const mediumSolved = localMediumSolved + extMediumSolved;
  const hardSolved = localHardSolved + extHardSolved;
  const totalSolved = easySolved + mediumSolved + hardSolved || combinedSolved;

  const pieData = (easySolved + mediumSolved + hardSolved) > 0 ? [
    { name: 'Easy', value: easySolved, color: '#10b981' },
    { name: 'Medium', value: mediumSolved, color: '#eab308' },
    { name: 'Hard', value: hardSolved, color: '#ef4444' },
  ] : totalSolved > 0 ? [
    { name: `${totalSolved} Solved`, value: totalSolved, color: '#8b5cf6' },
  ] : [
    { name: 'No Problems Solved', value: 1, color: '#374151' }
  ];

  // 10. Real Topic Analysis & Mastery (100% Exact data from LeetCode + Local Platform)
  // Maps LeetCode tags & local platform tags into core DSA categories (BFS, DFS, Binary Tree, Linked List, Stack, DP, etc.)
  const CORE_DSA_MAPPING: Record<string, string> = {
    'array': 'Arrays',
    'arrays': 'Arrays',
    'string': 'Strings',
    'strings': 'Strings',
    'hash table': 'Hash Table',
    'hashmap': 'Hash Table',
    'hash map': 'Hash Table',
    'hash-table': 'Hash Table',
    'dynamic programming': 'Dynamic Programming',
    'dp': 'Dynamic Programming',
    'dp (dynamic programming)': 'Dynamic Programming',
    'tree': 'Trees & Binary Tree',
    'trees': 'Trees & Binary Tree',
    'binary tree': 'Trees & Binary Tree',
    'binary trees': 'Trees & Binary Tree',
    'depth-first search': 'Depth-First Search (DFS)',
    'dfs': 'Depth-First Search (DFS)',
    'graph': 'Depth-First Search (DFS)',
    'graphs': 'Depth-First Search (DFS)',
    'breadth-first search': 'Breadth-First Search (BFS)',
    'bfs': 'Breadth-First Search (BFS)',
    'stack': 'Stack',
    'monotonic stack': 'Stack',
    'queue': 'Heap & Queue',
    'deque': 'Heap & Queue',
    'heap (priority queue)': 'Heap & Queue',
    'heap': 'Heap & Queue',
    'priority queue': 'Heap & Queue',
    'linked list': 'Linked List',
    'linkedlist': 'Linked List',
    'linked-list': 'Linked List',
    'math': 'Math',
    'sorting': 'Sorting',
    'two pointers': 'Two Pointers',
    'greedy': 'Greedy',
    'binary search': 'Binary Search',
    'backtracking': 'Backtracking',
    'matrix': 'Matrix',
    'bit manipulation': 'Bit Manipulation',
    'union find': 'Union-Find',
    'union-find': 'Union-Find',
    'trie': 'Trie',
    'segment tree': 'Segment Tree',
  };

  const getCanonicalTagName = (rawTag: string): string => {
    const key = rawTag.trim().toLowerCase();
    return CORE_DSA_MAPPING[key] || rawTag;
  };

  const topicCountMap = new Map<string, number>();

  // 1. Add LeetCode real topic counts
  Object.entries(leetcodeSkillMap).forEach(([rawTag, count]) => {
    const canonical = getCanonicalTagName(rawTag);
    topicCountMap.set(canonical, (topicCountMap.get(canonical) || 0) + count);
  });

  // 2. Add Local Platform solved problem tags
  solvedProblems.forEach(pid => {
    const prob = problemMap.get(pid);
    prob?.tags?.forEach(tag => {
      const canonical = getCanonicalTagName(tag);
      topicCountMap.set(canonical, (topicCountMap.get(canonical) || 0) + 1);
    });
  });

  const maxTopicSolved = Math.max(...Array.from(topicCountMap.values()), 1);

  // Only include topics where solvedCount > 0 to eliminate fake 0% cards
  const allTopicsList = Array.from(topicCountMap.entries())
    .filter(([_, count]) => count > 0)
    .map(([name, count]) => {
      const mastery = Math.min(100, Math.round((count / maxTopicSolved) * 100));
      return { name, solvedCount: count, mastery };
    });

  // Strong Topics: top 4 topics with highest solved count
  const strongTopics = [...allTopicsList]
    .sort((a, b) => b.solvedCount - a.solvedCount)
    .slice(0, 4);

  // Needs Focus: lowest solved topics among your active practice areas
  const weakTopics = [...allTopicsList]
    .filter(t => !strongTopics.some(st => st.name === t.name))
    .sort((a, b) => a.solvedCount - b.solvedCount || a.name.localeCompare(b.name))
    .slice(0, 4);

  // 11. Recent Activity Feed
  const getTimeAgo = (isoStr: string) => {
    const diff = Date.now() - new Date(isoStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return 'yesterday';
    return `${days}d ago`;
  };

  const submissionActivities = (submissions || []).map(s => {
    const problemTitle = problemMap.get(s.problemId)?.title || `Problem #${s.problemId}`;
    return {
      type: 'problem',
      title: s.status === 'PASSED' ? `Solved ${problemTitle}` : `Attempted ${problemTitle} (${s.status.toLowerCase()})`,
      time: new Date(s.createdAt),
      icon: s.status === 'PASSED' ? CheckCircle2 : Code2,
      color: s.status === 'PASSED' ? 'text-emerald-500' : 'text-blue-500'
    };
  });

  const sessionActivities = (sessions || []).map(s => {
    return {
      type: 'interview',
      title: `Started ${s.topic} Mock Interview`,
      time: new Date(s.createdAt),
      icon: Brain,
      color: 'text-violet-500'
    };
  });

  // 11b. Dynamic activities from connected platforms (LeetCode, GFG, etc.)
  const platformActivities: { type: string; title: string; time: Date; icon: typeof Code2; color: string }[] = [];

  (platformDailyList || []).forEach(pData => {
    const meta = PLATFORM_META[pData.id];
    if (!meta || !pData.dailyMap) return;
    Object.entries(pData.dailyMap).forEach(([dateStr, count]) => {
      if (count > 0) {
        platformActivities.push({
          type: 'platform',
          title: `Solved ${count} problem${count > 1 ? 's' : ''} on ${meta.name}`,
          time: new Date(`${dateStr}T12:00:00`),
          icon: Code2,
          color: meta.color || 'text-amber-400'
        });
      }
    });
  });

  // Include connected platform total sync if available
  connectedPlatforms.forEach(conn => {
    const meta = PLATFORM_META[conn.id];
    const stats = platformStatsList.find(s => s.id === conn.id);
    if (meta && stats && !stats.error && stats.totalSolved > 0) {
      // Check if we have daily items for this platform
      const hasDaily = platformActivities.some(a => a.title.includes(meta.name));
      if (!hasDaily) {
        platformActivities.push({
          type: 'platform_summary',
          title: `Synced ${stats.totalSolved} solved on ${meta.name}`,
          time: new Date(),
          icon: Zap,
          color: meta.color || 'text-emerald-400'
        });
      }
    }
  });

  const allActivitiesRaw = [
    ...submissionActivities,
    ...sessionActivities,
    ...platformActivities,
  ].sort((a, b) => b.time.getTime() - a.time.getTime());

  // Deduplicate activities by title and date
  const uniqueActivities: typeof allActivitiesRaw = [];
  const seenKeys = new Set<string>();
  for (const act of allActivitiesRaw) {
    const key = `${act.title}-${act.time.toISOString().split('T')[0]}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueActivities.push(act);
    }
  }

  const recentActivity = uniqueActivities.slice(0, 5).map(act => ({
    type: act.type,
    title: act.title,
    time: getTimeAgo(act.time.toISOString()),
    icon: act.icon,
    color: act.color
  }));

  const username = user?.email 
    ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1)
    : 'User';

  // ── Real AI Recommendations (derived from actual user data) ──
  const recommendations: { title: string; desc: string; icon: typeof Code2; action?: string; actionUrl?: string }[] = [];

  // 1. Weak topic recs (mastery < 20%)
  const veryWeakTopics = allTopicsList.filter(t => t.mastery < 20).sort((a, b) => a.mastery - b.mastery);
  veryWeakTopics.slice(0, 2).forEach(t => {
    recommendations.push({
      title: `Practice ${t.name} Problems`,
      desc: `Only ${t.solvedCount} solved · ${t.mastery}% mastery — needs immediate attention.`,
      icon: Code2,
      action: 'Practice Now',
    });
  });

  // 2. Low success rate rec
  if (successRate < 60 && totalSubmissions >= 3) {
    recommendations.push({
      title: 'Focus on Problem Understanding',
      desc: `Your success rate is ${successRate}% — review failed submissions and patterns.`,
      icon: Target,
    });
  }

  // 3. Streak broken rec
  if (streak === 0 && totalSubmissions > 0) {
    recommendations.push({
      title: 'Restart Your Coding Streak',
      desc: 'You had activity before — solve at least 1 problem today to rebuild momentum.',
      icon: Flame,
      action: 'Solve a Problem',
      actionUrl: '/problems',
    });
  }

  // 4. Interview session rec
  const recentSessionCount = sessions?.filter(s => {
    const diff = Date.now() - new Date(s.createdAt).getTime();
    return diff / (1000 * 60 * 60 * 24) <= 7;
  }).length || 0;
  if (recentSessionCount === 0 && combinedSolved >= 10) {
    recommendations.push({
      title: 'Start a Mock Interview Session',
      desc: 'You haven\'t practiced interviews this week. Keep your skills sharp!',
      icon: Brain,
      action: 'Start Interview',
      actionUrl: '/interview',
    });
  }

  // 5. Connect platforms rec
  if (connectedPlatforms.length === 0) {
    recommendations.push({
      title: 'Connect LeetCode or GFG',
      desc: 'Track your external progress and get unified analytics across platforms.',
      icon: Link2,
      action: 'Connect Now',
      actionUrl: '/platforms',
    });
  }

  // 6. Weekly goal rec
  if (solvedThisWeekCount < goal && solvedThisWeekCount > 0) {
    recommendations.push({
      title: `Solve ${goal - solvedThisWeekCount} More Problem${goal - solvedThisWeekCount > 1 ? 's' : ''} This Week`,
      desc: `${solvedThisWeekCount}/${goal} weekly goal — ${goal - solvedThisWeekCount} more to go!`,
      icon: TrendingUp,
      action: 'Solve Problems',
      actionUrl: '/problems',
    });
  }

  // Fallback if no recs generated yet
  if (recommendations.length === 0) {
    if (combinedSolved === 0) {
      recommendations.push({
        title: 'Solve Your First Problem',
        desc: 'Get started by solving an Easy problem to kick off your journey.',
        icon: Code2,
        action: 'Browse Problems',
        actionUrl: '/problems',
      });
    } else {
      recommendations.push({
        title: 'Keep Pushing Your Limits',
        desc: `You've solved ${combinedSolved} problems — try a Hard one today!`,
        icon: Trophy,
        action: 'Explore Hard',
        actionUrl: '/problems',
      });
    }
  }

  // ── Real Roadmap Tasks (derived from user progress) ──
  const roadmapTasks: { title: string; completed: boolean; actionUrl?: string }[] = [];

  // 1. Weekly goal
  roadmapTasks.push({
    title: `Solve ${goal} Problems This Week (${solvedThisWeekCount}/${goal} done)`,
    completed: solvedThisWeekCount >= goal,
    actionUrl: '/problems',
  });

  // 2. Streak milestone (7-day streak)
  roadmapTasks.push({
    title: `Maintain 7-Day Coding Streak (${streak}/7 days)`,
    completed: streak >= 7,
  });

  // 3. Strong topics milestone
  const topStrongTopic = strongTopics[0];
  if (topStrongTopic) {
    roadmapTasks.push({
      title: `Master ${topStrongTopic.name} (${topStrongTopic.mastery}% mastery)`,
      completed: topStrongTopic.mastery >= 80,
    });
  } else {
    roadmapTasks.push({
      title: 'Solve 5 problems to unlock Topic Analysis',
      completed: false,
      actionUrl: '/problems',
    });
  }

  // 4. Improve a weak topic
  const firstWeak = veryWeakTopics[0] || weakTopics[0];
  if (firstWeak) {
    roadmapTasks.push({
      title: `Improve ${firstWeak.name} above 20% mastery (${firstWeak.mastery}% now)`,
      completed: firstWeak.mastery >= 20,
    });
  }

  // 5. Interview session goal
  roadmapTasks.push({
    title: `Complete 1 Mock Interview This Week (${recentSessionCount}/1)`,
    completed: recentSessionCount >= 1,
    actionUrl: '/interview',
  });

  // 6. Connect a platform (if not already done)
  if (connectedPlatforms.length === 0) {
    roadmapTasks.push({
      title: 'Connect an external coding platform',
      completed: false,
      actionUrl: '/platforms',
    });
  } else {
    roadmapTasks.push({
      title: `${connectedPlatforms.length} Platform${connectedPlatforms.length > 1 ? 's' : ''} Connected ✓`,
      completed: true,
    });
  }

  if (submissionsLoading || sessionsLoading || problemsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="relative w-16 h-16">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* ── 1. Welcome Hero Section ── */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Welcome back, {username} <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              You are on a <strong className="text-orange-500">{streak}-day streak</strong>! Keep up the momentum. {problemsGoalText}
            </p>
          </div>
          <Link 
            to="/problems" 
            className="shrink-0 bg-primary text-primary-foreground hover:opacity-90 px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-primary/25 flex items-center gap-2"
          >
            Continue Practicing <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── 2. Primary Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={i} 
            className="group p-5 bg-card border border-border rounded-2xl hover:border-primary/30 transition-all hover:shadow-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-3xl font-bold mt-1 text-foreground">{stat.value}</h3>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3 text-emerald-500" /> {stat.change}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── Secondary Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryStats.map((stat, i) => (
          <Link
            key={i}
            to={stat.link}
            className="p-4 bg-card border border-border rounded-2xl flex items-center gap-4 hover:border-primary/40 hover:bg-muted/30 transition-all group"
          >
            <div className="p-2 bg-muted/50 rounded-lg border border-border/50 group-hover:border-primary/30 transition-colors">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-bold text-foreground flex items-center gap-1.5">
                {stat.value}
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Connected Platforms Strip ── */}
      <div className="p-5 bg-card border border-border rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Link2 className="w-4 h-4 text-primary" />
            Connected Platforms
          </h3>
          <Link to="/platforms" className="text-xs text-primary hover:underline flex items-center gap-1">
            Manage <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {connectedPlatforms.length === 0 ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3">
            <p className="text-sm text-muted-foreground">
              Connect LeetCode, GFG, Codeforces or HackerRank to see your aggregated solved count here.
            </p>
            <Link
              to="/platforms"
              className="shrink-0 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-semibold hover:bg-primary/20 transition-colors flex items-center gap-2"
            >
              <Link2 className="w-3.5 h-3.5" /> Connect Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {platformStatsList.map((p) => {
              const meta = PLATFORM_META[p.id];
              return (
                <motion.a
                  key={p.id}
                  href={p.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-3 rounded-xl border ${meta.borderColor} ${meta.bgColor} flex flex-col gap-2 group hover:opacity-90 transition-opacity`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{meta.logo}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <p className={`text-2xl font-black ${meta.color}`}>
                      {p.error ? '—' : p.totalSolved.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">{meta.name}</p>
                    {p.error
                      ? <p className="text-[9px] text-red-400 mt-0.5 truncate" title={p.error}>⚠ Retry in Platforms</p>
                      : <p className="text-[10px] text-muted-foreground">@{p.username}</p>
                    }
                  </div>
                </motion.a>
              );
            })}
            {/* Placeholders for unconnected platforms */}
            {(['leetcode', 'gfg', 'codeforces', 'hackerrank'] as const)
              .filter(id => !connectedPlatforms.find(c => c.id === id))
              .map(id => {
                const meta = PLATFORM_META[id];
                return (
                  <Link
                    key={id}
                    to="/platforms"
                    className="p-3 rounded-xl border border-dashed border-border bg-muted/20 flex flex-col gap-2 hover:border-primary/40 transition-colors"
                  >
                    <span className="text-lg opacity-40">{meta.logo}</span>
                    <div>
                      <p className="text-2xl font-black text-muted-foreground/30">—</p>
                      <p className="text-[10px] text-muted-foreground/50 font-medium">{meta.name}</p>
                      <p className="text-[9px] text-primary/60 mt-0.5">+ Connect</p>
                    </div>
                  </Link>
                );
              })}
          </div>
        )}
      </div>

      {/* ── Platform Contribution Banner (shown only when platforms connected) ── */}
      {hasExternalPlatforms && (
        <div className="p-4 bg-card border border-primary/20 rounded-2xl bg-gradient-to-r from-blue-500/5 via-transparent to-violet-500/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Code2 className="w-4 h-4 text-primary" />
              Collective Progress — All Platforms Combined
            </h3>
            <span className="text-xs text-muted-foreground">
              Total: <span className="text-foreground font-bold">{combinedSolved.toLocaleString()}</span> problems
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* This Platform contribution */}
            <div className="flex flex-col p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider mb-1">This Platform</span>
              <span className="text-2xl font-black text-blue-400">{solvedCount}</span>
              <div className="mt-1.5 h-1 bg-blue-500/20 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${combinedSolved > 0 ? Math.round((solvedCount / combinedSolved) * 100) : 0}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground mt-1">{combinedSolved > 0 ? Math.round((solvedCount / combinedSolved) * 100) : 0}% of total</span>
            </div>
            {/* Per-platform breakdown */}
            {platformStatsList.filter(p => !p.error).map(p => {
              const meta = PLATFORM_META[p.id];
              const pct = combinedSolved > 0 ? Math.round((p.totalSolved / combinedSolved) * 100) : 0;
              return (
                <div key={p.id} className={`flex flex-col p-3 rounded-xl border ${meta.bgColor} ${meta.borderColor}`}>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${meta.color}`}>{meta.name}</span>
                  <span className={`text-2xl font-black ${meta.color}`}>{p.totalSolved.toLocaleString()}</span>
                  <div className="mt-1.5 h-1 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-current ${meta.color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1">{pct}% of total</span>
                </div>
              );
            })}
            {/* Placeholders for unconnected */}
            {(['leetcode', 'gfg', 'codeforces', 'hackerrank'] as const)
              .filter(id => !connectedPlatforms.find(c => c.id === id))
              .slice(0, Math.max(0, 3 - platformStatsList.length))
              .map(id => {
                const meta = PLATFORM_META[id];
                return (
                  <Link key={id} to="/platforms" className="flex flex-col p-3 rounded-xl border border-dashed border-border bg-muted/20 hover:border-primary/30 transition-colors">
                    <span className="text-[10px] text-muted-foreground/60 font-semibold uppercase tracking-wider mb-1">{meta.name}</span>
                    <span className="text-2xl font-black text-muted-foreground/30">—</span>
                    <span className="text-[9px] text-primary/60 mt-2">+ Connect</span>
                  </Link>
                );
              })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── 3. Line Chart Analytics ── */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-lg">Problems Solved</h3>
              {hasExternalPlatforms && (
                <button
                  onClick={handleSyncAll}
                  disabled={isFetchingStats || isFetchingDaily}
                  title="Click to fetch live profile data from connected platforms"
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFetchingStats || isFetchingDaily ? 'animate-spin' : ''}`} />
                  <span>{isFetchingStats || isFetchingDaily ? 'Syncing...' : 'Sync Live'}</span>
                </button>
              )}
            </div>
            <select className="bg-transparent border border-border rounded-lg text-sm px-3 py-1.5 outline-none text-muted-foreground">
              <option>This Week</option>
            </select>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            {hasExternalPlatforms
              ? `Daily solved across all platforms (This Platform + External)`
              : 'Problems solved per day this week'}
          </p>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#666" tick={{fontSize: 12}} tickLine={false} axisLine={false} dx={-10} allowDecimals={false} domain={[0, yAxisMax]} />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#1e1e24] border border-border p-3 rounded-xl shadow-xl text-xs space-y-1">
                        <p className="font-bold text-white mb-1">{label} ({data.date})</p>
                        <p className="text-purple-400 font-semibold mb-2">Total Solved: {data.total}</p>
                        <div className="border-t border-white/10 pt-1 space-y-0.5">
                          {Object.entries(data.breakdown || {}).map(([platform, count]) => (
                            <div key={platform} className="flex justify-between gap-4 text-muted-foreground">
                              <span>{platform}:</span>
                              <span className="font-mono text-white font-medium">+{String(count)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Daily Solved"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    const val = payload.total;
                    const displayLabel = val > 3 ? `${val}+` : val > 0 ? `${val}` : null;
                    return (
                      <g key={`dot-${cx}-${cy}`}>
                        <circle cx={cx} cy={cy} r={val > 0 ? 5 : 3} fill="#8b5cf6" stroke="#1a1b26" strokeWidth={2} />
                        {displayLabel && (
                          <text x={cx} y={cy - 10} fill="#a78bfa" fontSize={11} fontWeight="bold" textAnchor="middle">
                            {displayLabel}
                          </text>
                        )}
                      </g>
                    );
                  }}
                  activeDot={{r: 7, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2}}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {hasExternalPlatforms && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {platformStatsList.filter(p => !p.error).map(p => {
                const meta = PLATFORM_META[p.id];
                return (
                  <div key={p.id} className={`p-2 rounded-lg border ${meta.bgColor} ${meta.borderColor} text-center`}>
                    <p className={`text-xs font-black ${meta.color}`}>{p.totalSolved}</p>
                    <p className="text-[9px] text-muted-foreground">{meta.name}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Bar Chart Analytics ── */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-lg">Weekly Consistency</h3>
          </div>
          {hasExternalPlatforms && (
            <div className="flex items-center gap-4 mb-4">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" /> This Platform
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-sm bg-violet-500 inline-block" /> External Platforms
              </span>
            </div>
          )}
          {!hasExternalPlatforms && <div className="mb-4" />}
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} stackOffset="none">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#666" tick={{fontSize: 12}} tickLine={false} axisLine={false} dx={-10} allowDecimals={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#1e1e24', borderColor: '#333', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{fill: '#333', opacity: 0.2}}
                />
                <Bar dataKey="This Platform" name="This Platform" fill="#3b82f6" radius={hasExternalPlatforms ? [0,0,0,0] : [4,4,0,0]} stackId="a" />
                {hasExternalPlatforms && (
                  <Bar dataKey="External" name="External Platforms" fill="#8b5cf6" radius={[4, 4, 0, 0]} stackId="a" />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Difficulty Pie Chart ── */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
          <h3 className="font-semibold text-lg mb-2">Difficulty Distribution</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {hasExternalPlatforms
              ? `Aggregated across ${platformStatsList.length + 1} platforms.`
              : 'Based on your total solved problems.'}
          </p>
          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e1e24', borderColor: '#333', borderRadius: '12px', padding: '8px 12px' }}
                  itemStyle={{ color: '#fff', fontSize: '14px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-foreground">{combinedSolved}</span>
              <span className="text-xs text-muted-foreground">Total Solved</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                <span className="text-xs font-medium">{d.name} {(easySolved + mediumSolved + hardSolved) > 0 && `(${d.value})`}</span>
              </div>
            ))}
          </div>
          {hasExternalPlatforms && (
            <div className="mt-3 p-2 bg-muted/30 rounded-lg border border-border/50 text-center">
              <p className="text-[10px] text-muted-foreground">
                Includes <span className="text-foreground font-semibold">{externalSolved}</span> from external platforms
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ── 5. Weak vs Strong Topics ── */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" /> Topic Analysis
          </h3>
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-emerald-400 mb-3 uppercase tracking-wider">Strong Topics</p>
              {strongTopics.length === 0 ? (
                <div className="p-3 rounded-xl bg-muted/20 border border-dashed border-border text-center">
                  <p className="text-xs text-muted-foreground">Solve DSA problems to build topic mastery</p>
                  <Link to="/problems" className="text-[11px] text-primary hover:underline font-medium mt-1 inline-block">
                    Explore Problems →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {strongTopics.map((t, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">{t.name}</span>
                        <span className="text-muted-foreground">{t.solvedCount} Solved · {t.mastery}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.max(5, t.mastery)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="w-full h-px bg-border/50" />
            <div>
              <p className="text-sm font-semibold text-red-400 mb-3 uppercase tracking-wider">Needs Focus</p>
              <div className="space-y-3">
                {weakTopics.length === 0 ? (
                  <div className="p-3 rounded-xl bg-muted/20 border border-dashed border-border text-center">
                    <p className="text-xs text-muted-foreground">Looking great! No major weak spots detected.</p>
                  </div>
                ) : weakTopics.map((t, i) => {
                  const isWeak = t.mastery < 20;
                  return (
                    <div
                      key={i}
                      className={`rounded-xl p-2.5 transition-all ${
                        isWeak
                          ? 'bg-amber-500/5 border border-amber-500/20 ring-1 ring-amber-500/10'
                          : 'bg-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium">{t.name}</span>
                          {isWeak && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/20">
                              WEAK
                            </span>
                          )}
                        </div>
                        <span className="text-muted-foreground">{t.solvedCount === 0 ? '0 Solved' : `${t.solvedCount} Solved`} · {t.mastery}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                        <div
                          className={`h-full rounded-full ${
                            isWeak ? 'bg-amber-500' : 'bg-red-500/80'
                          }`}
                          style={{ width: `${Math.max(4, t.mastery)}%` }}
                        />
                      </div>
                      {isWeak && (
                        <button
                          onClick={() => setDrillTopic({ name: t.name, mastery: t.mastery, solvedCount: t.solvedCount })}
                          className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/25 text-amber-300 text-[11px] font-semibold hover:bg-amber-500/25 transition-colors group"
                        >
                          <Dumbbell className="w-3 h-3 group-hover:scale-110 transition-transform" />
                          Practice Now
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── 6. AI Recommendations & Roadmap ── */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Brain className="w-5 h-5 text-violet-500" /> AI Recommendations
              </h3>
              <span className="text-[10px] text-muted-foreground px-2 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 font-medium">
                {recommendations.length} insight{recommendations.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-2.5">
              {recommendations.slice(0, 3).map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  {rec.actionUrl ? (
                    <Link
                      to={rec.actionUrl}
                      className="flex gap-3 p-3 rounded-xl bg-muted/40 border border-border/50 hover:bg-violet-500/10 hover:border-violet-500/25 transition-all cursor-pointer group block"
                    >
                      <div className="p-2 bg-background rounded-lg border border-border shrink-0 group-hover:border-violet-500/30 transition-colors">
                        <rec.icon className="w-4 h-4 text-violet-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium leading-snug">{rec.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{rec.desc}</p>
                        {rec.action && (
                          <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-semibold text-violet-400 group-hover:text-violet-300">
                            {rec.action} <ChevronRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <div
                      onClick={() => {
                        if (rec.title.startsWith('Practice')) {
                          const topicName = rec.title.replace('Practice ', '').replace(' Problems', '');
                          const found = allTopicsList.find(t => t.name === topicName);
                          if (found) setDrillTopic(found);
                        }
                      }}
                      className="flex gap-3 p-3 rounded-xl bg-muted/40 border border-border/50 hover:bg-violet-500/10 hover:border-violet-500/25 transition-all cursor-pointer group"
                    >
                      <div className="p-2 bg-background rounded-lg border border-border shrink-0 group-hover:border-violet-500/30 transition-colors">
                        <rec.icon className="w-4 h-4 text-violet-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium leading-snug">{rec.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{rec.desc}</p>
                        {rec.action && (
                          <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-semibold text-violet-400 group-hover:text-violet-300">
                            {rec.action} <ChevronRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-blue-500" /> Your Roadmap
              </h3>
              <span className="text-[10px] text-muted-foreground">
                {roadmapTasks.filter(t => t.completed).length}/{roadmapTasks.length} done
              </span>
            </div>
            {/* mini progress bar for roadmap */}
            <div className="w-full h-1 bg-muted/30 rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${roadmapTasks.length > 0 ? (roadmapTasks.filter(t => t.completed).length / roadmapTasks.length) * 100 : 0}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <div className="space-y-1.5">
              {roadmapTasks.map((task, i) => (
                task.actionUrl ? (
                  <Link
                    key={i}
                    to={task.actionUrl}
                    className={`flex items-start gap-3 p-2.5 rounded-lg transition-colors group block ${
                      task.completed ? 'opacity-60' : 'hover:bg-muted/50 cursor-pointer'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full border shrink-0 flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-muted-foreground group-hover:border-blue-400'
                    }`}>
                      {task.completed && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className={`text-sm leading-snug ${
                      task.completed ? 'line-through text-muted-foreground' : 'text-foreground group-hover:text-blue-300'
                    }`}>{task.title}</span>
                  </Link>
                ) : (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-2.5 rounded-lg ${
                      task.completed ? 'opacity-60' : ''
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${
                      task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-muted-foreground'
                    }`}>
                      {task.completed && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className={`text-sm leading-snug ${
                      task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                    }`}>{task.title}</span>
                  </div>
                )
              ))}
            </div>
          </div>

        </div>

        {/* ── 4. Recent Activity ── */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> Recent Activity
            </h3>
            <Link to="/submissions" className="text-xs text-primary hover:underline">View All</Link>
          </div>
          <div className="relative flex-1">
            {recentActivity.length > 0 ? (
              <>
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border/60" />
                <div className="space-y-6">
                  {recentActivity.map((act, i) => (
                    <div key={i} className="relative flex gap-4">
                      <div className="relative z-10 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
                        <act.icon className={`w-3.5 h-3.5 ${act.color}`} />
                      </div>
                      <div className="pt-1.5">
                        <p className="text-sm font-medium">{act.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-muted-foreground my-auto">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-medium">No recent activity recorded</p>
                <p className="text-[11px] text-muted-foreground mt-1">Solve problems or connect external platforms to track your feed!</p>
              </div>
            )}
          </div>
          
          {/* ── 8. Mini Insights Previews ── */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <Link to="/github" className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-all block group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold text-foreground">GitHub Profile Score</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-xl font-extrabold text-foreground flex items-baseline gap-1">
                {githubScore} <span className="text-xs text-muted-foreground font-normal">/ 100</span>
              </p>
              <p className="text-[10px] font-semibold text-blue-400 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Grade: {getGithubGrade(githubScore)} — Optimized
              </p>
            </Link>
            <Link to="/resume" className="p-3.5 rounded-xl border border-pink-500/20 bg-pink-500/5 hover:bg-pink-500/10 transition-all block group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-pink-400" />
                  <span className="text-xs font-semibold text-foreground">Resume ATS Score</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-pink-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-xl font-extrabold text-foreground flex items-baseline gap-1">
                {resumeScore} <span className="text-xs text-muted-foreground font-normal">/ 100</span>
              </p>
              <p className="text-[10px] font-semibold text-amber-400 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                {parseInt(resumeScore, 10) >= 80 ? 'ATS Compliant' : parseInt(resumeScore, 10) >= 60 ? 'Needs Improvement' : 'Low Compliance'}
              </p>
            </Link>
          </div>
        </div>

      </div>

      {/* ── Topic Drill Modal ── */}
      {drillTopic && (
        <TopicDrillModal
          topic={drillTopic}
          onClose={() => setDrillTopic(null)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
