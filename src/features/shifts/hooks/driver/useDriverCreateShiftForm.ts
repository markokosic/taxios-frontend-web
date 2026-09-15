import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
  getGetMyShiftsInfiniteQueryKey,
  getGetMyShiftsQueryKey,
  useCreateMyShift,
} from '@/api/generated/endpoints/shifts/shifts';
import { ROUTES } from '@/config/routes';
import { DriverShiftFlatRateOption } from '../../components/driver/DriverShiftRevenuesCard';
import {
  transformShiftFormPayload,
} from '../../domain/shift-calculations';
import {
  DriverCreateShiftFormValues,
  getDriverCreateShiftSchema,
} from '../../domain/driver-shift-schemas';

export const useDriverCreateShiftForm = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(['app', 'common', 'errors']);
  const navigate = useNavigate();

  const methods = useForm<DriverCreateShiftFormValues>({
    resolver: zodResolver(getDriverCreateShiftSchema(t)) as any,
    mode: 'onChange',
    defaultValues: {
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

  const { mutate, isPending } = useCreateMyShift({
    mutation: {
      onSuccess: () => {
        toast.success(t('app:shifts.notifications.create.success', 'Schicht erfolgreich erstellt'));
        queryClient.invalidateQueries({ queryKey: getGetMyShiftsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetMyShiftsInfiniteQueryKey() });
        navigate(ROUTES.app.driver.shifts.path);
      },
      onError: (error: unknown) => {
        const apiErrorMessage =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          t('errors:common.unknown', 'Ein Fehler ist aufgetreten');
        toast.error(apiErrorMessage);
      },
    },
  });

  const onSubmit = (
    values: DriverCreateShiftFormValues,
    flatRateTypes: DriverShiftFlatRateOption[],
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
    cancel: () => navigate(ROUTES.app.driver.shifts.path),
  };
};
