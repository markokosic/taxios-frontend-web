import { useTranslation } from 'react-i18next';
import { useGetDriver } from '@/api/generated/endpoints/drivers/drivers';
import {
  FlatRateRemunerationResponse,
  WeeklyFixedRateRemunerationResponse,
} from '@/api/generated/model';
import { DriverShiftFlatRateOption } from '../domain/shift-calculations';
import { RemunerationModelType } from '@/features/drivers/domain/remuneration-types';

export const useDriverRemunerationConfig = (driverId?: number) => {
  const { t } = useTranslation(['app', 'common']);

  const validDriverId =
    typeof driverId === 'number' && !isNaN(driverId) && driverId > 0 ? driverId : undefined;

  const { data: driverResponse, isLoading } = useGetDriver(validDriverId as number, {
    query: {
      enabled: Boolean(validDriverId),
    },
  });

  const remunerationConfigs = driverResponse?.data?.currentRemunerationConfigs || [];

  const percentageConfig = remunerationConfigs.find(
    (c) => c.remunerationModelType === RemunerationModelType.PERCENTAGE_SHARE
  );

  const weeklyConfig = remunerationConfigs.find(
    (c) => c.remunerationModelType === RemunerationModelType.WEEKLY_FIXED_RATE
  ) as WeeklyFixedRateRemunerationResponse | undefined;

  const flatRateConfigs = remunerationConfigs.filter(
    (c) => c.remunerationModelType === RemunerationModelType.FLAT_RATE
  ) as FlatRateRemunerationResponse[];

  const hasCashRides = Boolean(
    percentageConfig || weeklyConfig || remunerationConfigs.length === 0
  );
  const hasWeeklyConfig = Boolean(weeklyConfig);

  const flatRateOptions: DriverShiftFlatRateOption[] = flatRateConfigs.map((c) => ({
    id: c.flatRateTypeId,
    name: c.flatRateTypeName || t('app:flatrate.general', 'Pauschalfahrt'),
    defaultPrice: c.defaultPrice,
  }));

  return {
    driver: driverResponse?.data,
    isLoading: Boolean(validDriverId && isLoading),
    remunerationConfigs,
    percentageConfig,
    weeklyConfig,
    flatRateConfigs,
    hasCashRides,
    hasWeeklyConfig,
    flatRateOptions,
  };
};
