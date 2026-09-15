import { lazy } from 'react';
import type { RouteObject } from 'react-router';
import { ROUTES } from '@/config/routes';

const FlatRatesPage = lazy(() => import('./pages/FlatRatesPage'));
const CreateNewFlatRatePage = lazy(() => import('./pages/CreateNewFlatRatePage'));

const { flatrates } = ROUTES.app;

export const flatrateRoutes: RouteObject[] = [
  {
    path: flatrates.path,
    element: <FlatRatesPage />,
  },
  {
    path: flatrates.create.path,
    element: <CreateNewFlatRatePage />,
  },
];

