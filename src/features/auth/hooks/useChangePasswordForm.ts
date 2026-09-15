import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ROUTES } from '@/config/routes';
import { getChangePasswordFormSchema } from '../domain/auth-schemas';
import { useAuth } from './useAuth';

export interface UseChangePasswordFormOptions {
  onSuccess?: () => void;
}

export type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const useChangePasswordForm = (options?: UseChangePasswordFormOptions) => {
  const { t } = useTranslation(['app', 'common', 'errors']);
  const navigate = useNavigate();
  const schema = getChangePasswordFormSchema(t);

  const methods = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { changePassword, isChangingPassword } = useAuth();

  const onSubmit: SubmitHandler<ChangePasswordFormValues> = (data) => {
    if (isChangingPassword) {
      return;
    }

    changePassword(
      {
        data: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
      },
      {
        onSuccess: () => {
          toast.success(t('app:auth.changePassword.success'));
          if (options?.onSuccess) {
            options.onSuccess();
          } else {
            navigate(ROUTES.app.dashboard.getHref());
          }
        },
        onError: (error: unknown) => {
          const apiErrorMessage =
            (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            t('app:auth.changePassword.error');
          toast.error(apiErrorMessage);
        },
      }
    );
  };

  return {
    methods,
    onSubmit,
    isPending: isChangingPassword,
  };
};
