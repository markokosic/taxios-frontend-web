import { UserResponseRoles } from '@/api/generated/model';
import { ROUTES } from '@/config/routes';
import { MANAGEMENT_ROLES } from '@/shared/constants';

export interface RoutePermission {
  path: string;
  roles?: UserResponseRoles[];
}

export const ROUTE_PERMISSIONS: RoutePermission[] = [
  { path: ROUTES.app.dashboard.path },
  { path: ROUTES.app.shifts.path },
  { path: ROUTES.app.cars.path, roles: MANAGEMENT_ROLES },
  { path: ROUTES.app.drivers.path, roles: MANAGEMENT_ROLES },
  { path: ROUTES.app.flatrates.path, roles: MANAGEMENT_ROLES },
  { path: ROUTES.app.reports.path, roles: MANAGEMENT_ROLES },
  { path: ROUTES.app.users.path, roles: MANAGEMENT_ROLES },
  { path: ROUTES.app.settings.path },
];

export const isRouteAllowedForRole = (path: string, role?: UserResponseRoles): boolean => {
  const permission = ROUTE_PERMISSIONS.find((p) => p.path === path);
  if (!permission || !permission.roles || permission.roles.length === 0) {
    return true;
  }
  return role ? permission.roles.includes(role) : false;
};

export const getDefaultRouteForRole = (role?: UserResponseRoles): string => {
  if (role === UserResponseRoles.DRIVER) {
    return ROUTES.app.driver.dashboard.path;
  }
  return ROUTES.app.dashboard.path;
};


