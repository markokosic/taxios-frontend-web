import { ApiResponse, ApiSuccessResponse } from '@/common/types/api-types';
import {
  AuthCredentialsPayload,
  LoginResponseData,
  RegisterTenantPayload,
  User,
} from '@/features/auth/types/auth-types';
import { api } from '@/lib/apiClient';

export const login = async (
  payload: AuthCredentialsPayload
): Promise<ApiResponse<LoginResponseData>> => {
  return await api.post('/api/auth/login', payload);
};

export const register = (payload: RegisterTenantPayload): Promise<ApiResponse> => {
  return api.post('/auth/register', payload);
};

export const logout = (): Promise<ApiSuccessResponse> => {
  return api.post('/auth/logout');
};

export const getAuthUser = (): Promise<ApiResponse<User>> => {
  return api.get('/auth/me');
};
