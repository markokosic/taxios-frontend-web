import { lazy } from 'react';
import type { RouteObject } from 'react-router';
import { ROUTES } from '@/config/routes';

const DriversPage = lazy(() => import('./pages/DriversPage'));
const DriverCreatePage = lazy(() => import('./pages/DriverCreatePage'));
const DriverViewPage = lazy(() => import('./pages/DriverViewPage'));
const DriverEditPage = lazy(() => import('./pages/DriverEditPage'));

const { drivers } = ROUTES.app;

export const driverRoutes: RouteObject[] = [
  {
    path: drivers.path,
    element: <DriversPage />,
  },
  {
    path: drivers.create.path,
    element: <DriverCreatePage />,
  },
  {
    path: drivers.view.path,
    element: <DriverViewPage />,
  },
  {
    path: drivers.edit.path,
    element: <DriverEditPage />,
  },
];

