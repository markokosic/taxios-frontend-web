import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { getGetAllDriversQueryKey, getGetDriverQueryKey, UpdateDriverMutationBody, useUpdateDriver } from '@/api/generated/endpoints/drivers/drivers';
import { DriverResponse } from '@/api/generated/model';
import { UpdateDriverBody } from '@/api/generated/zod/drivers/drivers';


interface UseDriverUpdateFormProps {
  driver: DriverResponse;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export const useDriverUpdateForm = ({ driver, onCancel: _onCancel, onSuccess }: UseDriverUpdateFormProps) => {
  const { t } = useTranslation(['app', 'common', 'errors']);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useUpdateDriver({
    mutation: {
      onSuccess: () => {
        toast.success(t('app:drivers.notifications.edit.success'));
        queryClient.invalidateQueries({ queryKey: getGetDriverQueryKey(driver.id!) });
        queryClient.invalidateQueries({ queryKey: getGetAllDriversQueryKey() });
        onSuccess?.();
      },
      onError: (error: any) => {
        const apiErrorMessage = error?.response?.data?.message || t('errors:common.unknown');
        toast.error(apiErrorMessage);
      },
    },
  });

  const methods = useForm<UpdateDriverMutationBody>({
    resolver: zodResolver(UpdateDriverBody),
    mode: 'onChange',
    defaultValues: {
      firstName: driver.firstName,
      lastName: driver.lastName,
      phone: driver.phone,
      email: driver.email,
      remunerationConfigs: driver.currentRemunerationConfigs ? [...driver.currentRemunerationConfigs] : [],
    } as any,
  });

  const onSubmit = (data: UpdateDriverMutationBody) => {
    if (driver.id !== undefined) {
      mutate({ id: driver.id, data });
    }
  };

  return {
    methods,
    onSubmit,
    isPending,
  };
};
