import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { getMe } from '../features/auth/api/authApi';
import { setUser, logout } from '../store/slices/authSlice';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ProblemsListPage from '../pages/problems/ProblemsListPage';
import ProblemDetailsPage from '../pages/problems/ProblemDetailsPage';
import ProblemCreatePage from '../pages/problems/ProblemCreatePage';
import SubmissionHistoryPage from '../pages/submissions/SubmissionHistoryPage';
import CodeReviewPage from '../pages/ai/CodeReviewPage';
import InterviewPage from '../pages/interview/InterviewPage';
import InterviewChatPage from '../pages/interview/InterviewChatPage';
import ResumePage from '../pages/resume/ResumePage';
import GithubAnalyzerPage from '../pages/github/GithubAnalyzerPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ConnectedPlatformsPage from '../pages/platforms/ConnectedPlatformsPage';
import LandingPage from '../pages/landing/LandingPage';

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
  );
};

export default AppRoutes;
