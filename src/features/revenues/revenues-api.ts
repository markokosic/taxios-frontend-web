import { ApiResponse } from '@/common/types/api-types';
import { api } from '@/lib/apiClient';
import { CreateRevenueRecordRequest, DailyRevenues } from './revenues-schemas';

export const createRevenuesBulk = async (
  payload: CreateRevenueRecordRequest[]
): Promise<ApiResponse<null>> => {
  return await api.post(`/revenues/bulk`, payload);
};

export const getDailyRevenues = async (
  page: number,
  size: number
): Promise<ApiResponse<DailyRevenues>> => {
  return await api.get(`/revenues?page=${page}&size=${size}`);
};

export const updateDailyRevenue = async (
  id: number,
  payload: CreateRevenueRecordRequest
): Promise<ApiResponse<null>> => {
  return await api.put(`/revenues/${id}`, payload);
};

export const deleteDailyRevenue = async (id: number): Promise<ApiResponse<null>> => {
  return await api.delete(`/revenues/${id}`);
};
