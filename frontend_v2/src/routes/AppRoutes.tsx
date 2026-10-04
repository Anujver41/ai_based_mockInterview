import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { getMe } from '../features/auth/api/authApi';
import { setUser, logout } from '../store/slices/authSlice';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import { Loader2 } from 'lucide-react';

// ── Lazy-load every page so the initial JS bundle is tiny ────────────────────
const LoginPage              = lazy(() => import('../pages/auth/LoginPage'));
const SignupPage             = lazy(() => import('../pages/auth/SignupPage'));
const LandingPage            = lazy(() => import('../pages/landing/LandingPage'));
const DashboardPage          = lazy(() => import('../pages/dashboard/DashboardPage'));
const ProblemsListPage       = lazy(() => import('../pages/problems/ProblemsListPage'));
const ProblemDetailsPage     = lazy(() => import('../pages/problems/ProblemDetailsPage'));
const ProblemCreatePage      = lazy(() => import('../pages/problems/ProblemCreatePage'));
const SubmissionHistoryPage  = lazy(() => import('../pages/submissions/SubmissionHistoryPage'));
const CodeReviewPage         = lazy(() => import('../pages/ai/CodeReviewPage'));
const InterviewPage          = lazy(() => import('../pages/interview/InterviewPage'));
const InterviewChatPage      = lazy(() => import('../pages/interview/InterviewChatPage'));
const ResumePage             = lazy(() => import('../pages/resume/ResumePage'));
const GithubAnalyzerPage     = lazy(() => import('../pages/github/GithubAnalyzerPage'));
const ConnectedPlatformsPage = lazy(() => import('../pages/platforms/ConnectedPlatformsPage'));

// Minimal full-screen spinner shown while a lazy chunk is downloading
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

export const AppRoutes = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && !user) {
      getMe()
        .then((userData) => {
          dispatch(setUser({ id: userData.id, email: userData.email, role: userData.role }));
        })
        .catch((err) => {
          console.error('Failed to fetch user profile:', err);
          dispatch(logout());
        });
    }
  }, [token, user, dispatch]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Public Routes */}
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Problem Routes — require login */}
          <Route
            path="problems"
            element={
              <ProtectedRoute>
                <ProblemsListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="problems/new"
            element={
              <ProtectedRoute>
                <ProblemCreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="problems/:id"
            element={
              <ProtectedRoute>
                <ProblemDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Submission Routes */}
          <Route
            path="submissions"
            element={
              <ProtectedRoute>
                <SubmissionHistoryPage />
              </ProtectedRoute>
            }
          />

          {/* AI Routes */}
          <Route
            path="code-review"
            element={
              <ProtectedRoute>
                <CodeReviewPage />
              </ProtectedRoute>
            }
          />

          {/* Interview Routes */}
          <Route
            path="interview"
            element={
              <ProtectedRoute>
                <InterviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="interview/:sessionId"
            element={
              <ProtectedRoute>
                <InterviewChatPage />
              </ProtectedRoute>
            }
          />

          {/* Resume Routes */}
          <Route
            path="resume"
            element={
              <ProtectedRoute>
                <ResumePage />
              </ProtectedRoute>
            }
          />

          {/* GitHub Routes */}
          <Route
            path="github"
            element={
              <ProtectedRoute>
                <GithubAnalyzerPage />
              </ProtectedRoute>
            }
          />

          {/* Connected Platforms */}
          <Route
            path="platforms"
            element={
              <ProtectedRoute>
                <ConnectedPlatformsPage />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
