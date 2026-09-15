import { lazy } from 'react';
import type { RouteObject } from 'react-router';
import { ROUTES } from '@/config/routes';

const UsersPage = lazy(() => import('./pages/UsersPage'));

const { users } = ROUTES.app;

export const userRoutes: RouteObject[] = [
  {
    path: users.path,
    element: <UsersPage />,
  },
];

