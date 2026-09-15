import { Navigate } from 'react-router';
import { useUserRole } from '@/features/auth/hooks/useUserHasRole';
import { getDefaultRouteForRole } from '../app-routes.config';

export const RootRedirect = () => {
  const { role } = useUserRole();
  return (
    <Navigate
      to={getDefaultRouteForRole(role)}
      replace
    />
  );
};

export default RootRedirect;
