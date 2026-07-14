import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { getGetAllDailyRevenuesQueryKey, useUpdateDailyRevenue } from '@/api/generated/endpoints/revenues/revenues';
import {
  Car,
  CreateDailyRevenueRequestDriverRemunerationType,
  DriverResponse,
} from '@/api/generated/model';
import { Driver } from '@/features/drivers/drivers-types';
import { FlatRateRemunerationConfig, RemunerationModelType, WeeklyFixedRemunerationConfig } from '@/features/remuneration/remuneration-types';
import { getCreateRevenueRecordSchema } from '../revenues-schemas';


dayjs.extend(isoWeek);

interface UseRevenueEditFormProps {
  revenue: any;
  drivers: Driver[];
  cars: Car[];
  onSuccess: () => void;
}

export const useRevenueEditForm = ({ revenue, drivers, cars, onSuccess }: UseRevenueEditFormProps) => {
  const { t } = useTranslation(['app', 'common', 'errors']);
  const queryClient = useQueryClient();

  const carOptions =
    cars?.map((car) => ({
      label: `${car.licensePlate} ${car.model} ${car.brand}`,
      value: car.id!,
    })) ?? [];

  const driverOptions =
    drivers?.map((driver) => ({
      label: `${driver.firstName} ${driver.lastName}`,
      value: driver.id!,
    })) ?? [];

  const { mutate, isPending } = useUpdateDailyRevenue({
    mutation: {
      onSuccess: () => {
        toast.success(t('common:actions.confirm'));
        queryClient.invalidateQueries({ queryKey: getGetAllDailyRevenuesQueryKey() });
        onSuccess();
      },
      onError: (err: any) => {
        const apiErrorMessage = err?.response?.data?.message || err.message || t('errors:common.unknown');
        toast.error(apiErrorMessage);
      },
    },
  });

  const methods = useForm({
    resolver: zodResolver(getCreateRevenueRecordSchema(t)),
    shouldUnregister: true,
    mode: 'onChange',
    defaultValues: {
      driverId: revenue.driver?.id ?? revenue.driverId ?? undefined,
      carId: revenue.car?.id ?? revenue.carId ?? undefined,
      date: revenue.date ? dayjs(revenue.date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      kilometersDriven: revenue.kilometersDriven ?? undefined,
      kilometersFrom: revenue.kilometersFrom ?? undefined,
      kilometersTo: revenue.kilometersTo ?? undefined,
      drivingStartTime: revenue.drivingStartTime ? revenue.drivingStartTime.substring(0, 5) : undefined,
      drivingEndTime: revenue.drivingEndTime ? revenue.drivingEndTime.substring(0, 5) : undefined,
      driverRemunerationType: revenue.remunerationModelType ?? undefined,
      revenue: revenue.revenue ?? undefined,
      tripCount: revenue.tripCount ?? undefined,
      pricePerTrip: revenue.pricePerTrip ?? undefined,
      companyRemuneration: revenue.companyRemuneration ?? undefined,
    },
  });

  const { control, setValue, resetField } = methods;

  const driverId = useWatch({ name: 'driverId', control });
  const selectedDriverRemunerationConfig = useWatch({ name: 'driverRemunerationType', control });
  const tripCount = useWatch({ name: 'tripCount', control });
  const pricePerTrip = useWatch({ name: 'pricePerTrip', control });
  const kilometersFrom = useWatch({ name: 'kilometersFrom', control });
  const kilometersTo = useWatch({ name: 'kilometersTo', control });

  const i18nDriverRemunerationConfigMap: Record<RemunerationModelType, string> = {
    [CreateDailyRevenueRequestDriverRemunerationType.PERCENTAGE_SHARE]: 'percentageShare',
    [CreateDailyRevenueRequestDriverRemunerationType.WEEKLY_FIXED_RATE]: 'weeklyFixedRate',
    [CreateDailyRevenueRequestDriverRemunerationType.FLAT_RATE]: 'flatRate',
  };

  const driver:DriverResponse = drivers?.find((d) => d.id === driverId);

  const driverRemunerationConfigOptions =
    driver?.currentRemunerationConfigs?.map((config : CreateDailyRevenueRequestDriverRemunerationType) => ({
      label: `${t(`app:remuneration.type.${i18nDriverRemunerationConfigMap[config.remunerationModelType]}`)}`,
      value: config.remunerationModelType,
    })) ?? [];

  const selectedConfig = driver?.currentRemunerationConfigs?.find(
    (c) => c.remunerationModelType === selectedDriverRemunerationConfig
  );

  const isWeeklyFixedRate =
    selectedDriverRemunerationConfig === RemunerationModelType.WEEKLY_FIXED_RATE;
  const weeklyConfig = isWeeklyFixedRate ? (selectedConfig as WeeklyFixedRemunerationConfig) : null;
  const isWeeklyPaymentToday = weeklyConfig && weeklyConfig.settlementDay === dayjs().isoWeekday();
  const weekdayName = weeklyConfig
    ? dayjs().isoWeekday(weeklyConfig.settlementDay).format('dddd')
    : null;

  // Sync revenue for flat rate
  useEffect(() => {
    if (
      selectedDriverRemunerationConfig === RemunerationModelType.FLAT_RATE &&
      tripCount &&
      pricePerTrip
    ) {
      setValue('revenue', tripCount * pricePerTrip, { shouldValidate: true });
    }
  }, [selectedDriverRemunerationConfig, tripCount, pricePerTrip, setValue]);

  // Pre-fill pricePerTrip for Flat Rate from config if not already set
  useEffect(() => {
    if (
      selectedDriverRemunerationConfig === RemunerationModelType.FLAT_RATE &&
      selectedConfig &&
      'flatRateFee' in selectedConfig
    ) {
      const flatRateConfig = selectedConfig as FlatRateRemunerationConfig;
      if (pricePerTrip === undefined || pricePerTrip === null) {
        setValue('pricePerTrip', flatRateConfig.flatRateFee, { shouldValidate: true });
      }
    }
  }, [selectedDriverRemunerationConfig, selectedConfig, pricePerTrip, setValue]);

  // Set default remuneration type if driver has only one config
  useEffect(() => {
    if (driver?.currentRemunerationConfigs?.length === 1) {
      setValue(
        'driverRemunerationType',
        driver.currentRemunerationConfigs[0].remunerationModelType,
        {
          shouldValidate: true,
        }
      );
    }
  }, [driver, setValue]);

  // Calculate kilometers driven
  useEffect(() => {
    if (
      kilometersFrom !== undefined &&
      kilometersTo !== undefined &&
      kilometersFrom !== null &&
      kilometersTo !== null
    ) {
      const diff = kilometersTo - kilometersFrom;
      if (diff >= 0) {
        setValue('kilometersDriven', diff, { shouldValidate: true });
      }
    }
  }, [kilometersFrom, kilometersTo, setValue]);

  // Set weekly fixed rate settlement
  useEffect(() => {
    if (isWeeklyFixedRate && isWeeklyPaymentToday && weeklyConfig) {
      setValue('companyRemuneration', weeklyConfig.weeklyFixedCompanySettlement, {
        shouldValidate: true,
      });
    } else {
      resetField('companyRemuneration');
    }
  }, [isWeeklyFixedRate, isWeeklyPaymentToday, weeklyConfig, resetField, setValue]);

  const onSubmit = (data: any) => {
    mutate({ id: revenue.id, data });
  };

  return {
    methods,
    onSubmit,
    isPending,
    carOptions,
    driverOptions,
    driverRemunerationConfigOptions,
    weekdayName,
    isWeeklyPaymentToday,
    isWeeklyFixedRate,
    driverId,
    selectedDriverRemunerationConfig,
  };
};
