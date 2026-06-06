import { useState, useEffect, useRef, useCallback } from 'react';
import { getSubmissionStatus, SubmissionResponse, SubmissionStatus } from '../api/submissionApi';

interface UseSubmissionPollingOptions {
  intervalMs?: number;
  maxAttempts?: number;
  onComplete?: (submission: SubmissionResponse) => void;
}

const TERMINAL_STATUSES: SubmissionStatus[] = ['PASSED', 'FAILED'];

export function useSubmissionPolling(options: UseSubmissionPollingOptions = {}) {
  const { intervalMs = 1500, maxAttempts = 40, onComplete } = options;

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
          setError('Polling timed out. The submission is still being processed.');
          return;
        }
      } catch (err: any) {
        stopPolling();
        setError(err?.response?.data?.message || 'Failed to fetch submission status.');
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
  }, [isPolling, submissionId, intervalMs, maxAttempts, stopPolling, onComplete]);

  return { submission, isPolling, error, startPolling, stopPolling };
}
