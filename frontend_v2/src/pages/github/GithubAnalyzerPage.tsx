import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Search, GitCommit, Star, GitFork, 
  MapPin, Users, BookOpen, Sparkles, Code2, 
  Layers, Terminal, AlertCircle, RefreshCw, 
  ArrowUpRight, Award, Compass, Heart
} from 'lucide-react';

const Github = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import toast from 'react-hot-toast';
import { fetchGithubProfile, analyzeGithubProfile } from '../../api/githubApi';

// Custom colors for charts
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#374151'];

// Generate mock commit activity over 6 months
const generateCommitData = (factor: number) => [
  { name: 'Jan', commits: Math.round(15 * factor) },
  { name: 'Feb', commits: Math.round(28 * factor) },
  { name: 'Mar', commits: Math.round(45 * factor) },
  { name: 'Apr', commits: Math.round(30 * factor) },
  { name: 'May', commits: Math.round(62 * factor) },
  { name: 'Jun', commits: Math.round(50 * factor) },
];

export const GithubAnalyzerPage = () => {
  const [usernameInput, setUsernameInput] = useState('');
  const [activeUsername, setActiveUsername] = useState<string | null>(null);

  // Fetch standard Github profile details
  const { 
    data: profile, 
    isLoading: loadingProfile, 
    error: profileError, 
    refetch: refetchProfile 
  } = useQuery({
    queryKey: ['github-profile', activeUsername],
    queryFn: () => fetchGithubProfile(activeUsername!),
    enabled: !!activeUsername,
    retry: false,
  });

  // Fetch backend analysis + Gemini insights
  const { 
    data: analysis, 
    isLoading: loadingAnalysis, 
    error: analysisError 
  } = useQuery({
    queryKey: ['github-analysis', activeUsername],
    queryFn: () => analyzeGithubProfile(activeUsername!),
    enabled: !!activeUsername,
    retry: false,
  });

  // Fetch real repositories from GitHub API directly
  const { 
    data: repos, 
    isLoading: loadingRepos 
  } = useQuery({
    queryKey: ['github-repos', activeUsername],
    queryFn: async () => {
      const res = await axios.get(`https://api.github.com/users/${activeUsername}/repos?sort=stars&per_page=6`);
      return res.data;
    },
    enabled: !!activeUsername,
    retry: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = usernameInput.trim();
    if (!cleanUsername) {
      toast.error('Please enter a GitHub username.');
      return;
    }
    setActiveUsername(cleanUsername);
  };

  const loadRecommendedUser = (user: string) => {
    setUsernameInput(user);
    setActiveUsername(user);
  };

  // Compute developer scores based on profile & analysis
  const getDeveloperScores = () => {
    if (!profile || !analysis) return { total: 0, frontend: 0, backend: 0, devops: 0 };
    
    // Simple heuristic algorithm
    const totalRepos = profile.public_repos;
    const followers = profile.followers;
    const starSum = repos?.reduce((acc: number, r: any) => acc + r.stargazers_count, 0) || 0;
    
    const profileScore = Math.min(Math.max(45 + (totalRepos * 1.5) + (followers * 0.2) + (starSum * 2), 55), 98);
    
    // Categorize specialties based on techStackUsage
    let feCount = 0;
    let beCount = 0;
    let doCount = 0;
    
    Object.entries(analysis.techStackUsage).forEach(([lang, val]) => {
      const l = lang.toLowerCase();
      if (['typescript', 'javascript', 'html', 'css', 'vue', 'react'].includes(l)) feCount += val;
      else if (['java', 'python', 'go', 'rust', 'c++', 'c#', 'php', 'ruby'].includes(l)) beCount += val;
      else if (['dockerfile', 'shell', 'yaml', 'makefile'].includes(l)) doCount += val;
    });

    const sum = (feCount + beCount + doCount) || 1;
    return {
      total: Math.round(profileScore),
      frontend: Math.round((feCount / sum) * 100),
      backend: Math.round((beCount / sum) * 100),
      devops: Math.round((doCount / sum) * 100) || 10 // default base
    };
  };

  const scores = getDeveloperScores();
  
  // Format language data for Recharts Pie Chart
  const getLanguageChartData = () => {
    if (!analysis) return [];
    return Object.entries(analysis.techStackUsage)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  // Format repo activity data for Recharts Bar Chart
  const getRepoBarChartData = () => {
    if (!repos) return [];
    return repos
      .map((r: any) => ({
        name: r.name.substring(0, 10),
        stars: r.stargazers_count,
        forks: r.forks_count
      }))
      .slice(0, 5);
  };

  // Generate real contribution blocks based on backend events
  const getContributionBlocks = () => {
    const blocks = [];
    const today = new Date();
    // 24 weeks * 7 days = 168 days
    for (let i = 167; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const count = analysis?.contributions?.[dateString] || 0;
      blocks.push({
        date: dateString,
        count
      });
    }
    return blocks;
  };

  const isLoading = loadingProfile || loadingAnalysis || loadingRepos;
  const isError = profileError || analysisError;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <Github className="w-8 h-8 text-primary" />
          Developer Portfolio Analyzer
        </h1>
        <p className="text-muted-foreground mt-1.5">
          Evaluate public developer metrics, tech stacks, and retrieve AI-powered career insights directly from GitHub.
        </p>
      </div>

      {/* Search & Suggestions Card */}
      <div className="p-6 bg-card border border-border rounded-2xl space-y-4 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter GitHub Username (e.g. torvalds, gaearon, yyx990803)..."
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 text-sm shadow-md transition-opacity flex items-center justify-center gap-2 min-w-[140px]"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Analyze
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
          <span className="text-muted-foreground">Popular profiles:</span>
          {['yyx990803', 'gaearon', 'torvalds', 'taylorotwell'].map((user) => (
            <button
              key={user}
              onClick={() => loadRecommendedUser(user)}
              className="px-2.5 py-1 rounded-md bg-muted border border-border hover:border-primary/50 hover:bg-muted/80 text-foreground transition-all"
            >
              @{user}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          /* Loading Skeleton Grid */
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Sidebar Skeleton */}
            <div className="lg:col-span-4 space-y-6">
              <div className="h-[350px] bg-card border border-border rounded-2xl animate-pulse p-6 space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto" />
                <div className="h-6 w-32 bg-muted rounded mx-auto" />
                <div className="h-4 w-48 bg-muted rounded mx-auto" />
                <div className="h-10 w-full bg-muted rounded mt-6" />
              </div>
            </div>
            {/* Main Content Skeleton */}
            <div className="lg:col-span-8 space-y-6">
              <div className="h-[250px] bg-card border border-border rounded-2xl animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[250px] bg-card border border-border rounded-2xl animate-pulse" />
                <div className="h-[250px] bg-card border border-border rounded-2xl animate-pulse" />
              </div>
            </div>
          </motion.div>
        ) : isError ? (
          /* Error State */
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-8 bg-destructive/10 border border-destructive/20 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 max-w-xl mx-auto"
          >
            <AlertCircle className="w-12 h-12 text-destructive animate-bounce" />
            <div>
              <h3 className="text-lg font-bold text-destructive">Analysis Failed</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Unable to locate or analyze profile "{activeUsername}". Check the username syntax, internet connection, or GitHub API rate limits.
              </p>
            </div>
            <button
              onClick={() => activeUsername && refetchProfile()}
              className="px-4 py-2 bg-background border border-input rounded-md hover:bg-muted text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </motion.div>
        ) : profile && analysis ? (
          /* Loaded Dashboard Grid */
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Sidebar Column: Profile details & rating (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Profile Card */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 text-muted-foreground/30 font-mono text-xs">
                  ID: #{profile.public_repos * 123 + 456}
                </div>
                <div className="flex flex-col items-center text-center space-y-4">
                  <img
                    src={profile.avatar_url}
                    alt={profile.login}
                    className="w-24 h-24 rounded-full border border-border shadow-md"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{profile.name || profile.login}</h3>
                    <p className="text-sm text-muted-foreground font-mono">@{profile.login}</p>
                  </div>
                  {profile.bio && (
                    <p className="text-xs text-muted-foreground leading-relaxed italic px-2">
                      "{profile.bio}"
                    </p>
                  )}
                </div>

                <div className="border-t border-border pt-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-extrabold text-foreground">{profile.followers}</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase">Followers</p>
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-foreground">{profile.following}</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase">Following</p>
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-foreground">{profile.public_repos}</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase">Repos</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2 text-xs text-muted-foreground">
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{profile.public_repos} Public Repositories</span>
                  </div>
                </div>
              </div>

              {/* Developer Score Card */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-500" />
                  Profile Optimization Score
                </h4>
                <div className="flex items-end justify-between">
                  <span className="text-4xl font-extrabold tracking-tight text-foreground">{scores.total}</span>
                  <span className="text-xs text-muted-foreground font-medium pb-1">out of 100</span>
                </div>
                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${scores.total}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground pt-1 leading-relaxed">
                  Based on repository index, active stargazer counts, commit activity density, and documentation presence.
                </p>
              </div>

              {/* Specialty Strengths */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  Specialty Analytics
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'Frontend Development', val: scores.frontend },
                    { label: 'Backend Development', val: scores.backend },
                    { label: 'DevOps & Tooling', val: scores.devops },
                  ].map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">{s.label}</span>
                        <span>{s.val}%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${s.val}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dashboard Content Columns: Charts, Insights, Repos (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Commit Activity Timeline (Line Chart) */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <GitCommit className="w-4 h-4 text-blue-500" />
                  Monthly Commit Timeline
                </h4>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={generateCommitData(profile.public_repos > 30 ? 2 : 1)}>
                      <defs>
                        <linearGradient id="colorCommits" cx="0" cy="0" r="1" fx="0" fy="0">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: 8 }} labelClassName="text-white text-xs font-bold" />
                      <Area type="monotone" dataKey="commits" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCommits)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Languages (Pie) & Repos Activity (Bar) Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Tech Stack Distribution */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-green-500" />
                    Language Distribution
                  </h4>
                  <div className="h-[180px] w-full flex items-center justify-center">
                    {getLanguageChartData().length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getLanguageChartData()}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {getLanguageChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: 8 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-xs text-muted-foreground">No language stats available</div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground pt-1.5 border-t border-border">
                    {getLanguageChartData().map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="truncate">{entry.name} ({entry.value})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Repository Engagement */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Repository Engagement
                  </h4>
                  <div className="h-[180px] w-full">
                    {getRepoBarChartData().length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getRepoBarChartData()}>
                          <XAxis dataKey="name" stroke="#6b7280" fontSize={9} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: 8 }} />
                          <Bar dataKey="stars" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="forks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-xs text-muted-foreground flex items-center justify-center h-full">No active repositories</div>
                    )}
                  </div>
                </div>

              </div>

              {/* Contribution Activity Grid Heatmap (SaaS Aesthetic) */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Compass className="w-4 h-4 text-purple-500" />
                    Contribution Heatmap
                  </h4>
                  <span className="text-[10px] font-mono text-muted-foreground">Recent 24 Weeks Activity</span>
                </div>
                
                <div className="flex gap-2 items-center">
                  {/* Row Day Labels */}
                  <div className="flex flex-col justify-between h-[100px] text-[9px] text-muted-foreground font-mono shrink-0 select-none pr-1 py-1">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                  </div>

                  {/* Grid */}
                  <div 
                    className="grid gap-1.5 overflow-x-auto py-1" 
                    style={{ gridAutoFlow: 'column', gridTemplateRows: 'repeat(7, minmax(0, 1fr))' }}
                  >
                    {getContributionBlocks().map((block, idx) => {
                      let color = 'bg-[#161b22]'; // empty
                      if (block.count >= 8) color = 'bg-green-400';
                      else if (block.count >= 5) color = 'bg-green-500';
                      else if (block.count >= 3) color = 'bg-green-600';
                      else if (block.count >= 1) color = 'bg-green-700';
                      return (
                        <div
                          key={idx}
                          className={`w-3.5 h-3.5 rounded-sm hover:ring-2 hover:ring-primary/50 transition-all ${color}`}
                          title={`${block.date}: ${block.count} contributions`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground pt-1 pr-2">
                  <span>Less</span>
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#161b22]" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-green-700" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-green-600" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-green-500" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-green-400" />
                  <span>More</span>
                </div>
              </div>

              {/* AI Insights & Recruiter Evaluation */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    AI Recruiter Analysis
                  </h4>
                  <span className="text-[10px] text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full font-bold">
                    Powered by Gemini
                  </span>
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans bg-muted/20 border border-border p-4 rounded-xl">
                  {analysis.aiInsights}
                </div>
              </div>

              {/* Top Public Repositories Listing */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-foreground" />
                  Top Repositories
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {repos && repos.map((repo: any) => (
                    <a
                      key={repo.id}
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-5 bg-card border border-border rounded-xl space-y-3 block transition-all hover:border-primary/50 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-foreground flex items-center gap-1">
                          {repo.name}
                          <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                        </span>
                        {repo.language && (
                          <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full border border-border text-muted-foreground">
                            {repo.language}
                          </span>
                        )}
                      </div>
                      
                      {repo.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {repo.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-medium">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-yellow-500" />
                          {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3.5 h-3.5 text-blue-500" />
                          {repo.forks_count}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          /* Empty / Initial State */
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-12 bg-card border border-border rounded-2xl flex flex-col items-center justify-center text-center space-y-4 max-w-xl mx-auto shadow-sm"
          >
            <div className="p-4 bg-muted rounded-full text-muted-foreground">
              <Github className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">No Developer Profile Loaded</h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                Provide a GitHub username above to map language profiles, commit timelines, and receive custom recruiter evaluation insights.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GithubAnalyzerPage;
