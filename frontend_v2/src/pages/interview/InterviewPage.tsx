import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getUserSessions, startInterview, InterviewSessionResponse } from '../../api/interviewApi';
import {
  Brain, Plus, Clock, CheckCircle2, XCircle,
  ChevronRight, Zap, ArrowRight, Loader2,
  MessageSquare, Target, BarChart3
} from 'lucide-react';

const TOPICS = [
  { id: 'Arrays & Hashing', icon: '🧩', desc: 'Two pointers, sliding window, hash maps' },
  { id: 'Trees & Graphs', icon: '🌳', desc: 'BFS, DFS, binary trees, shortest paths' },
  { id: 'Dynamic Programming', icon: '📊', desc: 'Memoization, tabulation, optimization' },
  { id: 'Linked Lists', icon: '🔗', desc: 'Reversal, cycle detection, merging' },
  { id: 'Sorting & Searching', icon: '🔍', desc: 'Binary search, merge sort, quick sort' },
  { id: 'System Design', icon: '🏗️', desc: 'Scalability, databases, distributed systems' },
];

const DIFFICULTIES = [
  { id: 'EASY', label: 'Easy', color: 'text-green-400 border-green-500/30 bg-green-500/10', desc: 'Warm-up level' },
  { id: 'MEDIUM', label: 'Medium', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10', desc: 'Interview standard' },
  { id: 'HARD', label: 'Hard', color: 'text-red-400 border-red-500/30 bg-red-500/10', desc: 'Expert challenge' },
];

const InterviewPage = () => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showStartForm, setShowStartForm] = useState(false);

  const { data: sessions, isLoading: loadingSessions } = useQuery({
    queryKey: ['interview-sessions'],
    queryFn: getUserSessions,
  });

  const startMutation = useMutation({
    mutationFn: startInterview,
    onSuccess: (session) => {
      navigate(`/interview/${session.id}`);
    },
  });

  const handleStart = () => {
    if (!selectedTopic || !selectedDifficulty) return;
    startMutation.mutate({ topic: selectedTopic, difficulty: selectedDifficulty });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'STARTED': return <Zap className="w-3.5 h-3.5 text-green-400" />;
      case 'COMPLETED': return <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />;
      case 'ABORTED': return <XCircle className="w-3.5 h-3.5 text-red-400" />;
      default: return <Clock className="w-3.5 h-3.5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const base = 'px-2 py-0.5 text-[10px] font-semibold rounded-full border uppercase tracking-wider';
    switch (status) {
      case 'STARTED': return `${base} text-green-400 bg-green-500/10 border-green-500/20`;
      case 'COMPLETED': return `${base} text-blue-400 bg-blue-500/10 border-blue-500/20`;
      case 'ABORTED': return `${base} text-red-400 bg-red-500/10 border-red-500/20`;
      default: return `${base} text-gray-400 bg-gray-500/10 border-gray-500/20`;
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = Date.now();
    const diff = now - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const activeSessions = sessions?.filter(s => s.status === 'STARTED') || [];
  const pastSessions = sessions?.filter(s => s.status !== 'STARTED') || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Hero */}
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-xs font-medium border border-violet-500/20">
          <Brain className="w-3.5 h-3.5" /> AI-Powered Interview Simulator
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Mock <span className="bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">Interview</span>
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Practice DSA interviews with an AI interviewer. Get real-time follow-up questions, hints, and feedback — just like a real tech interview.
        </p>
      </div>

      {/* Start New Interview */}
      {!showStartForm ? (
        <div className="flex justify-center">
          <button
            onClick={() => setShowStartForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all font-semibold shadow-lg shadow-violet-600/20 text-sm"
          >
            <Plus className="w-4 h-4" /> Start New Interview
          </button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Configure Your Interview</h2>
            <button onClick={() => setShowStartForm(false)} className="text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          </div>

          {/* Topic Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-violet-400" /> Select Topic
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TOPICS.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.02]
                    ${selectedTopic === topic.id
                      ? 'border-violet-500 bg-violet-500/10 shadow-md shadow-violet-500/10'
                      : 'border-border bg-muted/20 hover:border-muted-foreground/30'}`}
                >
                  <div className="text-2xl mb-2">{topic.icon}</div>
                  <p className="font-semibold text-sm">{topic.id}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{topic.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-400" /> Select Difficulty
            </label>
            <div className="flex gap-3">
              {DIFFICULTIES.map(diff => (
                <button
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`flex-1 p-4 rounded-xl border text-center transition-all hover:scale-[1.02]
                    ${selectedDifficulty === diff.id
                      ? `${diff.color} shadow-md`
                      : 'border-border bg-muted/20 hover:border-muted-foreground/30'}`}
                >
                  <p className="font-bold text-sm">{diff.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{diff.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={!selectedTopic || !selectedDifficulty || startMutation.isPending}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50 shadow-lg shadow-violet-600/20"
          >
            {startMutation.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Starting Interview...</>
            ) : (
              <><ArrowRight className="w-4 h-4" /> Begin Interview</>
            )}
          </button>

          {startMutation.isError && (
            <p className="text-sm text-destructive text-center">
              Failed to start interview. Please try again.
            </p>
          )}
        </div>
      )}

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-400" /> Active Sessions
          </h2>
          <div className="grid gap-3">
            {activeSessions.map(session => (
              <button
                key={session.id}
                onClick={() => navigate(`/interview/${session.id}`)}
                className="flex items-center gap-4 p-4 bg-card border border-green-500/20 rounded-xl hover:bg-muted/30 transition-all group text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{session.topic}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={getStatusBadge(session.status)}>{session.status}</span>
                    <span className="text-xs text-muted-foreground">{session.difficulty}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground">{formatTime(session.createdAt)}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Past Sessions */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" /> Interview History
        </h2>

        {loadingSessions ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-card rounded-xl border border-border animate-pulse" />
            ))}
          </div>
        ) : pastSessions.length === 0 && activeSessions.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <Brain className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground">No interviews yet. Start your first one above!</p>
          </div>
        ) : pastSessions.length === 0 ? (
          <div className="text-center py-8 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground text-sm">No completed interviews yet.</p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {pastSessions
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((session, index) => (
                <button
                  key={session.id}
                  onClick={() => navigate(`/interview/${session.id}`)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 hover:bg-muted/30 transition-colors group text-left
                    ${index < pastSessions.length - 1 ? 'border-b border-border' : ''}`}
                >
                  {getStatusIcon(session.status)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{session.topic}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={getStatusBadge(session.status)}>{session.status}</span>
                      <span className="text-xs text-muted-foreground">{session.difficulty}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{formatTime(session.createdAt)}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary transition-colors" />
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPage;
