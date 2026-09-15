import { lazy } from 'react';
import type { RouteObject } from 'react-router';
import { ROUTES } from '@/config/routes';

const CarsPage = lazy(() => import('./pages/CarsPage'));
const CarCreatePage = lazy(() => import('./pages/CarCreatePage'));
const CarPage = lazy(() => import('./pages/CarPage'));

const { cars } = ROUTES.app;

export const carRoutes: RouteObject[] = [
  {
    path: cars.path,
    element: <CarsPage />,
  },
  {
    path: cars.create.path,
    element: <CarCreatePage />,
  },
  {
    path: cars.view.path,
    element: <CarPage />,
  },
];

