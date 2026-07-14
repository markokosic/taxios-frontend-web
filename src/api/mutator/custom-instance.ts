import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import queryClient from '@/lib/queryClient';


export const AXIOS_INSTANCE = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
AXIOS_INSTANCE.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API call failed:', error);
    if (error.response?.status === 401) {

      queryClient.clear();
      
      const publicPaths = ['/login', '/register', '/reset-password'];
      const currentPath = window.location.pathname.replace(/\/$/, '');
      if (!publicPaths.includes(currentPath)) {
        window.location.replace('/login');
      }
    } else if (error.response?.status === 404) {
      // Not found
    }
    return Promise.reject(error);
  }
);

export const customInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  return AXIOS_INSTANCE({
    ...config,
    ...options,
  }).then(({ data }) => data);
};

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;
