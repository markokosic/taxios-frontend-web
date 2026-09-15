import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
  getGetAllShiftsQueryKey,
  getGetShiftByIdQueryKey,
  useUpdateShift,
  useApproveShift,
} from '@/api/generated/endpoints/shifts/shifts';
import { ShiftResponse } from '@/api/generated/model';
import { ROUTES } from '@/config/routes';
import {
  DriverShiftFlatRateOption,
  extractFormValuesFromShift,
  transformUpdateShiftPayload,
} from '@/features/shifts/domain/shift-calculations';
import {
  getCreateShiftSchema,
  UpdateShiftFormValues,
} from '@/features/shifts/domain/shifts-schemas';

export const useAdminUpdateShiftForm = (shift: ShiftResponse) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(['app', 'common', 'errors']);
  const navigate = useNavigate();

  const extractedValues = extractFormValuesFromShift(shift);

  const methods = useForm<UpdateShiftFormValues>({
    resolver: zodResolver(getCreateShiftSchema(t)) as any,
    mode: 'onChange',
    defaultValues: {
      driverId: shift.driver?.id as number,
      carId: shift.car?.id as number,
      shiftStart: shift.shiftStart || '',
      shiftEnd: shift.shiftEnd || '',
      odometerStart: shift.odometerStart as number,
      odometerEnd: shift.odometerEnd as number,
      ...extractedValues,
    },
  });

  const approveRef = React.useRef(false);
  const { mutate: approveMutate } = useApproveShift({
    mutation: {
      onSuccess: () => {
        toast.success(t('app:shifts.notifications.edit_and_approve.success', 'Schicht aktualisiert und freigegeben'));
        if (shift.id) {
          queryClient.invalidateQueries({ queryKey: getGetShiftByIdQueryKey(shift.id) });
        }
        queryClient.invalidateQueries({ queryKey: getGetAllShiftsQueryKey() });
        navigate(ROUTES.app.shifts.path);
      },
      onError: () => toast.error(t('app:shifts.notifications.approve.error', 'Fehler bei der Freigabe')),
    },
  });

  const { mutate, isPending } = useUpdateShift({
    mutation: {
      onSuccess: () => {
        if (approveRef.current && shift.id) {
          approveMutate({ id: shift.id });
        } else {
          toast.success(t('app:shifts.notifications.edit.success', 'Schicht erfolgreich aktualisiert'));
          if (shift.id) {
            queryClient.invalidateQueries({ queryKey: getGetShiftByIdQueryKey(shift.id) });
          }
          queryClient.invalidateQueries({ queryKey: getGetAllShiftsQueryKey() });
          navigate(shift.id ? ROUTES.app.shifts.view.getHref(shift.id) : ROUTES.app.shifts.path);
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

  const onSubmit = (
    values: UpdateShiftFormValues,
    flatRateTypes: DriverShiftFlatRateOption[] = [],
    hasWeeklyConfig: boolean = false,
    approve: boolean = false
  ) => {
    approveRef.current = approve;
    if (!shift.id) {
      return;
    }
    
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

    mutate({ id: shift.id, data: payload });
  };

  return {
    methods,
    onSubmit,
    isPending,
    cancel: () =>
      shift.id
        ? navigate(ROUTES.app.shifts.view.getHref(shift.id))
        : navigate(ROUTES.app.shifts.path),
  };
};
