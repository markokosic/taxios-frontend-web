import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import z from 'zod';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { LoginBody } from '@/api/generated/zod/authentication/authentication';
import { ROUTES } from '@/config/routes';


type FormValues = z.infer<typeof LoginBody>;

export const useLoginForm = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();

  const methods = useForm<FormValues>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { login, isLoggingIn } = useAuth();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (isLoggingIn) {
      return;
    }

    login(
      { data },
      {
        onSuccess: () => {
          toast.success(t('auth.login.success'));
          navigate(ROUTES.app.dashboard.getHref());
        },
        onError: (error: any) => {
          const apiErrorMessage = error?.response?.data?.message || t('auth.login.error');
          toast.error(apiErrorMessage);
        },
      }
    );
  };

  return {
    methods,
    onSubmit,
    isPending: isLoggingIn,
  };
};
