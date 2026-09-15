import { Navigate } from 'react-router';
import { AppLayout } from '../layout/AppLayout';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const ProtectedRoute = () => {
  const { user, isAuthenticated, isPending } = useAuth();

  if (isPending) {
    return <AppLayout overlayVisible />;
  }

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={ROUTES.auth.login.path}
        replace
      />
    );
  }

  if (user.mustChangePassword) {
    return (
      <Navigate
        to={ROUTES.auth.changePassword.path}
        replace
      />
    );
  }

  return <AppLayout overlayVisible={false} />;
};
