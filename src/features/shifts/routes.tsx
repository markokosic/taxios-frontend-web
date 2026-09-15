import { lazy } from 'react';
import type { RouteObject } from 'react-router';
import { ROUTES } from '@/config/routes';

const AdminShiftsPage = lazy(() => import('./pages/admin/AdminShiftsPage'));
const AdminCreateShiftPage = lazy(() => import('./pages/admin/AdminCreateShiftPage'));
const AdminEditShiftPage = lazy(() => import('./pages/admin/AdminEditShiftPage'));
const DriverShiftsPage = lazy(() => import('./pages/driver/DriverShiftsPage'));
const DriverCreateShiftPage = lazy(() => import('./pages/driver/DriverCreateShiftPage'));
const AdminShiftViewPage = lazy(() => import('./pages/admin/AdminViewShiftPage'));
const DriverViewShiftPage = lazy(() => import('./pages/driver/DriverViewShiftPage'));
const DriverEditShiftPage = lazy(() => import('./pages/driver/DriverEditShiftPage'));

const { shifts, driver } = ROUTES.app;

export const adminShiftRoutes: RouteObject[] = [
  {
    path: shifts.path,
    element: <AdminShiftsPage />,
  },
  {
    path: shifts.create.path,
    element: <AdminCreateShiftPage />,
  },
  {
    path: shifts.edit.path,
    element: <AdminEditShiftPage />,
  },
  {
    path: shifts.view.path,
    element: <AdminShiftViewPage />,
  },
];

export const driverShiftRoutes: RouteObject[] = [
  {
    path: driver.shifts.path,
    element: <DriverShiftsPage />,
  },
  {
    path: driver.shifts.create.path,
    element: <DriverCreateShiftPage />,
  },
  {
    path: driver.shifts.view.path,
    element: <DriverViewShiftPage />,
  },
  {
    path: driver.shifts.edit.path,
    element: <DriverEditShiftPage />,
  },
];
