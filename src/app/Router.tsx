import { RouterProvider } from 'react-router';
import { router } from './router.config';

export const AppRouter = () => {

  return <RouterProvider router={router} />;
};

export default AppRouter;


