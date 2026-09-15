import { Navigate, Outlet } from 'react-router';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';

import { getDefaultRouteForRole } from '../app-routes.config';

export const PublicRoute = () => {
  const { user, isAuthenticated, isPending } = useAuth();

  if (isPending) {
    return null;
  }

  if (isAuthenticated && user) {
    if (user.mustChangePassword) {
      return (
        <Navigate
          to={ROUTES.auth.changePassword.path}
          replace
        />
      );
    }
    return (
      <Navigate
        to={getDefaultRouteForRole(user.role)}
        replace
      />
    );
  }

  return <Outlet />;
};
