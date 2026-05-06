import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ROUTES } from '@/config/routes';
import { CarCreatePage } from '@/features/cars/pages/CarCreatePage';
import { CarPage } from '@/features/cars/pages/CarPage';
import { CarsPage } from '@/features/cars/pages/CarsPage';
import { DriverCreatePage } from '@/features/drivers/pages/DriverCreatePage';
import { DriverPage } from '@/features/drivers/pages/DriverPage';
import { DriversPage } from '@/features/drivers/pages/DriversPage';
import { RevenuesPage } from '@/features/revenues/pages/RevenuesPage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import DashboardPage from './routes/app/DashboardPage';

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
    element: (
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    ),
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

      // 404 NOT FOUND PAGE
      { path: '*', element: <div>Not found</div> },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export { AppRouter };
