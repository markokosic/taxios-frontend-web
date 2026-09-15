import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Resolver, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  getGetAllDriversForSelectQueryKey,
  getGetAllDriversQueryKey,
  getGetDriverQueryKey,
  getGetDriverRevenueOptionsQueryKey,
  UpdateDriverMutationBody,
  useUpdateDriver,
} from '@/api/generated/endpoints/drivers/drivers';
import { DriverResponse } from '@/api/generated/model';
import { getUpdateDriverSchema } from '../domain/drivers-schemas';
import {
  getDriverUpdateFormDefaultValues,
  normalizeRemunerationConfigForPayload,
} from '../utils/driver-form.utils';

interface UseDriverUpdateFormProps {
  driver: DriverResponse;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export const useDriverUpdateForm = ({
  driver,
  onCancel: _onCancel,
  onSuccess,
}: UseDriverUpdateFormProps) => {
  const { t } = useTranslation(['app', 'common', 'errors']);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useUpdateDriver({
    mutation: {
      onSuccess: () => {
        toast.success(t('app:drivers.notifications.edit.success'));
        queryClient.invalidateQueries({ queryKey: getGetDriverQueryKey(driver.id!) });
        queryClient.invalidateQueries({ queryKey: getGetAllDriversQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAllDriversForSelectQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDriverRevenueOptionsQueryKey(driver.id) });
        onSuccess?.();
      },
      onError: (error: unknown) => {
        const apiErrorMessage =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          t('errors:common.unknown');
        toast.error(apiErrorMessage);
      },
    },
  });

  const methods = useForm<UpdateDriverMutationBody>({
    resolver: zodResolver(
      getUpdateDriverSchema(t)
    ) as unknown as Resolver<UpdateDriverMutationBody>,
    mode: 'onChange',
    defaultValues: getDriverUpdateFormDefaultValues(driver),
  });

  const onSubmit = (data: UpdateDriverMutationBody) => {
    if (driver.id !== undefined) {
      mutate({ id: driver.id, data: normalizeRemunerationConfigForPayload(data) });
    }
  };

  return {
    methods,
    onSubmit,
    isPending,
  };
};
