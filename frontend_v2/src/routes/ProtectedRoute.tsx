import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import toast from 'react-hot-toast';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      toast('Please log in to access this feature.', {
        icon: '🔒',
        duration: 3500,
        style: {
          background: '#1e1e2e',
          color: '#e2e8f0',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: '10px',
          fontSize: '14px',
        },
      });
    }
  // Only fire once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
