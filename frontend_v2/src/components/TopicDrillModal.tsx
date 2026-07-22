import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ExternalLink, ChevronRight, CheckCircle2, Target, Zap, 
  RotateCcw, Trophy, BookOpen, ArrowRight, Sparkles
} from 'lucide-react';
import { getTopicProblems, type TopicProblem } from '../data/topicProblems';

interface TopicDrillModalProps {
  topic: {
    name: string;
    mastery: number;
    solvedCount: number;
  };
  onClose: () => void;
}

const DIFFICULTY_CONFIG = {
  Easy:   { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  Medium: { color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20'   },
  Hard:   { color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/20'     },
};

const PLATFORM_CONFIG = {
  LeetCode: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', emoji: '🟠' },
  GFG:      { color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  emoji: '🟢' },
};

const MASTERY_MILESTONES = [20, 40, 60, 80, 100];

const getMasteryLabel = (mastery: number) => {
  if (mastery < 20) return { label: 'Beginner', color: 'text-red-400' };
  if (mastery < 40) return { label: 'Developing', color: 'text-amber-400' };
  if (mastery < 60) return { label: 'Intermediate', color: 'text-yellow-400' };
  if (mastery < 80) return { label: 'Proficient', color: 'text-blue-400' };
  return { label: 'Expert', color: 'text-emerald-400' };
};

export const TopicDrillModal = ({ topic, onClose }: TopicDrillModalProps) => {
  const [problems, setProblems] = useState<TopicProblem[]>([]);
  const [allProblems, setAllProblems] = useState<TopicProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempted, setAttempted] = useState<Set<string>>(new Set());
  const [sessionDone, setSessionDone] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

  const loadProblems = useCallback((difficulty: typeof filterDifficulty) => {
    let all = getTopicProblems(topic.name);
    setAllProblems(all); // store unfiltered for fallback check
    if (difficulty !== 'All') {
      const filtered = all.filter(p => p.difficulty === difficulty);
      // if filter yields nothing, fall back to all difficulties
      all = filtered.length > 0 ? filtered : all;
    }
    setProblems(all);
    setCurrentIndex(0);
    setAttempted(new Set());
    setSessionDone(false);
  }, [topic.name]);

  useEffect(() => {
    loadProblems(filterDifficulty);
  }, [loadProblems, filterDifficulty]);

  const currentProblem = problems[currentIndex];
  const total = problems.length;
  const hasNoProblems = allProblems.length === 0; // topic not in our dataset
  const attemptedCount = attempted.size;
  const sessionProgress = total > 0 ? Math.round((attemptedCount / Math.min(total, 10)) * 100) : 0;

  const markDoneAndNext = () => {
    if (!currentProblem) return;
    const newAttempted = new Set(attempted).add(currentProblem.id);
    setAttempted(newAttempted);

    // After 10 questions or all done → session complete
    if (newAttempted.size >= Math.min(total, 10) || currentIndex >= total - 1) {
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        setSessionDone(true);
      }, 1800);
      return;
    }

    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsFlipping(false);
    }, 300);
  };

  const skipToNext = () => {
    if (currentIndex >= total - 1) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsFlipping(false);
    }, 300);
  };

  const restartSession = () => {
    loadProblems(filterDifficulty);
    setShowCelebration(false);
  };

  const masteryInfo = getMasteryLabel(topic.mastery);

  // Escape key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          className="relative z-10 w-full max-w-lg"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        >
          <div className="bg-[#0f0f13] border border-border rounded-3xl shadow-2xl overflow-hidden">

            {/* ── Header ── */}
            <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-violet-500/10 via-transparent to-blue-500/10 border-b border-border">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-violet-500/20 border border-violet-500/30">
                  <Target className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-400 mb-0.5">Practice Drill</p>
                  <h2 className="text-xl font-bold text-foreground leading-tight">{topic.name}</h2>
                </div>
              </div>

              {/* Mastery + progress row */}
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${masteryInfo.color}`}>{masteryInfo.label}</span>
                  <span className="text-muted-foreground text-xs">·</span>
                  <span className="text-xs text-muted-foreground">{topic.mastery}% mastery</span>
                </div>
                <span className="text-xs text-muted-foreground">{topic.solvedCount} solved</span>
              </div>

              {/* Mastery bar */}
              <div className="w-full h-1.5 bg-muted/40 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.mastery}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>

              {/* Milestone ticks */}
              <div className="flex justify-between mt-1 px-0.5">
                {MASTERY_MILESTONES.map(m => (
                  <span key={m} className={`text-[9px] font-mono ${topic.mastery >= m ? 'text-violet-400' : 'text-muted-foreground/30'}`}>
                    {m}%
                  </span>
                ))}
              </div>
            </div>

            {/* ── Difficulty Filter ── */}
            <div className="flex gap-2 px-6 pt-4">
              {(['All', 'Easy', 'Medium', 'Hard'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setFilterDifficulty(d)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    filterDifficulty === d
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                      : 'bg-muted/30 text-muted-foreground hover:text-foreground border border-transparent'
                  }`}
                >
                  {d}
                </button>
              ))}
              <span className="ml-auto text-xs text-muted-foreground self-center">{total} questions</span>
            </div>

            {/* ── Body ── */}
            <div className="p-6">

              {/* Celebration overlay */}
              <AnimatePresence>
                {showCelebration && (
                  <motion.div
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0f0f13]/95 rounded-3xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                    >
                      <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-3" />
                    </motion.div>
                    <p className="text-xl font-bold text-foreground">Session Complete!</p>
                    <p className="text-muted-foreground text-sm mt-1">You attempted {attemptedCount} questions 🎉</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Session Done state */}
              {sessionDone && !showCelebration ? (
                <motion.div
                  className="text-center py-8 space-y-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Great Work!</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        You practiced <span className="text-foreground font-semibold">{attemptedCount} {topic.name}</span> problems.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Keep solving to push your mastery above 20% and unlock proficiency!
                      </p>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="p-3 rounded-xl bg-muted/30 border border-border text-center">
                      <p className="text-2xl font-bold text-foreground">{attemptedCount}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Questions Attempted</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/30 border border-border text-center">
                      <p className={`text-2xl font-bold ${masteryInfo.color}`}>{topic.mastery}%</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Current Mastery</p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={restartSession}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-muted/40 border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" /> Practice Again
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500/20 border border-violet-500/30 text-sm font-medium text-violet-300 hover:bg-violet-500/30 transition-colors"
                    >
                      Done <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ) : !sessionDone && (
                <>
                  {/* Session progress */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Session Progress</span>
                      <span className="text-xs font-semibold text-foreground">{attemptedCount} / {Math.min(total, 10)}</span>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(total, 10) }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            i < attemptedCount ? 'bg-emerald-500' : i === currentIndex ? 'bg-violet-400' : 'bg-muted/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Session progress bar */}
                  <div className="w-full h-1 bg-muted/30 rounded-full overflow-hidden mb-5">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      animate={{ width: `${sessionProgress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>

                  {/* Problem Card */}
                  {currentProblem ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentProblem.id}
                        initial={{ opacity: 0, x: isFlipping ? 40 : 0, rotateY: isFlipping ? 10 : 0 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.25 }}
                        className="relative rounded-2xl border border-border bg-muted/20 overflow-hidden"
                      >
                        {/* Glow effect on card top */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

                        <div className="p-5">
                          {/* Badges */}
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            {/* Platform badge */}
                            {(() => {
                              const pc = PLATFORM_CONFIG[currentProblem.platform];
                              return (
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${pc.bg} ${pc.border} ${pc.color}`}>
                                  {pc.emoji} {currentProblem.platform}
                                </span>
                              );
                            })()}

                            {/* Difficulty badge */}
                            {(() => {
                              const dc = DIFFICULTY_CONFIG[currentProblem.difficulty];
                              return (
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${dc.bg} ${dc.border} ${dc.color}`}>
                                  {currentProblem.difficulty}
                                </span>
                              );
                            })()}

                            <span className="ml-auto text-[10px] text-muted-foreground">
                              #{currentIndex + 1} of {total}
                            </span>
                          </div>

                          {/* Problem Title */}
                          <h3 className="text-base font-bold text-foreground leading-snug mb-4">
                            {currentProblem.title}
                          </h3>

                          {/* CTA Buttons */}
                          <div className="flex flex-col gap-2.5">
                            {/* PRIMARY: Open on platform */}
                            <a
                              href={currentProblem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2.5 w-full px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-900/30 group"
                            >
                              <BookOpen className="w-4 h-4" />
                              Solve on {currentProblem.platform}
                              <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                            </a>

                            {/* SECONDARY row: Mark Done + Skip */}
                            <div className="flex gap-2">
                              <button
                                onClick={markDoneAndNext}
                                disabled={attempted.has(currentProblem.id)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-sm font-medium hover:bg-emerald-500/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                {attempted.has(currentProblem.id) ? 'Marked' : 'Mark Done & Next'}
                              </button>
                              <button
                                onClick={skipToNext}
                                disabled={currentIndex >= total - 1}
                                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-muted/40 border border-border text-muted-foreground text-sm hover:text-foreground transition-colors disabled:opacity-30"
                              >
                                Skip
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  ) : hasNoProblems ? (
                    /* Topic not in dataset — show platform search links */
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-border bg-muted/20 overflow-hidden"
                    >
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm font-semibold text-foreground">Find {topic.name} Problems</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Search on Platform</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">
                          This topic isn't in our local dataset yet. Solve problems directly on LeetCode or GFG:
                        </p>
                        <div className="flex flex-col gap-2.5">
                          <a
                            href={`https://leetcode.com/tag/${topic.name.toLowerCase().replace(/[\s&]+/g, '-').replace(/[()]/g, '')}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2.5 w-full px-4 py-3 rounded-xl bg-orange-500/15 border border-orange-500/25 text-orange-300 font-semibold text-sm hover:bg-orange-500/25 transition-all group"
                          >
                            🟠 Search on LeetCode
                            <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                          </a>
                          <a
                            href={`https://www.geeksforgeeks.org/explore?category=${encodeURIComponent(topic.name)}&sortBy=submissions`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2.5 w-full px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-300 font-semibold text-sm hover:bg-green-500/20 transition-all group"
                          >
                            🟢 Search on GFG
                            <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                          </a>
                          <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(topic.name + ' DSA problems LeetCode site:leetcode.com')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2.5 w-full px-4 py-3 rounded-xl bg-muted/30 border border-border text-muted-foreground text-sm hover:text-foreground hover:bg-muted/50 transition-all group"
                          >
                            🔍 Search on Google
                            <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No problems for this difficulty.</p>
                      <button onClick={() => setFilterDifficulty('All')} className="text-xs text-primary mt-2 hover:underline">
                        Show all difficulties
                      </button>
                    </div>
                  )}

                  {/* Tip */}
                  <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/15">
                    <Zap className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      <span className="text-foreground font-medium">Tip:</span> Open the problem, attempt it on the platform, then come back and click <em>"Mark Done & Next"</em> to track progress.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* ── Footer ── */}
            {!sessionDone && (
              <div className="px-6 pb-5 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Target: reach <span className="text-violet-400 font-semibold">20%</span> mastery to unlock the next topic
                </span>
                <div className="flex gap-1 items-center">
                  <ChevronRight className="w-3 h-3 text-muted-foreground/40" />
                  <span className="text-[10px] text-muted-foreground/40 font-mono">ESC to close</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TopicDrillModal;
