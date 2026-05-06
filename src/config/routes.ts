import { DriverId } from '@/features/drivers/drivers-types';

export const ROUTES = {
  auth: {
    root: {
      path: '/',
      getHref: () => '/',
    },
    register: {
      path: '/register',
      getHref: () => '/register',
    },
    login: {
      path: '/login',
      getHref: () => '/login',
    },
    resetPassword: {
      path: '/reset-password',
    },
  },

  app: {
    root: {
      path: '/',
      getHref: () => '/',
    },
    dashboard: {
      path: '/',
      getHref: () => '/',
    },
    drivers: {
      path: '/drivers',
      getHref: () => '/drivers',
      view: {
        path: '/drivers/:driverId',
        getHref: (driverId: DriverId) =>
          `/drivers/${driverId}`,
      },
      create: {
        path: '/drivers/new',
        getHref: () => '/drivers/new',
      },
    },
    cars: {
      path: '/cars',
      getHref: () => '/cars',
      view: {
        path: '/cars/:carId',
        getHref: (carId: number) =>
          `/cars/${carId}`,
      },
      create: {
        path: '/cars/new',
        getHref: () => '/cars/new',
      },
    },
    revenues: {
      path: '/revenues',
      getHref: () => '/revenues',
    },
    reports: {
      path: '/reports',
      getHref: () => '/reports',
    },

    settings: {
      path: '/settings',
      getHref: () => '/settings',
    },
  },
} as const;
