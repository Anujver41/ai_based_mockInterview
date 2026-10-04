import { useState, useEffect, useRef, useCallback } from 'react';
import { getSubmissionStatus, SubmissionResponse, SubmissionStatus } from '../api/submissionApi';

interface UseSubmissionPollingOptions {
  intervalMs?: number;
  maxAttempts?: number;
  onComplete?: (submission: SubmissionResponse) => void;
  onFallback?: () => void; // called when backend is unreachable → triggers client-side eval
}

const TERMINAL_STATUSES: SubmissionStatus[] = ['PASSED', 'FAILED'];

export function useSubmissionPolling(options: UseSubmissionPollingOptions = {}) {
  const { intervalMs = 1500, maxAttempts = 20, onComplete, onFallback } = options;

  const [submissionId, setSubmissionId] = useState<number | null>(null);
  const [submission, setSubmission] = useState<SubmissionResponse | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const attemptRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
    attemptRef.current = 0;
  }, []);

  const startPolling = useCallback((id: number) => {
    stopPolling();
    setSubmissionId(id);
    setSubmission(null);
    setError(null);
    setIsPolling(true);
    attemptRef.current = 0;
  }, [stopPolling]);

  useEffect(() => {
    if (!isPolling || submissionId === null) return;

    const poll = async () => {
      try {
        attemptRef.current += 1;
        const result = await getSubmissionStatus(submissionId);
        setSubmission(result);

        if (TERMINAL_STATUSES.includes(result.status)) {
          stopPolling();
          onComplete?.(result);
          return;
        }

        if (attemptRef.current >= maxAttempts) {
          stopPolling();
          // Backend is too slow — trigger client-side fallback
          onFallback?.();
          setError(null);
          return;
        }
      } catch (err: any) {
        stopPolling();
        // Backend unreachable — trigger client-side fallback instead of showing error
        onFallback?.();
        setError(null);
      }
    };

    // Immediate first poll
    poll();

    intervalRef.current = setInterval(poll, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPolling, submissionId, intervalMs, maxAttempts, stopPolling, onComplete, onFallback]);

  return { submission, isPolling, error, startPolling, stopPolling };
}
