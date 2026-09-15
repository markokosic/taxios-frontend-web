import { useQueryClient } from '@tanstack/react-query';
import {
  getGetMeQueryKey,
  useChangePassword,
  useGetMe,
  useLogin,
  useLogout,
  useRegister,
} from '@/api/generated/endpoints/authentication/authentication';
import type { ApiResponseMeResponse } from '@/api/generated/model';

const AUTH_STORAGE_KEY = 'auth_active';

export const isClientAuthenticated = (): boolean => {
  if (typeof window === 'undefined') {return false;}
  return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
};

export const setClientAuthenticated = (authenticated: boolean) => {
  if (typeof window === 'undefined') {return;}
  if (authenticated) {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  const getMeQueryKey = getGetMeQueryKey();
  const hasSession = isClientAuthenticated();

  const getMeQuery = useGetMe({
    query: {
      enabled: hasSession,
      retry: false,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  });

  // If the query fails with an auth error, clean up the local session flag and clear cache
  if (hasSession && getMeQuery.isError) {
    setClientAuthenticated(false);
    queryClient.clear();
  }

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (response) => {
        if (response.success && response.data) {
          setClientAuthenticated(true);
          const userData = response.data;
          queryClient.setQueryData<ApiResponseMeResponse>(getMeQueryKey, {
            success: true,
            data: {
              id: userData.id,
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              role: (userData.roles ?? 'DRIVER') as any,
              mustChangePassword: Boolean(userData.mustChangePassword),
            },
            message: response.message,
          });
        }
      },
    },
  });

  const changePasswordMutation = useChangePassword({
    mutation: {
      onSuccess: (response) => {
        if (response.success) {
          queryClient.setQueryData<ApiResponseMeResponse>(getMeQueryKey, (old) => {
            if (!old?.data) {return old;}
            return {
              ...old,
              data: {
                ...old.data,
                mustChangePassword: false,
              },
            };
          });
        }
        queryClient.invalidateQueries({ queryKey: getMeQueryKey });
      },
    },
  });

  const registerMutation = useRegister();

  const handleClearSession = () => {
    setClientAuthenticated(false);
    queryClient.clear();
  };

  const logoutMutation = useLogout({
    mutation: {
      onSuccess: () => {
        handleClearSession();
      },
      onError: () => {
        handleClearSession();
      },
    },
  });

  const user = hasSession ? getMeQuery.data?.data : null;
  const isPending = hasSession && getMeQuery.isPending;

  return {
    user,
    isAuthenticated: Boolean(hasSession && user),
    isPending,
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

    changePassword: changePasswordMutation.mutate,
    changePasswordAsync: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
  };
};
