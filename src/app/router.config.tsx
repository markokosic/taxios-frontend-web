import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import { UserResponseRoles } from '@/api/generated/model';
import { ROUTES } from '@/config/routes';
import { authRoutes } from '@/features/auth/routes';
import { carRoutes } from '@/features/cars/routes';
import { adminDashboardRoutes, driverDashboardRoutes } from '@/features/dashboard/routes';
import { driverRoutes } from '@/features/drivers/routes';
import { flatrateRoutes } from '@/features/flatrates/routes';
import { reportRoutes } from '@/features/reports/routes';
import { settingsRoutes } from '@/features/settings/routes';
import { adminShiftRoutes, driverShiftRoutes } from '@/features/shifts/routes';
import { userRoutes } from '@/features/users/routes';
import { MainErrorFallback } from '@/shared/components/feedback/MainErrorFallback';
import { MANAGEMENT_ROLES } from '@/shared/constants';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { PublicRoute } from './guards/PublicRoute';
import { RoleGuard } from './guards/RoleGuard';
import { RootRedirect } from './guards/RootRedirect';
import { AuthLayout } from './layout/AuthLayout';

const ChangePasswordPage = lazy(() => import('@/features/auth/pages/ChangePasswordPage'));

export const router = createBrowserRouter([
  // Public & Auth Routes
  {
    element: <AuthLayout />,
    errorElement: <MainErrorFallback />,
    children: [
      {
        element: <PublicRoute />,
        children: authRoutes,
      },
      {
        path: ROUTES.auth.changePassword.path,
        element: <ChangePasswordPage />,
      },
    ],
  },

  // Authenticated Protected App Routes
  {
    element: <ProtectedRoute />,
    errorElement: <MainErrorFallback />,
    children: [
      {
        index: true,
        element: <RootRedirect />,
      },
      // Shared authenticated routes (Shift details, Settings)
      ...settingsRoutes,

      // Driver-only dedicated routes
      {
        element: <RoleGuard allowedRoles={[UserResponseRoles.DRIVER]} />,
        children: [...driverDashboardRoutes, ...driverShiftRoutes],
      },

      // Management only (Dashboard, Shifts, Cars, Drivers, Flatrates, Reports)
      {
        element: <RoleGuard allowedRoles={MANAGEMENT_ROLES} />,
        children: [
          ...adminDashboardRoutes,
          ...adminShiftRoutes,
          ...carRoutes,
          ...driverRoutes,
          ...flatrateRoutes,
          ...reportRoutes,
        ],
      },

      // Admin & Owner only (Users)
      {
        element: <RoleGuard allowedRoles={[UserResponseRoles.ADMIN, UserResponseRoles.OWNER]} />,
        children: [...userRoutes],
      },

      {
        path: '*',
        element: <div>Not found</div>,
      },
    ],
  },
]);
