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
    changePassword: {
      path: '/change-password',
      getHref: () => '/change-password',
    },
  },


  app: {
    root: {
      path: '/',
      getHref: () => '/',
    },
    driver: {
      dashboard: {
        path: '/driver/dashboard',
        getHref: () => '/driver/dashboard',
      },
      shifts: {
        path: '/driver/shifts',
        getHref: () => '/driver/shifts',
        create: {
          path: '/driver/shifts/new',
          getHref: () => '/driver/shifts/new',
        },
        view: {
          path: '/driver/shifts/:shiftId',
          getHref: (shiftId: number | string) => `/driver/shifts/${shiftId}`,
        },
        edit: {
          path: '/driver/shifts/:shiftId/edit',
          getHref: (shiftId: number | string) => `/driver/shifts/${shiftId}/edit`,
        },
      },
    },
    dashboard: {
      path: '/dashboard',
      getHref: () => '/dashboard',
    },
    drivers: {
      path: '/drivers',
      getHref: () => '/drivers',
      view: {
        path: '/drivers/:driverId',
        getHref: (driverId: number | string) =>
          `/drivers/${driverId}`,
      },
      edit: {
        path: '/drivers/:driverId/edit',
        getHref: (driverId: number | string) =>
          `/drivers/${driverId}/edit`,
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
    reports: {
      path: '/reports',
      getHref: () => '/reports',
    },

    flatrates: {
      path: '/flatrates',
      getHref: () => '/flatrates',
      create: {
        path: '/flatrates/new',
        getHref: () => '/flatrates/new',
      },
    },

    shifts: {
      path: '/shifts',
      getHref: () => '/shifts',
      view: {
        path: '/shifts/:shiftId',
        getHref: (shiftId: number | string) => `/shifts/${shiftId}`,
      },
      edit: {
        path: '/shifts/:shiftId/edit',
        getHref: (shiftId: number | string) => `/shifts/${shiftId}/edit`,
      },
      create: {
        path: '/shifts/new',
        getHref: () => '/shifts/new',
      },
    },

    users: {
      path: '/users',
      getHref: () => '/users',
    },

    settings: {
      path: '/settings',
      getHref: () => '/settings',
    },
  },
} as const;


