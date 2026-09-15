import { lazy } from 'react';
import type { RouteObject } from 'react-router';
import { ROUTES } from '@/config/routes';

const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const DriverDashboardPage = lazy(() => import('./pages/driver/DriverDashboardPage'));

export const adminDashboardRoutes: RouteObject[] = [
  {
    path: ROUTES.app.dashboard.path,
    element: <AdminDashboardPage />,
  },
];

export const driverDashboardRoutes: RouteObject[] = [
  {
    path: ROUTES.app.driver.dashboard.path,
    element: <DriverDashboardPage />,
  },
];



