import { lazy } from 'react';
import type { RouteObject } from 'react-router';
import { ROUTES } from '@/config/routes';

const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const { settings } = ROUTES.app;

export const settingsRoutes: RouteObject[] = [
  {
    path: settings.path,
    element: <SettingsPage />,
  },
];

