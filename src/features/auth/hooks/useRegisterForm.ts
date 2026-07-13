import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import z from 'zod';
import { ROUTES } from '@/config/routes';
import { getRegisterFormSchema } from '@/features/auth/schema';
import { useAuth } from '@/features/auth/hooks/useAuth';

type FormValues = z.infer<ReturnType<typeof getRegisterFormSchema>>;

export const useRegisterForm = () => {
  const { t } = useTranslation(['app', 'errors']);
  const navigate = useNavigate();

  const schema = getRegisterFormSchema(t);

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tenantName: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
  });

  const { register, isRegistering } = useAuth();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    register(
      {
        data: {
          tenantName: data.tenantName,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
        },
      },
      {
        onSuccess: () => {
          navigate(ROUTES.auth.login.path);
          toast.success(t('app:auth.register.success'));
        },
        onError: (error) => {
          toast.error("error");
        },
      }
    );
  };

  return {
    methods,
    onSubmit,
    isPending: isRegistering,
  };
};
