import { ApiResponse, PaginatedList } from 'src/common/types/api-types';
import { api } from 'src/lib/apiClient';
import {
  Car,
  CarId,
  CreateCarRequest,
  UpdateCarRequest,
} from '@/features/cars/cars-types';

export const getCars = async (): Promise<ApiResponse<PaginatedList<Car[]>>> => {
  return await api.get(`/cars`);
};

export const getCar = async ({
  carId,
}: {
  carId: CarId;
}): Promise<ApiResponse<Car>> => {
  return await api.get(`/cars/${carId}`);
};

export const updateCar = async ({
  carId,
  payload,
}: {
  carId: CarId;
  payload: UpdateCarRequest;
}): Promise<ApiResponse<Car>> => {
  return await api.patch(`/cars/${carId}`, payload);
};

export const createCar = async ({
  payload,
}: {
  payload: CreateCarRequest;
}): Promise<ApiResponse<Car>> => {
  return await api.post(`/cars`, payload);
};

export const deleteCar = async ({
  carId,
}: {
  carId: CarId;
}): Promise<ApiResponse<void>> => {
  return await api.delete(`/cars/${carId}`);
};
