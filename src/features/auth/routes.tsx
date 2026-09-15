import { lazy } from 'react';
import type { RouteObject } from 'react-router';
import { ROUTES } from '@/config/routes';

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));

const { auth } = ROUTES;

export const authRoutes: RouteObject[] = [
  {
    path: auth.login.path,
    element: <LoginPage />,
  },
  {
    path: ROUTES.auth.register.path,
    element: <RegisterPage />,
  },
];

