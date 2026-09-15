import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Resolver, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
  CreateDriverMutationBody,
  getGetAllDriversForSelectQueryKey,
  getGetAllDriversQueryKey,
  useCreateDriver,
} from '@/api/generated/endpoints/drivers/drivers';
import { ROUTES } from '@/config/routes';
import { getCreateDriverSchema } from '../domain/drivers-schemas';


import { normalizeRemunerationConfigForPayload } from '../utils/driver-form.utils';

export const useDriverCreateForm = () => {
  const { t } = useTranslation(['app', 'common', 'errors']);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useCreateDriver({
    mutation: {
      onSuccess: (response) => {
        toast.success(t('app:drivers.notifications.create.success'));
        queryClient.invalidateQueries({ queryKey: getGetAllDriversQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAllDriversForSelectQueryKey() });
        const newId = response.data?.id;
        if (newId) {
          navigate(ROUTES.app.drivers.view.getHref(newId));
        } else {
          navigate(ROUTES.app.drivers.path);
        }
      },
      onError: (error: unknown) => {
        const apiErrorMessage =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          t('errors:common.unknown');
        toast.error(apiErrorMessage);
      },
    },
  });

  const methods = useForm<CreateDriverMutationBody>({
    resolver: zodResolver(getCreateDriverSchema(t)) as unknown as Resolver<CreateDriverMutationBody>,
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      remunerationConfigs: [],
    },
  });

  const onSubmit = (data: CreateDriverMutationBody) => {
    mutate({ data: normalizeRemunerationConfigForPayload(data) });
  };

  return {
    methods,
    onSubmit,
    isPending,
  };
};
