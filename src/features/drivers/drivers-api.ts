import { ApiResponse, PaginatedList } from 'src/common/types/api-types';
import { api } from 'src/lib/apiClient';
import {
  CreateDriverRequest,
  Driver,
  DriverId,
  DriverSelect,
  UpdateDriverRequest,
} from '@/features/drivers/drivers-types';

export const getDrivers = async (): Promise<ApiResponse<PaginatedList<Driver[]>>> => {
  return await api.get(`/drivers`);
};

export const getDriversNames = async (): Promise<ApiResponse<DriverSelect[]>> => {
  return await api.get(`/drivers/select`);
};

export const getDriver = async ({
  driverId,
}: {
  driverId: DriverId;
}): Promise<ApiResponse<Driver>> => {
  return await api.get(`/drivers/${driverId}`);
};

export const updateDriver = async ({
  driverId,
  payload,
}: {
  driverId: DriverId;
  payload: UpdateDriverRequest;
}): Promise<ApiResponse<Driver>> => {
  return await api.patch(`/drivers/${driverId}`, payload);
};

export const createDriver = async ({
  payload,
}: {
  payload: CreateDriverRequest;
}): Promise<ApiResponse<Driver>> => {
  return await api.post(`/drivers`, payload);
};
