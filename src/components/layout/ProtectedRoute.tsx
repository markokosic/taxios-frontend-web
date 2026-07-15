import { Navigate } from 'react-router';
import { AppLayout } from '@/components/layout';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const ProtectedRoute = () => {
  const { user, isPending } = useAuth();

  if (isPending) {
    return <AppLayout overlayVisible />;
  }

  if (!user) {
    return (
      <Navigate
        to={ROUTES.auth.login.path}
        replace
      />
    );
  }

  return <AppLayout overlayVisible={false} />;
};
