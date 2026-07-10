import queryClient from '@/lib/queryClient';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
AXIOS_INSTANCE.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API call failed:', error);
    // Handle specific error cases
    if (error.response.status === 401) {
      console.log('inside unauth');

      queryClient.clear();
      // window.location.href = '/login';
    } else if (error.response.status === 404) {
      // Not found
    }
    return Promise.reject(error);
  }
);

// Add a second `options` argument to pass extra options to each query
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
  }).then(({ data }) => data);

  return promise;
};

// Override the return error type for react-query and swr
export type ErrorType<Error> = AxiosError<Error>;

// Standard body type
export type BodyType<BodyData> = BodyData;

// Or wrap the body type if processing data before sending
// export type BodyType<BodyData> = CamelCase<BodyData>;
