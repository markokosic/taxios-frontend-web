import { CreateCarRequest, UpdateCarRequest } from './cars-schemas';

export type CarId = number;

export type Car = {
  id: CarId;
  licensePlate: string;
  model: string;
  brand: string;
  horsepower: string;
};

export { type CreateCarRequest, type UpdateCarRequest };
