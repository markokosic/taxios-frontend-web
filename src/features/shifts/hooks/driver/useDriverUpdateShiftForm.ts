import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
  getGetMyShiftByIdQueryKey,
  getGetMyShiftsInfiniteQueryKey,
  getGetMyShiftsQueryKey,
  useUpdateMyShift,
} from '@/api/generated/endpoints/shifts/shifts';
import { ShiftResponse } from '@/api/generated/model';
import { ROUTES } from '@/config/routes';
import { DriverShiftFlatRateOption } from '../../components/driver/DriverShiftRevenuesCard';
import {
  extractFormValuesFromShift,
  transformUpdateShiftPayload,
} from '../../domain/shift-calculations';
import {
  DriverCreateShiftFormValues,
  getDriverCreateShiftSchema,
} from '../../domain/driver-shift-schemas';

interface UseDriverUpdateShiftFormProps {
  shift: ShiftResponse;
}

export const useDriverUpdateShiftForm = ({ shift }: UseDriverUpdateShiftFormProps) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(['app', 'common', 'errors']);
  const navigate = useNavigate();

  const extractedValues = extractFormValuesFromShift(shift);

  const methods = useForm<DriverCreateShiftFormValues>({
    resolver: zodResolver(getDriverCreateShiftSchema(t)) as any,
    mode: 'onChange',
    defaultValues: {
      carId: shift.car?.id as unknown as number,
      shiftStart: shift.shiftStart ?? '',
      shiftEnd: shift.shiftEnd ?? '',
      odometerStart: shift.odometerStart ?? (undefined as unknown as number),
      odometerEnd: shift.odometerEnd ?? (undefined as unknown as number),
      ...extractedValues,
    },
  });

  const { mutate, isPending } = useUpdateMyShift({
    mutation: {
      onSuccess: () => {
        toast.success(
          t('app:shifts.notifications.update.success', 'Schicht erfolgreich aktualisiert')
        );
        if (shift.id) {
          queryClient.invalidateQueries({ queryKey: getGetMyShiftByIdQueryKey(shift.id) });
        }
        queryClient.invalidateQueries({ queryKey: getGetMyShiftsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetMyShiftsInfiniteQueryKey() });
        if (shift.id) {
          navigate(ROUTES.app.driver.shifts.view.getHref(shift.id));
        } else {
          navigate(ROUTES.app.driver.shifts.path);
        }
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
    if (!shift.id) {return;}

    if (hasWeeklyConfig && (values.weeklyRentPaid === undefined || values.weeklyRentPaid === null || String(values.weeklyRentPaid) === '')) {
      methods.setError('weeklyRentPaid', {
        type: 'manual',
        message: t('app:shifts.errors.weekly_rent_required'),
      });
      return;
    }

    const payload = transformUpdateShiftPayload(values, flatRateTypes, shift.revenues || []);

    if (payload.revenues.length === 0) {
      toast.error(t('app:shifts.errors.at_least_one_revenue'));
      return;
    }

    mutate({
      id: shift.id,
      data: payload,
    });
  };

  return {
    methods,
    onSubmit,
    isPending,
    cancel: () =>
      shift.id
        ? navigate(ROUTES.app.driver.shifts.view.getHref(shift.id))
        : navigate(ROUTES.app.driver.shifts.path),
  };
};
