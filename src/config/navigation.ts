import {
  File,
  House,
  LucideIcon,
  PersonStanding,
  Settings,
  FileChartLine,
  HandCoins,
  Car
} from 'lucide-react';
import { ROUTES } from './routes';

export interface NavItem {
  id: number;
  path: string;
  href: string;
  labelKey: string;
  icon: LucideIcon;
  roles?: string[];
}

export const NAV_ITEMS: Record<string, NavItem[]> = {
  general: [
    {
      id: 0,
      href: ROUTES.app.dashboard.getHref(),
      path: ROUTES.app.dashboard.path,
      labelKey: 'navigation.dashboard',
      icon: House,
    },
    {
      id: 1,
      href: ROUTES.app.drivers.getHref(),
      path: ROUTES.app.drivers.path,
      labelKey: 'navigation.drivers',
      icon: PersonStanding,
    },
    {
      id: 1.5,
      href: ROUTES.app.cars.getHref(),
      path: ROUTES.app.cars.path,
      labelKey: 'navigation.cars',
      icon: Car,
    },
    {
      id: 2,
      href: ROUTES.app.revenues.getHref(),
      path: ROUTES.app.revenues.path,
      labelKey: 'navigation.revenues',
      icon: HandCoins,
    },
    {
      id: 3,
      href: ROUTES.app.reports.getHref(),
      path: ROUTES.app.reports.path,
      labelKey: 'navigation.reports',
      icon: FileChartLine,
    },
  ],
  support: [
    {
      id: 5,
      href: ROUTES.app.settings.getHref(),
      path: ROUTES.app.settings.path,
      labelKey: 'navigation.settings',
      icon: Settings,
    },
  ],
};
