import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { getGetAllShiftsQueryKey, useCreateShift } from '@/api/generated/endpoints/shifts/shifts';
import {
  DriverShiftFlatRateOption,
  transformShiftFormPayload,
} from '../../domain/shift-calculations';
import { CreateShiftFormValues, getCreateShiftSchema } from '../../domain/shifts-schemas';

export const useAdminCreateShiftForm = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(['app', 'common', 'errors']);
  const navigate = useNavigate();

  const methods = useForm<CreateShiftFormValues>({
    resolver: zodResolver(getCreateShiftSchema(t)) as any,
    mode: 'onChange',
    defaultValues: {
      driverId: undefined as unknown as number,
      carId: undefined as unknown as number,
      shiftStart: '',
      shiftEnd: '',
      odometerStart: undefined as unknown as number,
      odometerEnd: undefined as unknown as number,
      singleRides: [],
      flatRateCounts: {},
      flatRatePrices: {},
      weeklyRentPaid: undefined as unknown as number,
    },
  });

  const { mutate, isPending } = useCreateShift({
    mutation: {
      onSuccess: () => {
        toast.success(t('app:shifts.notifications.create.success'));
        queryClient.invalidateQueries({ queryKey: getGetAllShiftsQueryKey() });
        navigate(-1);
      },
      onError: (error: unknown) => {
        const apiErrorMessage =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          t('errors:common.unknown');
        toast.error(apiErrorMessage);
      },
    },
  });

  const onSubmit = (
    values: CreateShiftFormValues,
    flatRateTypes: DriverShiftFlatRateOption[] = [],
    hasWeeklyConfig: boolean = false
  ) => {
    if (hasWeeklyConfig && (values.weeklyRentPaid === undefined || values.weeklyRentPaid === null || String(values.weeklyRentPaid) === '')) {
      methods.setError('weeklyRentPaid', {
        type: 'manual',
        message: t('app:shifts.errors.weekly_rent_required'),
      });
      return;
    }

    const payload = transformShiftFormPayload(values, flatRateTypes);

    if (payload.revenues.length === 0) {
      toast.error(t('app:shifts.errors.at_least_one_revenue'));
      return;
    }

    mutate({ data: payload });
  };

  return {
    methods,
    onSubmit,
    isPending,
    cancel: () => navigate(-1),
  };
};
