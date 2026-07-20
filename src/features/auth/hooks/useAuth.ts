import { useQueryClient } from '@tanstack/react-query';
import {
  getGetMeQueryKey,
  useGetMe,
  useLogin,
  useLogout,
  useRegister,
} from '@/api/generated/endpoints/authentication/authentication';
import type { ApiResponseUserResponse } from '@/api/generated/model';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const getMeQueryKey = getGetMeQueryKey();

  const getMeQuery = useGetMe({
    query: {
      retry: false,
    },
  });

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (response) => {
        if (response.success && response.data?.user) {
          queryClient.setQueryData<ApiResponseUserResponse>(getMeQueryKey, {
            success: true,
            data: response.data.user,
            message: response.message,
          });
        }
      },
    },
  });

  const registerMutation = useRegister();

  const logoutMutation = useLogout({
    mutation: {
      onSuccess: () => {
        queryClient.setQueryData(getMeQueryKey, null);
        queryClient.clear();
      },
    },
  });

  return {
    user: getMeQuery.data?.data,
    isPending: getMeQuery.isPending,
    error: getMeQuery.error,

    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,

    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,

    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
  };
};
