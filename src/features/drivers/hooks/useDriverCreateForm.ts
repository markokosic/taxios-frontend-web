import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { CreateDriverMutationBody, getGetAllDriversQueryKey, useCreateDriver } from '@/api/generated/endpoints/drivers/drivers';
import { ROUTES } from '@/config/routes';
import { CreateDriverBody } from '@/api/generated/zod/drivers/drivers';


export const useDriverCreateForm = () => {
  const { t } = useTranslation(['app', 'common', 'errors']);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useCreateDriver({
    mutation: {
      onSuccess: (response) => {
        const newId = response.data?.id;
        if (newId) {
          navigate(ROUTES.app.drivers.view.getHref(newId));
        } else {
          navigate(ROUTES.app.drivers.path);
        }
        toast.success(t('app:drivers.notifications.create.success'));
        queryClient.invalidateQueries({ queryKey: getGetAllDriversQueryKey() });
      },
      onError: (error: any) => {
        const apiErrorMessage = error?.response?.data?.message || t('errors:common.unknown');
        toast.error(apiErrorMessage);
      },
    },
  });

  const methods = useForm<CreateDriverMutationBody>({
    resolver: zodResolver(CreateDriverBody),
    shouldUnregister: true,
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      remunerationConfigs: [{}],
    } as any,
  });

  const onSubmit = (data: CreateDriverMutationBody) => {
    mutate({ data });
  };

  return {
    methods,
    onSubmit,
    isPending,
  };
};
