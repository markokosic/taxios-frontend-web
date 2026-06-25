import { RemunerationConfig } from '@/features/remuneration/remuneration-types';
import { CreateDriverRequest, UpdateDriverRequest } from './drivers-schemas';

export type DriverId = number;

export type Driver = {
  id: DriverId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentRemunerationConfigs: RemunerationConfig[];
};

export interface DriverSelect {
  id: number;
  fullName: string;
}

export { type CreateDriverRequest, type UpdateDriverRequest };
