import { api } from 'src/lib/apiClient';
import { ApiResponse } from '@/common/types/api-types';
import { CreateRevenueRecordRequest } from './revenues-schemas';

export const createRevenuesBulk = async (
  payload: CreateRevenueRecordRequest[]
): Promise<ApiResponse<null>> => {
  return await api.post(`/revenues/bulk`, payload);
};
