import { motion } from 'framer-motion';
import { 
  CheckCircle2, Code2, Brain, Activity, TrendingUp, Trophy, Target, 
  GitBranch, FileText, ChevronRight, Zap, ListTodo, Flame, Link2, ExternalLink
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { getUserSubmissions } from '../../api/submissionApi';
import { getUserSessions } from '../../api/interviewApi';
import { getProblems } from '../../api/problemApi';
import {
  getConnectedPlatforms, fetchPlatformStats, PLATFORM_META,
  type PlatformStats
} from '../../api/platformsApi';

export const DashboardPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

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

  // 4. Connected external platforms stats
  const connectedPlatforms = getConnectedPlatforms();
  const { data: platformStatsList = [] } = useQuery<PlatformStats[]>({
    queryKey: ['all-platform-stats', connectedPlatforms.map(c => `${c.id}:${c.username}`).join(',')],
    queryFn: () => Promise.all(connectedPlatforms.map(c => fetchPlatformStats(c))),
    enabled: connectedPlatforms.length > 0,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // 1. Calculate Coding Streak
  const calculateStreak = (subs: any[]): number => {
    if (!subs || subs.length === 0) return 0;
    const dates = new Set(subs.map(s => new Date(s.createdAt).toDateString()));
    
    let streak = 0;
    const today = new Date();
    const todayStr = today.toDateString();
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    let currentCheckDate = new Date();
    
    if (dates.has(todayStr)) {
      currentCheckDate = today;
    } else if (dates.has(yesterdayStr)) {
      currentCheckDate = yesterday;
    } else {
      return 0;
    }
    
    while (dates.has(currentCheckDate.toDateString())) {
      streak++;
      currentCheckDate.setDate(currentCheckDate.getDate() - 1);
    }
    return streak;
  };

  const streak = calculateStreak(submissions || []);

  // 2. Problems Solved count & weekly progress (this platform only)
  const solvedProblems = Array.from(new Set(
    submissions?.filter(s => s.status === 'PASSED').map(s => s.problemId) || []
  ));
  const solvedCount = solvedProblems.length;

  // External platforms combined total
  const externalSolved = platformStatsList.reduce((sum, p) => sum + (p.totalSolved || 0), 0);
  const combinedSolved = solvedCount + externalSolved;
  const hasExternalPlatforms = connectedPlatforms.length > 0;

  const solvedThisWeekCount = Array.from(new Set(
    submissions?.filter(s => {
      if (s.status !== 'PASSED') return false;
      const diffTime = Date.now() - new Date(s.createdAt).getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    }).map(s => s.problemId) || []
  )).length;

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

  // 5. Build dynamic primary stats (combined across platforms)
  const statsData = [
    {
      label: 'Problems Solved',
      value: combinedSolved.toLocaleString(),
      change: hasExternalPlatforms
        ? `${solvedCount} here + ${externalSolved} external`
        : `+${solvedThisWeekCount} this week`,
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

  const resumeScore = localStorage.getItem('resumeScore');
  const githubScore = localStorage.getItem('githubScore');

  const secondaryStats = [
    { label: 'Total Submissions', value: totalSubmissions.toString(), icon: Activity, color: 'text-cyan-500' },
    { label: 'AI Reviews', value: localStorage.getItem('aiReviewsCount') || '0', icon: Zap, color: 'text-yellow-500' },
    { label: 'Resume ATS Score', value: resumeScore ? `${resumeScore}/100` : 'N/A', icon: FileText, color: 'text-pink-500' },
    { label: 'GitHub Score', value: getGithubGrade(githubScore), icon: GitBranch, color: 'text-slate-400' },
  ];

  // 7. Line Chart: solved count by last 7 days
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const lineData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toDateString();
    const dayName = daysOfWeek[d.getDay()];
    const dayPassedSubmissions = submissions?.filter(s => 
      s.status === 'PASSED' && new Date(s.createdAt).toDateString() === dateStr
    ) || [];
    const daySolvedCount = Array.from(new Set(dayPassedSubmissions.map(s => s.problemId))).length;
    return { name: dayName, solved: daySolvedCount };
  });

  // 8. Bar Chart: Weekly Consistency (submissions per week over 4 weeks)
  const getSubmissionsInWeek = (startDaysAgo: number, endDaysAgo: number) => {
    const now = Date.now();
    const start = now - startDaysAgo * 24 * 60 * 60 * 1000;
    const end = now - endDaysAgo * 24 * 60 * 60 * 1000;
    return submissions?.filter(s => {
      const t = new Date(s.createdAt).getTime();
      return t >= start && t < end;
    }).length || 0;
  };
  const barData = [
    { name: 'Wk 1', submissions: getSubmissionsInWeek(28, 21) },
    { name: 'Wk 2', submissions: getSubmissionsInWeek(21, 14) },
    { name: 'Wk 3', submissions: getSubmissionsInWeek(14, 7) },
    { name: 'Wk 4', submissions: getSubmissionsInWeek(7, 0) },
  ];

  // 9. Pie Chart: Difficulty Distribution
  const easySolved = solvedProblems.filter(pid => problemMap.get(pid)?.difficulty === 'EASY').length;
  const mediumSolved = solvedProblems.filter(pid => problemMap.get(pid)?.difficulty === 'MEDIUM').length;
  const hardSolved = solvedProblems.filter(pid => problemMap.get(pid)?.difficulty === 'HARD').length;
  const totalSolved = easySolved + mediumSolved + hardSolved;

  const pieData = totalSolved > 0 ? [
    { name: 'Easy', value: easySolved, color: '#10b981' },
    { name: 'Medium', value: mediumSolved, color: '#eab308' },
    { name: 'Hard', value: hardSolved, color: '#ef4444' },
  ] : [
    { name: 'No Problems Solved', value: 1, color: '#374151' }
  ];

  // 10. Topic Mastery / Analysis
  const tagStats = new Map<string, { total: number, solved: number }>();
  problems.forEach(p => {
    p.tags?.forEach(tag => {
      if (!tagStats.has(tag)) {
        tagStats.set(tag, { total: 0, solved: 0 });
      }
      const stat = tagStats.get(tag)!;
      stat.total++;
      if (solvedProblems.includes(p.id)) {
        stat.solved++;
      }
    });
  });

  const tagsList = Array.from(tagStats.entries()).map(([name, stat]) => {
    const mastery = Math.round((stat.solved / stat.total) * 100);
    return { name, mastery };
  });

  const calculatedStrong = tagsList.filter(t => t.mastery >= 50).sort((a, b) => b.mastery - a.mastery).slice(0, 3);
  const calculatedWeak = tagsList.filter(t => t.mastery < 50).sort((a, b) => a.mastery - b.mastery).slice(0, 3);

  const strongTopics = calculatedStrong.length > 0 ? calculatedStrong : [
    { name: 'Arrays', mastery: 100 },
    { name: 'Binary Search', mastery: 85 },
    { name: 'Hash Maps', mastery: 80 }
  ];

  const weakTopics = calculatedWeak.length > 0 ? calculatedWeak : [
    { name: 'Dynamic Programming', mastery: 35 },
    { name: 'Graphs', mastery: 42 },
    { name: 'Tries', mastery: 20 }
  ];

  // 11. Recent Activity Feed
  const getTimeAgo = (isoStr: string) => {
    const diff = Date.now() - new Date(isoStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const submissionActivities = (submissions || []).slice(0, 5).map(s => {
    const problemTitle = problemMap.get(s.problemId)?.title || `Problem #${s.problemId}`;
    return {
      type: 'problem',
      title: s.status === 'PASSED' ? `Solved ${problemTitle}` : `Attempted ${problemTitle} (${s.status.toLowerCase()})`,
      time: new Date(s.createdAt),
      icon: s.status === 'PASSED' ? CheckCircle2 : Code2,
      color: s.status === 'PASSED' ? 'text-emerald-500' : 'text-blue-500'
    };
  });

  const sessionActivities = (sessions || []).slice(0, 5).map(s => {
    return {
      type: 'interview',
      title: `Started ${s.topic} Mock Interview`,
      time: new Date(s.createdAt),
      icon: Brain,
      color: 'text-violet-500'
    };
  });

  const allActivities = [
    ...submissionActivities,
    ...sessionActivities,
  ].sort((a, b) => b.time.getTime() - a.time.getTime())
   .slice(0, 4)
   .map(act => ({
     type: act.type,
     title: act.title,
     time: getTimeAgo(act.time.toISOString()),
     icon: act.icon,
     color: act.color
   }));

  const recentActivity = allActivities.length > 0 ? allActivities : [
    { type: 'problem', title: 'Solved Two Sum', time: '2 hours ago', icon: CheckCircle2, color: 'text-emerald-500' },
    { type: 'interview', title: 'Completed System Design Mock', time: '5 hours ago', icon: Brain, color: 'text-violet-500' },
    { type: 'resume', title: 'Resume ATS improved to 84', time: '1 day ago', icon: TrendingUp, color: 'text-pink-500' },
  ];

  const username = user?.email 
    ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1)
    : 'User';

  const recommendations = [
    { title: 'Solve 2 Medium DP Problems', desc: 'Your DP success rate is below average.', icon: Code2 },
    { title: 'Practice Graph Interviews', desc: 'Recommended before your upcoming mock interview.', icon: Brain },
  ];

  const roadmapTasks = [
    { title: 'Master Binary Search', completed: true },
    { title: 'Complete 5 Medium Arrays', completed: false },
    { title: 'Improve GitHub Commit Consistency', completed: false },
  ];

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
          <div key={i} className="p-4 bg-card border border-border rounded-2xl flex items-center gap-4">
            <div className="p-2 bg-muted/50 rounded-lg border border-border/50">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── 3. Line Chart Analytics ── */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Problems Solved</h3>
            <select className="bg-transparent border border-border rounded-lg text-sm px-3 py-1.5 outline-none text-muted-foreground">
              <option>This Week</option>
            </select>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#666" tick={{fontSize: 12}} tickLine={false} axisLine={false} dx={-10} allowDecimals={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e1e24', borderColor: '#333', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="solved" name="Solved" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#1a1b26'}} activeDot={{r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Bar Chart Analytics ── */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-6">Weekly Consistency</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#666" tick={{fontSize: 12}} tickLine={false} axisLine={false} dx={-10} allowDecimals={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e1e24', borderColor: '#333', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{fill: '#333', opacity: 0.2}}
                />
                <Bar dataKey="submissions" name="Submissions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Difficulty Pie Chart ── */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
          <h3 className="font-semibold text-lg mb-2">Difficulty Distribution</h3>
          <p className="text-sm text-muted-foreground mb-6">Based on your total solved problems.</p>
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
              <span className="text-3xl font-bold text-foreground">{totalSolved}</span>
              <span className="text-xs text-muted-foreground">Solved</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                <span className="text-xs font-medium">{d.name} {totalSolved > 0 && `(${d.value})`}</span>
              </div>
            ))}
          </div>
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
              <div className="space-y-3">
                {strongTopics.map((t, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{t.name}</span>
                      <span className="text-muted-foreground">{t.mastery}% Mastery</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${t.mastery}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full h-px bg-border/50" />
            <div>
              <p className="text-sm font-semibold text-red-400 mb-3 uppercase tracking-wider">Needs Improvement</p>
              <div className="space-y-3">
                {weakTopics.map((t, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{t.name}</span>
                      <span className="text-muted-foreground">{t.mastery}% Mastery</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${t.mastery}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 6. AI Recommendations & Roadmap ── */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-violet-500" /> AI Recommendations
            </h3>
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors cursor-pointer group">
                  <div className="p-2 bg-background rounded-lg border border-border shrink-0 group-hover:border-violet-500/30 transition-colors">
                    <rec.icon className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{rec.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-blue-500" /> Upcoming Roadmap
            </h3>
            <div className="space-y-2">
              {roadmapTasks.map((task, i) => (
                <div key={i} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
                  <div className={`w-4 h-4 rounded-full border ${task.completed ? 'bg-primary border-primary flex items-center justify-center' : 'border-muted-foreground'}`}>
                    {task.completed && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.title}</span>
                </div>
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
          </div>
          
          {/* ── 8. Mini Insights Previews ── */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <Link to="/github" className="p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/50 transition-colors block">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-semibold">GitHub Insight</span>
              </div>
              <p className="text-lg font-bold text-foreground">
                {githubScore ? `Score: ${githubScore}` : 'Not Analyzed'}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium">
                {githubScore ? `Grade: ${getGithubGrade(githubScore)}` : 'Click to analyze profile'}
              </p>
            </Link>
            <Link to="/resume" className="p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/50 transition-colors block">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-semibold">Resume ATS</span>
              </div>
              <p className="text-lg font-bold text-foreground">
                {resumeScore ? `${resumeScore} / 100` : 'Not Analyzed'}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium">
                {resumeScore ? 'Score updated' : 'Click to scan resume'}
              </p>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
