import { Navigate } from 'react-router';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = localStorage.getItem('lyann_authenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
