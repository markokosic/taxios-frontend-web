import { lazy } from 'react';
import type { RouteObject } from 'react-router';
import { ROUTES } from '@/config/routes';

const ReportPage = lazy(() => import('./pages/ReportPage'));

const { reports } = ROUTES.app;

export const reportRoutes: RouteObject[] = [
  {
    path: reports.path,
    element: <ReportPage />,
  },
];

