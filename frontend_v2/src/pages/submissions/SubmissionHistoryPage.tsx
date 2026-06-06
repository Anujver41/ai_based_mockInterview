import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserSubmissions, SubmissionResponse } from '../../api/submissionApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, XCircle, Clock, Zap, History,
  ChevronRight, Code2, Filter, AlertCircle
} from 'lucide-react';

const SubmissionHistoryPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [langFilter, setLangFilter] = useState<string>('ALL');

  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ['all-submissions', user?.id],
    queryFn: () => getUserSubmissions(user?.id!),
    enabled: !!user?.id,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASSED': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'FAILED': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'RUNNING': return <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case 'PENDING': return <Clock className="w-4 h-4 text-blue-400 animate-pulse" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const base = 'px-2.5 py-0.5 text-xs font-semibold rounded-full border';
    switch (status) {
      case 'PASSED': return `${base} text-green-400 bg-green-500/10 border-green-500/20`;
      case 'FAILED': return `${base} text-red-400 bg-red-500/10 border-red-500/20`;
      case 'RUNNING': return `${base} text-yellow-400 bg-yellow-500/10 border-yellow-500/20`;
      case 'PENDING': return `${base} text-blue-400 bg-blue-500/10 border-blue-500/20`;
      default: return `${base} text-gray-400 bg-gray-500/10 border-gray-500/20`;
    }
  };

  const formatTime = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

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

  // Build unique languages list from submissions
  const allLanguages = submissions
    ? Array.from(new Set(submissions.map(s => s.language)))
    : [];

  const filtered = (submissions || [])
    .filter(s => statusFilter === 'ALL' || s.status === statusFilter)
    .filter(s => langFilter === 'ALL' || s.language === langFilter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Stats
  const total = submissions?.length || 0;
  const passed = submissions?.filter(s => s.status === 'PASSED').length || 0;
  const failed = submissions?.filter(s => s.status === 'FAILED').length || 0;
  const pending = submissions?.filter(s => s.status === 'PENDING' || s.status === 'RUNNING').length || 0;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-12 p-6 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive">
        <AlertCircle className="w-6 h-6" />
        <p>Failed to load submissions. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <History className="w-8 h-8 text-primary" />
          Submission History
        </h1>
        <p className="text-muted-foreground mt-1">Track all your code submissions and results.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold mt-1">{total}</p>
        </div>
        <div className="bg-card border border-green-500/20 rounded-lg p-4">
          <p className="text-xs font-medium text-green-500 uppercase tracking-wider">Accepted</p>
          <p className="text-2xl font-bold mt-1 text-green-400">{passed}</p>
        </div>
        <div className="bg-card border border-red-500/20 rounded-lg p-4">
          <p className="text-xs font-medium text-red-500 uppercase tracking-wider">Failed</p>
          <p className="text-2xl font-bold mt-1 text-red-400">{failed}</p>
        </div>
        <div className="bg-card border border-blue-500/20 rounded-lg p-4">
          <p className="text-xs font-medium text-blue-500 uppercase tracking-wider">In Progress</p>
          <p className="text-2xl font-bold mt-1 text-blue-400">{pending}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-card p-4 rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            className="bg-background border border-input px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="PASSED">Accepted</option>
            <option value="FAILED">Failed</option>
            <option value="PENDING">Pending</option>
            <option value="RUNNING">Running</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-muted-foreground" />
          <select
            className="bg-background border border-input px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
          >
            <option value="ALL">All Languages</option>
            {allLanguages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
        <div className="ml-auto text-sm text-muted-foreground self-center">
          {filtered.length} submission{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Submissions List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-card rounded-lg border border-border animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-lg border border-border">
          <History className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No submissions found.</p>
          <Link to="/problems" className="text-primary text-sm hover:underline mt-2 inline-block">
            Browse Problems →
          </Link>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {filtered.map((sub, index) => (
            <Link
              key={sub.id}
              to={`/problems/${sub.problemId}`}
              className={`flex items-center gap-4 px-4 py-3.5 hover:bg-muted/30 transition-colors group
                ${index < filtered.length - 1 ? 'border-b border-border' : ''}`}
            >
              {/* Status Icon */}
              <div className="shrink-0">{getStatusIcon(sub.status)}</div>

              {/* Main Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={getStatusBadge(sub.status)}>
                    {sub.status === 'PASSED' ? 'Accepted' : sub.status}
                  </span>
                  <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
                    {sub.language}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Problem #{sub.problemId}
                  </span>
                </div>
                {sub.errorMessage && (
                  <p className="text-xs text-red-400 mt-1 truncate max-w-md">
                    {sub.errorMessage}
                  </p>
                )}
              </div>

              {/* Timestamp */}
              <div className="text-right shrink-0 hidden sm:block">
                <p className="text-xs text-muted-foreground">{getTimeAgo(sub.createdAt)}</p>
                <p className="text-xs text-muted-foreground/60">{formatTime(sub.createdAt)}</p>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmissionHistoryPage;
