import {
  CalendarDays,
  Car,
  FileChartLine,
  House,
  LucideIcon,
  PersonStanding,
  Settings,
  Tag,
  Users,
} from 'lucide-react';
import { UserResponseRoles } from '@/api/generated/model';
import { MANAGEMENT_ROLES } from '@/shared/constants';
import { ROUTES } from './routes';

export interface NavItem {
  id: number;
  path: string;
  href: string;
  labelKey: string;
  icon: LucideIcon;
  roles?: UserResponseRoles[];
}

export const NAV_ITEMS: Record<string, NavItem[]> = {
  overview: [
    {
      id: 0,
      href: ROUTES.app.dashboard.getHref(),
      path: ROUTES.app.dashboard.path,
      labelKey: 'navigation.dashboard',
      icon: House,
      roles: MANAGEMENT_ROLES,
    },
    {
      id: 1,
      href: ROUTES.app.driver.dashboard.getHref(),
      path: ROUTES.app.driver.dashboard.path,
      labelKey: 'navigation.dashboard',
      icon: House,
      roles: [UserResponseRoles.DRIVER],
    },
    {
      id: 2,
      href: ROUTES.app.reports.getHref(),
      path: ROUTES.app.reports.path,
      labelKey: 'navigation.reports',
      icon: FileChartLine,
      roles: MANAGEMENT_ROLES,
    },
  ],
  operations: [
    {
      id: 3,
      href: ROUTES.app.driver.shifts.getHref(),
      path: ROUTES.app.driver.shifts.path,
      labelKey: 'navigation.shifts',
      icon: CalendarDays,
      roles: [UserResponseRoles.DRIVER],
    },
    {
      id: 4,
      href: ROUTES.app.shifts.getHref(),
      path: ROUTES.app.shifts.path,
      labelKey: 'navigation.shifts',
      icon: CalendarDays,
      roles: MANAGEMENT_ROLES,
    },
    {
      id: 5,
      href: ROUTES.app.drivers.getHref(),
      path: ROUTES.app.drivers.path,
      labelKey: 'navigation.drivers',
      icon: PersonStanding,
      roles: MANAGEMENT_ROLES,
    },
    {
      id: 6,
      href: ROUTES.app.cars.getHref(),
      path: ROUTES.app.cars.path,
      labelKey: 'navigation.cars',
      icon: Car,
      roles: MANAGEMENT_ROLES,
    },
  ],
  administration: [
    {
      id: 7,
      href: ROUTES.app.flatrates.getHref(),
      path: ROUTES.app.flatrates.path,
      labelKey: 'navigation.flatrates',
      icon: Tag,
      roles: MANAGEMENT_ROLES,
    },
    {
      id: 8,
      href: ROUTES.app.users.getHref(),
      path: ROUTES.app.users.path,
      labelKey: 'navigation.users',
      icon: Users,
      roles: [UserResponseRoles.ADMIN, UserResponseRoles.OWNER],
    },
    {
      id: 9,
      href: ROUTES.app.settings.getHref(),
      path: ROUTES.app.settings.path,
      labelKey: 'navigation.settings',
      icon: Settings,
    },
  ],
};

