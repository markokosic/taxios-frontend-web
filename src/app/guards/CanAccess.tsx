import { ReactNode } from 'react';
import { UserResponseRoles } from '@/api/generated/model';
import { useUserHasRole } from '@/features/auth/hooks/useUserHasRole';

export interface CanAccessProps {
  roles?: UserResponseRoles[] | UserResponseRoles;
  children: ReactNode;
  fallback?: ReactNode;
}

export const CanAccess = ({ roles, children, fallback = null }: CanAccessProps) => {
  const hasAccess = useUserHasRole(roles);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};
1;
