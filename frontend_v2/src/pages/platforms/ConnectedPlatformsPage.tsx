import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Link2, Unlink, ExternalLink, RefreshCw, CheckCircle2, AlertCircle,
  TrendingUp, Code2, Target, Star, Plus, X, Trophy, ChevronRight,
  Loader2
} from 'lucide-react';
import {
  getConnectedPlatforms, addPlatform, removePlatform, fetchPlatformStats,
  PLATFORM_META, type PlatformId, type PlatformStats, type PlatformConnection
} from '../../api/platformsApi';

const PLATFORM_IDS: PlatformId[] = ['leetcode', 'gfg', 'codeforces', 'hackerrank'];

// ── Single Platform Card ──────────────────────────────────────────────────────
const PlatformCard = ({
  id,
  connection,
  onDisconnect,
}: {
  id: PlatformId;
  connection?: PlatformConnection;
  onDisconnect: (id: PlatformId) => void;
}) => {
  const meta = PLATFORM_META[id];
  const [username, setUsername] = useState('');
  const [connecting, setConnecting] = useState(false);

  const { data: stats, isLoading, isError, refetch } = useQuery<PlatformStats>({
    queryKey: ['platform-stats', id, connection?.username],
    queryFn: () => fetchPlatformStats(connection!),
    enabled: !!connection?.username,
    staleTime: 1000 * 60 * 5, // 5 min
    retry: 1,
  });

  const handleConnect = async () => {
    const trimmed = username.trim();
    if (!trimmed) {
      toast.error('Please enter a username.');
      return;
    }
    setConnecting(true);
    try {
      addPlatform({ id, username: trimmed });
      setUsername('');
      toast.success(`Connected to ${meta.name}!`);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    removePlatform(id);
    onDisconnect(id);
    toast.success(`Disconnected from ${meta.name}`);
  };

  if (!connection) {
    // Unconnected State
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative p-6 bg-card border ${meta.borderColor} rounded-2xl space-y-5 hover:shadow-md transition-shadow`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${meta.bgColor} flex items-center justify-center text-2xl`}>
              {meta.logo}
            </div>
            <div>
              <h3 className={`font-bold text-base ${meta.color}`}>{meta.name}</h3>
              <p className="text-xs text-muted-foreground">Not connected</p>
            </div>
          </div>
          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border">
            Disconnected
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder={meta.placeholder}
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleConnect()}
            className="flex-1 bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          />
          <button
            onClick={handleConnect}
            disabled={connecting || !username.trim()}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50
              ${meta.bgColor} ${meta.color} border ${meta.borderColor} hover:opacity-80`}
          >
            {connecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            Connect
          </button>
        </div>
      </motion.div>
    );
  }

  // Connected State
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative p-6 bg-card border ${meta.borderColor} rounded-2xl space-y-5 hover:shadow-md transition-shadow`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${meta.bgColor} flex items-center justify-center text-2xl relative`}>
            {meta.logo}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div>
            <h3 className={`font-bold text-base ${meta.color}`}>{meta.name}</h3>
            <a
              href={`${meta.profileBaseUrl}${connection.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              @{connection.username}
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => refetch()} title="Refresh stats" className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleDisconnect} title="Disconnect" className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors">
            <Unlink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-8 bg-muted rounded-lg" />
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map(i => <div key={i} className="h-12 bg-muted rounded-lg" />)}
          </div>
        </div>
      ) : isError || stats?.error ? (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 space-y-2">
          <div className="flex items-start gap-2 text-sm text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="flex-1">{stats?.error || 'Failed to load stats.'}</span>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors font-medium"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
            <a
              href={`${meta.profileBaseUrl}${connection.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="w-3 h-3" /> Verify username on {meta.name}
            </a>
          </div>
        </div>
      ) : stats ? (
        <>
          {/* Total Solved Highlight */}
          <div className={`p-4 rounded-xl ${meta.bgColor} border ${meta.borderColor} flex items-center justify-between`}>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Solved</p>
              <p className={`text-4xl font-black mt-1 ${meta.color}`}>{stats.totalSolved.toLocaleString()}</p>
            </div>
            <div className="text-right">
              {stats.rank && (
                <div className="flex flex-col items-end gap-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Rank</p>
                  <p className="text-sm font-bold text-foreground">
                    {typeof stats.rank === 'number' ? stats.rank.toLocaleString() : stats.rank}
                  </p>
                </div>
              )}
              {stats.rating && (
                <div className="flex flex-col items-end gap-1 mt-2">
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Rating</p>
                  <p className="text-sm font-bold text-foreground">{stats.rating}</p>
                </div>
              )}
            </div>
          </div>

          {/* Difficulty Breakdown */}
          {(stats.easySolved !== undefined || stats.mediumSolved !== undefined || stats.hardSolved !== undefined) && (
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                <p className="text-xs text-emerald-400 font-semibold">Easy</p>
                <p className="text-lg font-bold text-foreground mt-0.5">{stats.easySolved ?? '—'}</p>
              </div>
              <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-center">
                <p className="text-xs text-yellow-400 font-semibold">Medium</p>
                <p className="text-lg font-bold text-foreground mt-0.5">{stats.mediumSolved ?? '—'}</p>
              </div>
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                <p className="text-xs text-red-400 font-semibold">Hard</p>
                <p className="text-lg font-bold text-foreground mt-0.5">{stats.hardSolved ?? '—'}</p>
              </div>
            </div>
          )}
        </>
      ) : null}
    </motion.div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const ConnectedPlatformsPage = () => {
  const queryClient = useQueryClient();
  const [connections, setConnections] = useState<PlatformConnection[]>(() => getConnectedPlatforms());

  // Reload connections from localStorage whenever a platform connects/disconnects
  const refresh = () => setConnections(getConnectedPlatforms());

  const handleDisconnect = (id: PlatformId) => {
    queryClient.invalidateQueries({ queryKey: ['platform-stats', id] });
    refresh();
  };

  // Listen for changes (connect triggers re-render)
  useEffect(() => {
    refresh();
  }, []);

  const connectedCount = connections.length;
  const totalSolvedAcrossPlatforms = 0; // will be computed from query data in dashboard

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Link2 className="w-8 h-8 text-primary" />
            Connected Platforms
          </h1>
          <p className="text-muted-foreground mt-1.5">
            Link your coding profiles to aggregate stats across all platforms on your Dashboard.
          </p>
        </div>
        <div className={`px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 ${
          connectedCount > 0 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
            : 'bg-muted text-muted-foreground border border-border'
        }`}>
          <CheckCircle2 className="w-4 h-4" />
          {connectedCount} of {PLATFORM_IDS.length} platforms connected
        </div>
      </div>

      {/* ── How It Works Banner ── */}
      <div className="p-5 bg-card border border-primary/20 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-violet-500/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-base">Aggregate Your Progress</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Enter your username for each platform. We fetch your stats directly from their public APIs — no password required.
              Your dashboard will show a combined total across all linked platforms.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {PLATFORM_IDS.map(id => {
            const meta = PLATFORM_META[id];
            const isLinked = connections.some(c => c.id === id);
            return (
              <div key={id} className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium border transition-colors
                ${isLinked ? `${meta.bgColor} ${meta.color} ${meta.borderColor}` : 'bg-muted/40 text-muted-foreground border-border/50'}`}>
                <span className="text-base">{meta.logo}</span>
                <span>{meta.name}</span>
                {isLinked && <CheckCircle2 className="w-3 h-3 ml-auto" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Platform Cards ── */}
      <div>
        <h2 className="text-lg font-bold mb-4">Your Profiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLATFORM_IDS.map(id => (
            <PlatformCard
              key={id}
              id={id}
              connection={connections.find(c => c.id === id)}
              onDisconnect={handleDisconnect}
            />
          ))}
        </div>
      </div>

      {/* Info note */}
      <div className="p-4 bg-muted/40 border border-border rounded-xl text-xs text-muted-foreground flex items-start gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
        <div>
          <span className="font-semibold text-foreground">How it works: </span>
          All platform requests are routed through a local proxy so no browser CORS errors occur.
          LeetCode uses the <span className="text-yellow-400 font-medium">alfa-leetcode-api</span> community proxy.
          GFG, Codeforces, and HackerRank use the Vite dev-server proxy.
          Make sure the dev server (<span className="font-mono">npm run dev</span>) is running for all platforms to load.
        </div>
      </div>
    </div>
  );
};

export default ConnectedPlatformsPage;
