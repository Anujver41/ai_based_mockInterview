import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { reviewCode, CodeReviewResponse } from '../../api/codeReviewApi';
import Editor from '@monaco-editor/react';
import {
  Sparkles, Send, ChevronDown, ChevronRight, FileCode,
  Clock, Cpu, Lightbulb, Shield, BarChart3, AlertCircle,
  Zap, Star, TrendingUp, CheckCircle2, Brain
} from 'lucide-react';

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'go', label: 'Go' },
  { id: 'rust', label: 'Rust' },
  { id: 'csharp', label: 'C#' },
];

const DEFAULT_CODE = `// Paste your code here for AI review
function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}`;

/* ── Animated dots for "thinking" ── */
const ThinkingDots = () => (
  <span className="inline-flex gap-0.5 ml-1">
    <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </span>
);

/* ── Expandable Section ── */
const ExpandableSection = ({
  icon, title, badge, children, defaultOpen = false, accentColor = 'primary'
}: {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  accentColor?: string;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-primary/30">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <span className={`text-${accentColor}`}>{icon}</span>
        <span className="font-semibold flex-1">{title}</span>
        {badge && (
          <span className="text-xs font-mono bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
            {badge}
          </span>
        )}
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-5 pb-5 pt-1 border-t border-border/50">
          {children}
        </div>
      </div>
    </div>
  );
};

/* ── Score Gauge ── */
const ScoreGauge = ({ score }: { score: string }) => {
  // Extract numeric value
  const numMatch = score.match(/(\d+)/);
  const numericScore = numMatch ? parseInt(numMatch[1]) : 0;
  const pct = Math.min(100, Math.max(0, numericScore));
  const color = pct >= 80 ? 'text-green-400' : pct >= 60 ? 'text-yellow-400' : 'text-red-400';
  const bgColor = pct >= 80 ? 'from-green-500/20 to-green-500/5' : pct >= 60 ? 'from-yellow-500/20 to-yellow-500/5' : 'from-red-500/20 to-red-500/5';
  const borderColor = pct >= 80 ? 'border-green-500/30' : pct >= 60 ? 'border-yellow-500/30' : 'border-red-500/30';
  const barColor = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className={`rounded-xl border ${borderColor} bg-gradient-to-b ${bgColor} p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Star className={`w-5 h-5 ${color}`} />
          <span className="font-semibold text-sm">Overall Score</span>
        </div>
        <span className={`text-3xl font-black ${color}`}>{numericScore}<span className="text-base font-normal text-muted-foreground">/100</span></span>
      </div>
      {/* Progress bar */}
      <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {score.includes('-') && (
        <p className="text-xs text-muted-foreground mt-2">{score.split('-').slice(1).join('-').trim()}</p>
      )}
    </div>
  );
};

/* ── AI Typing Animation for loading ── */
const AILoadingAnimation = () => (
  <div className="flex flex-col items-center justify-center py-16 space-y-6">
    {/* Pulsing brain icon */}
    <div className="relative">
      <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" style={{ transform: 'scale(1.5)' }} />
      <div className="relative w-20 h-20 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center border border-primary/20">
        <Brain className="w-10 h-10 text-primary animate-pulse" />
      </div>
      {/* Orbiting dots */}
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 bg-primary rounded-full" />
      </div>
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-1.5 h-1.5 bg-primary/60 rounded-full" />
      </div>
    </div>

    <div className="text-center space-y-2">
      <p className="text-lg font-semibold text-foreground flex items-center gap-1">
        AI is analyzing your code <ThinkingDots />
      </p>
      <p className="text-sm text-muted-foreground max-w-sm">
        Examining time complexity, code quality, and generating optimization suggestions.
      </p>
    </div>

    {/* Animated progress steps */}
    <div className="space-y-2 w-full max-w-xs">
      {['Parsing code structure', 'Analyzing complexity', 'Generating feedback'].map((step, i) => (
        <div
          key={step}
          className="flex items-center gap-2 text-xs animate-pulse"
          style={{ animationDelay: `${i * 600}ms` }}
        >
          <div className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
          <span className="text-muted-foreground">{step}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
const CodeReviewPage = () => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('reviewPrefLang') || 'javascript';
  });
  
  const [code, setCode] = useState(() => {
    const savedLang = localStorage.getItem('reviewPrefLang') || 'javascript';
    return localStorage.getItem(`reviewDraftCode-${savedLang}`) || DEFAULT_CODE;
  });
  
  const [problemDescription, setProblemDescription] = useState(() => {
    return localStorage.getItem('reviewProblemDesc') || '';
  });
  
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [review, setReview] = useState<CodeReviewResponse | null>(null);

  // Auto-save code and problem description
  React.useEffect(() => {
    if (code) localStorage.setItem(`reviewDraftCode-${language}`, code);
    localStorage.setItem('reviewProblemDesc', problemDescription);
  }, [code, language, problemDescription]);

  const handleLanguageSelect = (langId: string) => {
    setLanguage(langId);
    localStorage.setItem('reviewPrefLang', langId);
    const draft = localStorage.getItem(`reviewDraftCode-${langId}`);
    if (draft) {
      setCode(draft);
    } else {
      setCode(DEFAULT_CODE); // Or some language specific template if available
    }
    setShowLangDropdown(false);
  };

  const mutation = useMutation({
    mutationFn: reviewCode,
    onSuccess: (data) => setReview(data),
  });

  const handleReview = () => {
    if (!code.trim()) return;
    setReview(null);
    mutation.mutate({
      code,
      language,
      problemDescription: problemDescription || undefined,
    });
  };

  const selectedLang = LANGUAGES.find(l => l.id === language) || LANGUAGES[0];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] -mx-4 md:-mx-8">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-4 md:px-6 py-2.5 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base">AI Code Review</h1>
              <p className="text-[10px] text-muted-foreground leading-none">Powered by Gemini</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-muted/50 border border-border rounded-md hover:bg-muted transition-colors"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{selectedLang.label}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showLangDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLangDropdown(false)} />
                <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border rounded-lg shadow-xl z-50 py-1">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => handleLanguageSelect(lang.id)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2
                        ${lang.id === language ? 'bg-primary/10 text-primary font-medium' : ''}`}
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      {lang.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Review Button */}
          <button
            onClick={handleReview}
            disabled={mutation.isPending || !code.trim()}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-md hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50 font-medium shadow-sm shadow-violet-600/20"
          >
            {mutation.isPending ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="hidden sm:inline">Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Review Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">

        {/* ── Left: Code Editor ── */}
        <div className="w-full md:w-1/2 flex flex-col min-h-0 bg-[#1e1e1e]">
          {/* Problem Description Input */}
          <div className="px-4 py-2 border-b border-[#2d2d2d] bg-[#252526]">
            <input
              type="text"
              placeholder="(Optional) Describe the problem being solved..."
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              className="w-full bg-transparent text-xs text-gray-400 placeholder:text-gray-600 outline-none"
            />
          </div>

          {/* Editor tab */}
          <div className="flex items-center px-4 py-1.5 border-b border-[#2d2d2d] bg-[#252526] text-xs text-gray-400 shrink-0">
            <FileCode className="w-3 h-3 mr-1.5" />
            <span>code.{selectedLang.id === 'cpp' ? 'cpp' : selectedLang.id === 'csharp' ? 'cs' : selectedLang.id}</span>
          </div>

          {/* Editor */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineHeight: 22,
                padding: { top: 12 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                formatOnPaste: true,
                tabSize: 2,
                wordWrap: 'on',
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* ── Right: AI Review Results ── */}
        <div className="w-full md:w-1/2 overflow-y-auto bg-background border-l border-border">

          {/* Empty State */}
          {!mutation.isPending && !review && !mutation.isError && (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center space-y-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-violet-500/40" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">AI Code Review</h2>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Paste your code on the left and click <strong>"Review Code"</strong> to get AI-powered feedback on complexity, quality, and optimization opportunities.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full max-w-sm text-left">
                {[
                  { icon: <Clock className="w-4 h-4" />, label: 'Time Complexity' },
                  { icon: <Cpu className="w-4 h-4" />, label: 'Space Complexity' },
                  { icon: <Shield className="w-4 h-4" />, label: 'Quality Analysis' },
                  { icon: <Lightbulb className="w-4 h-4" />, label: 'Optimizations' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground p-2.5 bg-muted/30 rounded-lg border border-border">
                    <span className="text-violet-400">{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {mutation.isPending && <AILoadingAnimation />}

          {/* Error State */}
          {mutation.isError && !review && (
            <div className="p-6">
              <div className="p-5 bg-destructive/5 border border-destructive/20 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive">Analysis Failed</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(mutation.error as any)?.response?.data?.message || 'Unable to analyze code. The AI service might be temporarily unavailable. Please try again.'}
                  </p>
                  <button
                    onClick={handleReview}
                    className="mt-3 text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5" /> Retry Analysis
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {review && (
            <div className="p-4 md:p-5 space-y-4">
              {/* AI Header */}
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="font-semibold text-sm">Gemini AI Review</span>
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {selectedLang.label}
                </span>
              </div>

              {/* Score */}
              <ScoreGauge score={review.overallScore} />

              {/* Complexity Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">Time</span>
                  </div>
                  <p className="text-lg font-mono font-bold text-blue-300">{review.timeComplexity}</p>
                </div>
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">Space</span>
                  </div>
                  <p className="text-lg font-mono font-bold text-purple-300">{review.spaceComplexity}</p>
                </div>
              </div>

              {/* Quality Feedback */}
              <ExpandableSection
                icon={<Shield className="w-5 h-5" />}
                title="Code Quality Feedback"
                badge={`${review.qualityFeedback.length} items`}
                defaultOpen={true}
                accentColor="emerald-400"
              >
                <ul className="space-y-3 mt-2">
                  {review.qualityFeedback.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <div className="mt-1 shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                        {item}
                      </p>
                    </li>
                  ))}
                </ul>
              </ExpandableSection>

              {/* Optimization Suggestions */}
              <ExpandableSection
                icon={<TrendingUp className="w-5 h-5" />}
                title="Optimization Suggestions"
                badge={`${review.optimizationSuggestions.length} ideas`}
                defaultOpen={true}
                accentColor="amber-400"
              >
                <ul className="space-y-3 mt-2">
                  {review.optimizationSuggestions.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <div className="mt-1 shrink-0 w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <Lightbulb className="w-3 h-3 text-amber-400" />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                        {item}
                      </p>
                    </li>
                  ))}
                </ul>
              </ExpandableSection>

              {/* Footer */}
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground/60">
                  AI-generated analysis • Results may not be 100% accurate
                </p>
                <button
                  onClick={handleReview}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <Zap className="w-3 h-3" /> Re-analyze
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeReviewPage;
