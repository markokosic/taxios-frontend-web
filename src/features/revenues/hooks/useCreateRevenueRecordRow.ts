import { useEffect } from 'react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  FlatRateRemunerationConfig,
  RemunerationModelType,
  WeeklyFixedRemunerationConfig,
} from '@/features/remuneration/remuneration-types';
import { DriverResponse } from '@/api/generated/model';

dayjs.extend(isoWeek);

interface UseCreateRevenueRecordRowProps {
  index: number;
  drivers: DriverResponse[];
}

const i18nDriverRemunerationConfigMap: Record<RemunerationModelType, string> = {
  [RemunerationModelType.PERCENTAGE_SHARE]: 'percentageShare',
  [RemunerationModelType.WEEKLY_FIXED_RATE]: 'weeklyFixedRate',
  [RemunerationModelType.FLAT_RATE]: 'flatRate',
};

export const useCreateRevenueRecordRow = ({ index, drivers }: UseCreateRevenueRecordRowProps) => {
  const { t } = useTranslation(['app', 'common']);
  const { control, setValue, resetField } = useFormContext();

  const driverId = useWatch({
    name: `dailyRevenueRecords.${index}.driverId`,
    control,
  });

  const selectedDriverRemunerationConfig = useWatch({
    name: `dailyRevenueRecords.${index}.driverRemunerationType`,
    control,
  });

  const tripCount = useWatch({
    name: `dailyRevenueRecords.${index}.tripCount`,
    control,
  });

  const pricePerTrip = useWatch({
    name: `dailyRevenueRecords.${index}.pricePerTrip`,
    control,
  });

  const kilometersFrom = useWatch({
    name: `dailyRevenueRecords.${index}.kilometersFrom`,
    control,
  });

  const kilometersTo = useWatch({
    name: `dailyRevenueRecords.${index}.kilometersTo`,
    control,
  });



  const driver = drivers?.find((d) => d.id === driverId);

  const driverRemunerationConfigOptions =
    driver?.currentRemunerationConfigs?.map((config) => ({
      label: `${t(`app:remuneration.type.${i18nDriverRemunerationConfigMap[config.remunerationModelType]}`)} `,
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

  // 1. Sync revenue for flat rate
  useEffect(() => {
    if (
      selectedDriverRemunerationConfig === RemunerationModelType.FLAT_RATE &&
      tripCount &&
      pricePerTrip
    ) {
      setValue(`dailyRevenueRecords.${index}.revenue`, tripCount * pricePerTrip, {
        shouldValidate: true,
      });
    }
  }, [selectedDriverRemunerationConfig, tripCount, pricePerTrip, index, setValue]);

  // 2. Pre-fill pricePerTrip for Flat Rate from config if not already set
  useEffect(() => {
    if (
      selectedDriverRemunerationConfig === RemunerationModelType.FLAT_RATE &&
      selectedConfig &&
      'flatRateFee' in selectedConfig
    ) {
      const flatRateConfig = selectedConfig as FlatRateRemunerationConfig;
      if (pricePerTrip === undefined || pricePerTrip === null) {
        setValue(`dailyRevenueRecords.${index}.pricePerTrip`, flatRateConfig.flatRateFee, {
          shouldValidate: true,
        });
      }
    }
  }, [selectedDriverRemunerationConfig, selectedConfig, pricePerTrip, index, setValue]);

  // 3. Set default remuneration type if driver has only one config
  useEffect(() => {
    if (driver?.currentRemunerationConfigs?.length === 1) {
      setValue(
        `dailyRevenueRecords.${index}.driverRemunerationType`,
        driver.currentRemunerationConfigs[0].remunerationModelType,
        { shouldValidate: true }
      );
    }
  }, [driver, index, setValue]);

  // 4. Calculate kilometers driven
  useEffect(() => {
    if (
      kilometersFrom !== undefined &&
      kilometersTo !== undefined &&
      kilometersFrom !== null &&
      kilometersTo !== null
    ) {
      const diff = kilometersTo - kilometersFrom;
      if (diff >= 0) {
        setValue(`dailyRevenueRecords.${index}.kilometersDriven`, diff, { shouldValidate: true });
      }
    }
  }, [kilometersFrom, kilometersTo, index, setValue]);

  // 5. Set weekly fixed rate settlement
  useEffect(() => {
    if (isWeeklyFixedRate && isWeeklyPaymentToday && weeklyConfig) {
      setValue(
        `dailyRevenueRecords.${index}.companyRemuneration`,
        weeklyConfig.weeklyFixedCompanySettlement,
        { shouldValidate: true }
      );
    } else {
      resetField(`dailyRevenueRecords.${index}.companyRemuneration`);
    }
  }, [isWeeklyFixedRate, isWeeklyPaymentToday, weeklyConfig, index, resetField, setValue]);

  return {
    driverRemunerationConfigOptions,
    weekdayName,
    isWeeklyPaymentToday,
    isWeeklyFixedRate,
    driverId,
    selectedDriverRemunerationConfig,
    weeklyConfig,
  };
};
