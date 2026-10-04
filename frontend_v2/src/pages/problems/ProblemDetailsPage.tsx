import React, { useState, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProblemById } from '../../api/problemApi';
import { submitCode, evaluateClientSide, SubmissionResponse, TestCaseResult, getUserSubmissions } from '../../api/submissionApi';
import { useSubmissionPolling } from '../../hooks/useSubmissionPolling';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import Editor from '@monaco-editor/react';
import {
  ChevronLeft, Play, Send, AlertCircle, Loader2,
  CheckCircle2, XCircle, Clock, Zap, History,
  ChevronDown, Terminal, FileCode
} from 'lucide-react';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', ext: 'js', template: '// Write your solution here\n\nfunction solve(input) {\n  // Your code here\n  \n  return result;\n}\n' },
  { id: 'python', label: 'Python', ext: 'py', template: '# Write your solution here\n\ndef solve(input):\n    # Your code here\n    pass\n' },
  { id: 'java', label: 'Java', ext: 'java', template: 'import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}\n' },
  { id: 'cpp', label: 'C++', ext: 'cpp', template: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Your code here\n    \n    return 0;\n}\n' },
  { id: 'typescript', label: 'TypeScript', ext: 'ts', template: '// Write your solution here\n\nfunction solve(input: string): string {\n  // Your code here\n  \n  return "";\n}\n' },
  { id: 'go', label: 'Go', ext: 'go', template: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Your code here\n    fmt.Println()\n}\n' },
];

type BottomTab = 'testcases' | 'result' | 'history';

const ProblemDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [language, setLanguage] = useState(() => {
    const savedLangId = localStorage.getItem(`prefLang-${id}`) || localStorage.getItem('globalPrefLang');
    return LANGUAGES.find(l => l.id === savedLangId) || LANGUAGES[0];
  });
  
  const [code, setCode] = useState(() => {
    const savedLangId = localStorage.getItem(`prefLang-${id}`) || localStorage.getItem('globalPrefLang') || LANGUAGES[0].id;
    return localStorage.getItem(`draftCode-${id}-${savedLangId}`) || LANGUAGES.find(l => l.id === savedLangId)?.template || LANGUAGES[0].template;
  });

  const [bottomTab, setBottomTab] = useState<BottomTab>('testcases');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState<SubmissionResponse | null>(null);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [selectedResultCase, setSelectedResultCase] = useState(0);
  // Pending submit request stored while waiting for polling result
  const pendingSubmitRef = React.useRef<{ code: string; language: string; isRun: boolean } | null>(null);

  // Local submission history (fallback when backend not available)
  const [localHistory, setLocalHistory] = useState<SubmissionResponse[]>(() => {
    try {
      const problemKey = `localHistory-${id}`;
      const perProblem: SubmissionResponse[] = JSON.parse(localStorage.getItem(problemKey) || '[]');
      const allGlobal: SubmissionResponse[] = JSON.parse(localStorage.getItem('all_submissions') || '[]');
      const globalForProblem = allGlobal.filter(s =>
        (String(s.problemId) === id || s.problemId === `p-${id}` || `p-${s.problemId}` === id) && !s.isRun
      );
      const combined = [...perProblem, ...globalForProblem].filter(s => !s.isRun);
      const seen = new Set();
      return combined.filter(s => {
        if (seen.has(String(s.id))) return false;
        seen.add(String(s.id));
        return true;
      });
    } catch { return []; }
  });

  const saveToLocalHistory = useCallback((result: SubmissionResponse) => {
    // Only real SUBMISSIONS (not runs) belong in history
    if (result.isRun) return;

    setLocalHistory(prev => {
      const filtered = prev.filter(s => String(s.id) !== String(result.id) && !s.isRun);
      const updated = [result, ...filtered].slice(0, 50);
      try { localStorage.setItem(`localHistory-${id}`, JSON.stringify(updated)); } catch {}
      return updated;
    });

    try {
      const all: SubmissionResponse[] = JSON.parse(localStorage.getItem('all_submissions') || '[]');
      const filteredAll = all.filter(s => String(s.id) !== String(result.id) && !s.isRun);
      const updatedAll = [result, ...filteredAll].slice(0, 100);
      localStorage.setItem('all_submissions', JSON.stringify(updatedAll));
    } catch {}
  }, [id]);

  // Save code draft to local storage when code changes
  useEffect(() => {
    if (id && code) {
      localStorage.setItem(`draftCode-${id}-${language.id}`, code);
    }
  }, [code, id, language.id]);

  const { data: problem, isLoading, error } = useQuery({
    queryKey: ['problem', id],
    queryFn: () => getProblemById(id!),
    enabled: !!id,
  });

  const { data: submissionHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['submissions', user?.id],
    queryFn: () => getUserSubmissions(user?.id!),
    enabled: !!user?.id,
  });

  // Calculate merged submissions for this problem (excluding runs)
  const problemSubmissions = React.useMemo(() => {
    const backendSubs: SubmissionResponse[] = (submissionHistory || [])
      .filter((s: SubmissionResponse) => (String(s.problemId) === id || s.problemId === `p-${id}` || `p-${s.problemId}` === id) && !s.isRun);
    const allIds = new Set(backendSubs.map(s => String(s.id)));
    const localSubs = localHistory.filter(s => !allIds.has(String(s.id)) && !s.isRun);
    return [...backendSubs, ...localSubs]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [submissionHistory, localHistory, id]);

  const handlePollingComplete = useCallback((result: SubmissionResponse) => {
    setLastResult(result);
    setIsSubmitting(false);
    setSelectedResultCase(0);
    saveToLocalHistory(result);
    refetchHistory();

    if (!result.isRun) {
      toast.success(result.status === 'PASSED' ? 'Submission Accepted! Saved to History.' : 'Submission Recorded in History');
      // If user is already on history, keep them on history so they see it appear; otherwise switch to result
      setBottomTab(prev => (prev === 'history' ? 'history' : 'result'));
    } else {
      setBottomTab('result');
    }
  }, [refetchHistory, saveToLocalHistory]);

  // Called when backend polling fails → run client-side evaluation immediately
  const handlePollingFallback = useCallback(() => {
    const pending = pendingSubmitRef.current;
    if (!pending || !id) return;
    const effectiveUserId = user?.id || 'guest_user';
    const evalResult = evaluateClientSide(pending.code, pending.language, id);
    const startMs = performance.now();
    const result: SubmissionResponse = {
      id: Date.now(),
      userId: effectiveUserId,
      problemId: id,
      code: pending.code,
      language: pending.language,
      status: evalResult.status,
      errorMessage: evalResult.errorMessage,
      testResults: evalResult.testResults,
      runtimeMs: Math.round(performance.now() - startMs),
      isRun: pending.isRun,
      createdAt: new Date().toISOString(),
    };
    handlePollingComplete(result);
  }, [id, user?.id, handlePollingComplete]);

  const { submission: pollingSubmission, isPolling, error: pollingError, startPolling } = useSubmissionPolling({
    onComplete: handlePollingComplete,
    onFallback: handlePollingFallback,
  });

  const handleLanguageChange = (lang: typeof LANGUAGES[number]) => {
    setLanguage(lang);
    localStorage.setItem(`prefLang-${id}`, lang.id);
    localStorage.setItem('globalPrefLang', lang.id);
    const draft = localStorage.getItem(`draftCode-${id}-${lang.id}`);
    setCode(draft || lang.template);
    setShowLangDropdown(false);
  };

  const handleSubmit = async (isRun: boolean = false) => {
    if (!id) return;
    setIsSubmitting(true);
    setLastResult(null);

    // If Run or currently on testcases, switch to result tab to see execution progress
    if (isRun || bottomTab === 'testcases') {
      setBottomTab('result');
    }

    const effectiveUserId = user?.id || 'guest_user';

    // Store pending request for fallback evaluation if backend is unreachable
    pendingSubmitRef.current = { code, language: language.id, isRun };

    try {
      const response = await submitCode({
        userId: effectiveUserId,
        problemId: id,
        code,
        language: language.id,
        isRun
      });

      if (response.status === 'PENDING' || response.status === 'RUNNING') {
        startPolling(response.id);
      } else {
        // Instant response from backend or client fallback - brief transition for smooth UX
        setTimeout(() => {
          handlePollingComplete(response);
        }, 400);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      const failResult: SubmissionResponse = {
        id: Date.now(),
        userId: effectiveUserId,
        problemId: id,
        code,
        language: language.id,
        status: 'FAILED',
        errorMessage: err?.response?.data?.message || err?.message || 'Execution failed. Please try again.',
        isRun,
        createdAt: new Date().toISOString(),
      };
      setLastResult(failResult);
      if (!isRun) {
        saveToLocalHistory(failResult);
        refetchHistory();
        toast.error('Submission failed. Recorded in history.');
      }
    }
  };

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
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // --- Error state ---
  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-12 p-6 bg-destructive/10 border border-destructive/20 rounded-lg flex flex-col items-center gap-4 text-center">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <div>
          <h2 className="text-xl font-bold text-destructive">Failed to load problem</h2>
          <p className="text-muted-foreground mt-2">The problem might not exist or you don't have permission to view it.</p>
        </div>
        <Link to="/problems" className="mt-4 px-4 py-2 bg-background border border-input rounded-md hover:bg-muted transition-colors">
          Back to Problems
        </Link>
      </div>
    );
  }

  // --- Loading state ---
  if (isLoading || !problem) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] w-full overflow-hidden">
        {/* Skeleton header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-4">
            <div className="w-5 h-5 bg-muted rounded animate-pulse" />
            <div className="w-48 h-5 bg-muted rounded animate-pulse" />
            <div className="w-16 h-5 bg-muted rounded-full animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-20 h-8 bg-muted rounded animate-pulse" />
            <div className="w-20 h-8 bg-muted rounded animate-pulse" />
          </div>
        </div>
        {/* Skeleton body */}
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/2 p-6 space-y-4 border-r border-border">
            <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
            <div className="h-24 w-full bg-muted rounded animate-pulse mt-6" />
            <div className="h-24 w-full bg-muted rounded animate-pulse" />
          </div>
          <div className="w-1/2 bg-[#1e1e1e] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        </div>
      </div>
    );
  }

  // Current status to display
  const activeSubmission = pollingSubmission || lastResult;
  const isProcessing = isSubmitting || isPolling;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full overflow-hidden">
      {/* ====== TOP BAR ====== */}
      <div className="flex items-center justify-between px-4 md:px-6 py-2.5 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/problems" className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold text-base md:text-lg truncate max-w-[200px] md:max-w-none">{problem.title}</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0
            ${problem.difficulty === 'EASY' ? 'text-green-500 border-green-500/20 bg-green-500/10' :
              problem.difficulty === 'MEDIUM' ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10' :
              'text-red-500 border-red-500/20 bg-red-500/10'}`}>
            {problem.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-muted/50 border border-border rounded-md hover:bg-muted transition-colors"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language.label}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showLangDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLangDropdown(false)} />
                <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => handleLanguageChange(lang)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2
                        ${lang.id === language.id ? 'bg-primary/10 text-primary font-medium' : ''}`}
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      {lang.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Run Button */}
          <button
            disabled={isProcessing}
            onClick={() => handleSubmit(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors disabled:opacity-50 font-medium"
          >
            {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Run</span>
          </button>

          {/* Submit Button */}
          <button
            disabled={isProcessing}
            onClick={() => handleSubmit(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-all disabled:opacity-50 font-medium shadow-sm shadow-green-600/20"
          >
            {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isProcessing ? 'Judging...' : 'Submit'}</span>
          </button>
        </div>
      </div>

      {/* ====== MAIN SPLIT VIEW ====== */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">

        {/* ====== LEFT: Problem Description ====== */}
        <div className="w-full md:w-[42%] lg:w-5/12 overflow-y-auto border-r border-border bg-card">
          {/* Tabs */}
          <div className="flex border-b border-border sticky top-0 bg-card z-10">
            <button className="px-4 py-2.5 text-sm font-medium border-b-2 border-primary text-primary">
              Description
            </button>
          </div>

          <div className="p-5 md:p-6 space-y-6">
            <h2 className="text-xl md:text-2xl font-bold">{problem.title}</h2>

            <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {problem.description}
            </div>

            {/* Constraints */}
            {problem.constraints && problem.constraints.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2 text-foreground">Constraints:</h3>
                <ul className="list-none space-y-1 bg-muted/30 p-3 rounded-lg border border-border">
                  {problem.constraints.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-mono text-muted-foreground">
                      <span className="text-primary/60 select-none mt-0.5">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Examples */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Examples:</h3>
              {problem.testCases?.filter(tc => !tc.isHidden).map((tc, index) => (
                <div key={index} className="rounded-lg border border-border overflow-hidden">
                  <div className="px-3 py-1.5 bg-muted/40 text-xs font-medium text-muted-foreground border-b border-border">
                    Example {index + 1}
                  </div>
                  <div className="p-3 space-y-2 font-mono text-sm bg-muted/10">
                    <div className="flex">
                      <span className="text-muted-foreground select-none w-16 shrink-0">Input:</span>
                      <span className="text-foreground">{tc.input}</span>
                    </div>
                    <div className="flex">
                      <span className="text-muted-foreground select-none w-16 shrink-0">Output:</span>
                      <span className="text-foreground">{tc.expectedOutput}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tags */}
            {problem.tags && problem.tags.length > 0 && (
              <div className="pt-4 border-t border-border flex flex-wrap gap-1.5">
                {problem.tags.map(tag => (
                  <span key={tag} className="text-xs bg-secondary/50 text-secondary-foreground px-2.5 py-1 rounded-full border border-border">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ====== RIGHT: Editor + Bottom Panel ====== */}
        <div className="w-full md:w-[58%] lg:w-7/12 flex flex-col min-h-0 bg-[#1e1e1e]">

          {/* Editor tab bar */}
          <div className="flex items-center justify-between px-4 py-1.5 border-b border-[#2d2d2d] bg-[#252526] text-xs shrink-0">
            <div className="flex items-center gap-2 text-gray-400">
              <FileCode className="w-3.5 h-3.5" />
              <span>solution.{language.ext}</span>
            </div>
            {isProcessing && (
              <div className="flex items-center gap-1.5 text-yellow-400">
                <div className="flex gap-0.5">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>Processing</span>
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <Editor
              height="100%"
              language={language.id}
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
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
              }}
            />
          </div>

          {/* ====== BOTTOM PANEL ====== */}
          <div className="border-t border-[#2d2d2d] bg-[#1e1e1e] shrink-0 flex flex-col" style={{ height: '35%', minHeight: 160 }}>
            {/* Bottom Tabs */}
            <div className="flex items-center border-b border-[#2d2d2d] bg-[#252526] px-2 shrink-0">
              {([
                { key: 'testcases' as BottomTab, label: 'Test Cases', icon: <Terminal className="w-3.5 h-3.5" /> },
                {
                  key: 'result' as BottomTab,
                  label: activeSubmission?.isRun === false ? 'Submission Result' : 'Result',
                  icon: activeSubmission ? getStatusIcon(activeSubmission.status) : <Zap className="w-3.5 h-3.5" />
                },
                {
                  key: 'history' as BottomTab,
                  label: `History${problemSubmissions.length > 0 ? ` (${problemSubmissions.length})` : ''}`,
                  icon: <History className="w-3.5 h-3.5" />
                },
              ]).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setBottomTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors border-b-2
                    ${bottomTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-400 hover:text-gray-200'}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Bottom Content */}
            <div className="flex-1 overflow-y-auto p-3 text-sm">

              {/* --- Test Cases Tab --- */}
              {bottomTab === 'testcases' && (
                <div className="space-y-3">
                  {problem.testCases?.filter(tc => !tc.isHidden).length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No visible test cases.</p>
                  ) : (
                    problem.testCases?.filter(tc => !tc.isHidden).map((tc, i) => (
                      <div key={i} className="bg-[#252526] rounded-lg border border-[#3e3e3e] overflow-hidden">
                        <div className="px-3 py-1.5 text-xs text-gray-400 border-b border-[#3e3e3e] font-medium">
                          Case {i + 1}
                        </div>
                        <div className="p-3 space-y-2 font-mono text-xs">
                          <div>
                            <span className="text-gray-500">stdin =</span>
                            <pre className="mt-1 text-gray-300 bg-[#1e1e1e] p-2 rounded">{tc.input}</pre>
                          </div>
                          <div>
                            <span className="text-gray-500">expected =</span>
                            <pre className="mt-1 text-gray-300 bg-[#1e1e1e] p-2 rounded">{tc.expectedOutput}</pre>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* --- Result Tab --- */}
              {bottomTab === 'result' && (
                <div className="space-y-3">
                  {!activeSubmission && !isProcessing && (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                      <Send className="w-8 h-8 mb-2 opacity-30" />
                      <p>Run or submit your code to see results</p>
                    </div>
                  )}

                  {isProcessing && !activeSubmission && (
                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 border-4 border-primary/20 rounded-full" />
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin absolute inset-0" />
                      </div>
                      <p className="text-gray-400 text-sm">Running your solution...</p>
                    </div>
                  )}

                  {activeSubmission && (() => {
                    const cases: TestCaseResult[] = activeSubmission.testResults || [];
                    const allPassed = activeSubmission.status === 'PASSED';
                    const curCase = cases[selectedResultCase] || null;
                    const passedCount = cases.filter(c => c.passed).length;
                    const totalCount = cases.length;
                    const passPercent = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;
                    return (
                      <div className="space-y-3">
                        {/* ── Submission Recorded Banner (Only for real Submit, not Run) ── */}
                        {!activeSubmission.isRun && (
                          <div className="flex items-center justify-between px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400">
                            <span className="flex items-center gap-1.5 font-medium">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              Submission saved to your History ({problemSubmissions.length})
                            </span>
                            <button
                              onClick={() => setBottomTab('history')}
                              className="font-semibold text-emerald-300 hover:text-emerald-200 underline cursor-pointer"
                            >
                              View in History Tab →
                            </button>
                          </div>
                        )}

                        {/* ── Status Header ── */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {allPassed
                              ? <CheckCircle2 className="w-6 h-6 text-green-500" />
                              : <XCircle className="w-6 h-6 text-red-500" />}
                            <span className={`text-xl font-bold ${
                              allPassed ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {allPassed ? 'Accepted' : (
                                activeSubmission.errorMessage?.includes('Runtime Error') ? 'Runtime Error' :
                                activeSubmission.errorMessage?.includes('Incomplete') ? 'Incomplete Solution' :
                                'Wrong Answer'
                              )}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            Runtime: {activeSubmission.runtimeMs ?? 0} ms
                          </span>
                        </div>

                        {/* ── Passed / Total Counter ── */}
                        {totalCount > 0 && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-400">
                                <span className={`font-semibold ${allPassed ? 'text-green-400' : passedCount > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                                  {passedCount}
                                </span>
                                <span className="text-gray-500"> / {totalCount} test cases passed</span>
                              </span>
                              <span className={`font-medium ${allPassed ? 'text-green-400' : passedCount > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {passPercent}%
                              </span>
                            </div>
                            {/* Progress Bar */}
                            <div className="h-1.5 w-full bg-[#2d2d30] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  allPassed ? 'bg-green-500' : passedCount > 0 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${passPercent}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* ── Incomplete / no test data message ── */}
                        {activeSubmission.errorMessage?.includes('Incomplete') && (
                          <div className="bg-yellow-500/10 border border-yellow-500/25 rounded-lg p-3 text-xs text-yellow-300 whitespace-pre-wrap font-mono">
                            {activeSubmission.errorMessage}
                          </div>
                        )}

                        {/* ── Case Tabs ── */}
                        {cases.length > 0 && (
                          <>
                            <div className="flex gap-2 flex-wrap">
                              {cases.map((c, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedResultCase(idx)}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                                    selectedResultCase === idx
                                      ? c.passed
                                        ? 'bg-green-500/15 border-green-500/40 text-green-400'
                                        : 'bg-red-500/15 border-red-500/40 text-red-400'
                                      : 'bg-[#252526] border-transparent text-gray-400 hover:text-gray-200'
                                  }`}
                                >
                                  {c.passed
                                    ? <CheckCircle2 className="w-3 h-3" />
                                    : <XCircle className="w-3 h-3" />}
                                  Case {idx + 1}
                                </button>
                              ))}
                            </div>

                            {/* ── Input / Output / Expected ── */}
                            {curCase && (
                              <div className="space-y-3">
                                {/* Input */}
                                <div>
                                  <p className="text-xs text-gray-400 font-medium mb-1">Input</p>
                                  <pre className="bg-[#1e1e1e] border border-[#3e3e42] rounded-lg p-3 text-sm text-gray-200 font-mono whitespace-pre-wrap overflow-x-auto">
                                    {curCase.input}
                                  </pre>
                                </div>

                                {/* Output */}
                                <div>
                                  <p className="text-xs text-gray-400 font-medium mb-1">Output</p>
                                  <pre className={`rounded-lg p-3 text-sm font-mono whitespace-pre-wrap overflow-x-auto border ${
                                    curCase.passed
                                      ? 'bg-green-500/5 border-green-500/20 text-green-300'
                                      : 'bg-red-500/5 border-red-500/20 text-red-300'
                                  }`}>
                                    {curCase.actualOutput}
                                  </pre>
                                </div>

                                {/* Expected */}
                                <div>
                                  <p className="text-xs text-gray-400 font-medium mb-1">Expected</p>
                                  <pre className="bg-[#1e1e1e] border border-[#3e3e42] rounded-lg p-3 text-sm text-gray-200 font-mono whitespace-pre-wrap overflow-x-auto">
                                    {curCase.expectedOutput}
                                  </pre>
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {/* Polling indicator */}
                        {isPolling && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="flex gap-0.5">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            Checking status...
                          </div>
                        )}

                        {pollingError && (
                          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded p-3 text-xs text-yellow-400">
                            {pollingError}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* --- History Tab --- */}
              {bottomTab === 'history' && (
                <div className="space-y-2">
                  {problemSubmissions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                      <History className="w-8 h-8 mb-2 opacity-30" />
                      <p className="text-sm font-medium text-gray-300">No submissions yet</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Click the green <span className="text-green-400 font-semibold">Submit</span> button (not Run) to submit your solution.
                      </p>
                    </div>
                  ) : (
                    problemSubmissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="w-full flex items-center justify-between p-3 rounded-lg bg-[#252526] hover:bg-[#2d2d2e] border border-[#3e3e42] transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {getStatusIcon(sub.status)}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={getStatusBadge(sub.status)}>
                                {sub.status === 'PASSED' ? 'Accepted' : 'Wrong Answer'}
                              </span>
                              <span className="text-xs text-gray-400 font-mono bg-[#1e1e1e] px-2 py-0.5 rounded border border-[#333]">
                                {sub.language}
                              </span>
                              {sub.testResults && sub.testResults.length > 0 && (
                                <span className={`text-xs font-medium ${sub.status === 'PASSED' ? 'text-green-400' : 'text-yellow-400'}`}>
                                  {sub.testResults.filter(r => r.passed).length}/{sub.testResults.length} cases
                                </span>
                              )}
                              {sub.runtimeMs !== undefined && (
                                <span className="text-xs text-gray-500">
                                  {sub.runtimeMs} ms
                                </span>
                              )}
                            </div>
                            {sub.errorMessage && sub.status !== 'PASSED' && (
                              <p className="text-xs text-red-400 mt-1 truncate max-w-sm">
                                {sub.errorMessage}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-gray-500">
                            {formatTime(sub.createdAt)}
                          </span>
                          <button
                            onClick={() => {
                              setLastResult(sub);
                              setCode(sub.code);
                              setSelectedResultCase(0);
                              setBottomTab('result');
                            }}
                            className="px-2.5 py-1 text-xs bg-primary/10 text-primary hover:bg-primary/20 rounded border border-primary/20 transition-colors cursor-pointer font-medium"
                            title="Load code & view details"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailsPage;
