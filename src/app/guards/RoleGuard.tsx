import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router';
import { UserResponseRoles } from '@/api/generated/model';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useUserHasRole } from '@/features/auth/hooks/useUserHasRole';
import { getDefaultRouteForRole } from '../app-routes.config';

export interface RoleGuardProps {
  allowedRoles: UserResponseRoles[] | UserResponseRoles;
  redirectTo?: string;
  children?: ReactNode;
}

export const RoleGuard = ({ allowedRoles, redirectTo, children }: RoleGuardProps) => {
  const { user, isPending } = useAuth();
  const hasAccess = useUserHasRole(allowedRoles);

  if (isPending) {
    return null;
  }

  if (!user) {
    return (
      <Navigate
        to={ROUTES.auth.login.path}
        replace
      />
    );
  }

  if (!hasAccess) {
    const target = redirectTo ?? getDefaultRouteForRole(user.role);
    return (
      <Navigate
        to={target}
        replace
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
};
