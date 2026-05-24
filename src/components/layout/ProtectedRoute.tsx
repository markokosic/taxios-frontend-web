import { Navigate } from 'react-router';
import { AppLayout } from '@/components/layout';
import { ROUTES } from '@/config/routes';
import { useUser } from '@/lib/auth';

export const ProtectedRoute = () => {
  const { data: user, isPending } = useUser();

  if (!user) {
    return (
      <Navigate
        to={ROUTES.auth.login.path}
        replace
      />
    );
  }

  if (isPending) {
    return <AppLayout overlayVisible />;
  }

  return <AppLayout overlayVisible={false} />;
};
