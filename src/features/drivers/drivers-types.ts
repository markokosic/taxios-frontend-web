import { Driver as GeneratedDriver, DriverSelect as GeneratedDriverSelect } from '@/api/generated/model';
import { CreateDriverRequest, UpdateDriverRequest } from './drivers-schemas';

export type DriverId = number;

export type Driver = GeneratedDriver;
export type DriverSelect = GeneratedDriverSelect;

export { type CreateDriverRequest, type UpdateDriverRequest };
