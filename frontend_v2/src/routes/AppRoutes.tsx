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

// Temporary placeholder components for routes
const Home = () => (
  <div className="space-y-6 max-w-4xl mx-auto py-12">
    <div className="text-center space-y-4">
      <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-foreground">
        Master Your Next <span className="text-primary">AI Interview</span>
      </h1>
      <p className="text-xl text-muted-foreground">
        The all-in-one platform for technical interview preparation, resume optimization, and GitHub analysis.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
      {[
        { title: 'Mock Interviews', desc: 'Real-time AI-driven interview simulation.' },
        { title: 'Resume Analysis', desc: 'Get instant feedback on your CV.' },
        { title: 'GitHub Insights', desc: 'Analyze your code portfolio automatically.' }
      ].map((feature, i) => (
        <div key={i} className="p-6 bg-card border border-border rounded-xl shadow-sm hover:border-primary/50 transition-colors">
          <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
          <p className="text-sm text-muted-foreground">{feature.desc}</p>
        </div>
      ))}
    </div>
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
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
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
        
        {/* Problem Routes */}
        <Route path="problems" element={<ProblemsListPage />} />
        <Route 
          path="problems/new" 
          element={
            <ProtectedRoute>
              <ProblemCreatePage />
            </ProtectedRoute>
          } 
        />
        <Route path="problems/:id" element={<ProblemDetailsPage />} />
        
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
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
