import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ROUTES } from '@/config/routes';

// LAZY LOADED PAGES
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));
const DashboardPage = lazy(() => import('./routes/app/DashboardPage'));
const SettingsPage = lazy(() => import('./routes/app/SettingsPage'));

// Named exports need to be mapped for React.lazy
const DriversPage = lazy(() =>
  import('@/features/drivers/pages/DriversPage').then((module) => ({
    default: module.DriversPage,
  }))
);
const DriverCreatePage = lazy(() =>
  import('@/features/drivers/pages/DriverCreatePage').then((module) => ({
    default: module.DriverCreatePage,
  }))
);
const DriverPage = lazy(() =>
  import('@/features/drivers/pages/DriverPage').then((module) => ({
    default: module.DriverPage,
  }))
);

const CarsPage = lazy(() =>
  import('@/features/cars/pages/CarsPage').then((module) => ({
    default: module.CarsPage,
  }))
);
const CarCreatePage = lazy(() =>
  import('@/features/cars/pages/CarCreatePage').then((module) => ({
    default: module.CarCreatePage,
  }))
);
const CarPage = lazy(() =>
  import('@/features/cars/pages/CarPage').then((module) => ({
    default: module.CarPage,
  }))
);

const RevenuesPage = lazy(() =>
  import('@/features/revenues/pages/RevenuesPage').then((module) => ({
    default: module.RevenuesPage,
  }))
);
const CreateDailyRevenuesPage = lazy(() =>
  import('@/features/revenues/pages/CreateDailyRevenuesPage').then((module) => ({
    default: module.CreateDailyRevenuesPage,
  }))
);

const ReportPage = lazy(() =>
  import('@/features/reports/pages/ReportPage').then((module) => ({
    default: module.ReportPage,
  }))
);

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.auth.login.path,
        element: <LoginPage />,
      },
      {
        path: ROUTES.auth.register.path,
        element: <RegisterPage />,
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <DashboardPage /> },
      // DRIVER PAGES
      { path: ROUTES.app.drivers.path, element: <DriversPage /> },
      { path: ROUTES.app.drivers.create.path, element: <DriverCreatePage /> },
      { path: ROUTES.app.drivers.view.path, element: <DriverPage /> },

      // CAR PAGES
      { path: ROUTES.app.cars.path, element: <CarsPage /> },
      { path: ROUTES.app.cars.create.path, element: <CarCreatePage /> },
      { path: ROUTES.app.cars.view.path, element: <CarPage /> },

      //REVENUES PAGES
      { path: ROUTES.app.revenues.path, element: <RevenuesPage /> },
      { path: ROUTES.app.revenues.createBulk.path, element: <CreateDailyRevenuesPage /> },

      //REPORTS PAGES
      { path: ROUTES.app.reports.path, element: <ReportPage /> },

      // SETTINGS PAGE
      { path: ROUTES.app.settings.path, element: <SettingsPage /> },

      // 404 NOT FOUND PAGE
      { path: '*', element: <div>Not found</div> },
    ],
  },
]);

const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export { AppRouter };
