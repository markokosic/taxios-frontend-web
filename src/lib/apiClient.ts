import axios from 'axios';
import queryClient from './queryClient';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API call failed:', error);
    // Handle specific error cases
    if (error.response.status === 401) {

  
      queryClient.clear();
      // window.location.href = '/login';
    } else if (error.response.status === 404) {
      // Not found
    }
    return Promise.reject(error);
  }
);

export { api };
