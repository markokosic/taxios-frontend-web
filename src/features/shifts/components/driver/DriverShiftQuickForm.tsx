import { useTranslation } from 'react-i18next';
import { Button, Stack } from '@mantine/core';
import { useGetMyDriverProfile } from '@/api/generated/endpoints/drivers/drivers';
import {
  FlatRateRemunerationResponse,
  WeeklyFixedRateRemunerationResponse,
} from '@/api/generated/model';
import { Form } from '@/shared/components/forms/Form';
import { useCarSelectOptions } from '@/features/cars/hooks/useCarOptions';
import { useDriverCreateShiftForm } from '../../hooks/driver/useDriverCreateShiftForm';
import { DriverShiftMasterDataCard } from './DriverShiftMasterDataCard';
import { DriverShiftFlatRateOption, DriverShiftRevenuesCard } from './DriverShiftRevenuesCard';
import { DriverWeeklyRentCard } from './DriverWeeklyRentCard';

export const DriverShiftQuickForm = () => {
  const { t } = useTranslation(['app', 'common']);
  const { carOptions, isLoading: isLoadingCars } = useCarSelectOptions();
  const { data: driverResponse } = useGetMyDriverProfile();

  const remunerationConfigs = driverResponse?.data?.currentRemunerationConfigs || [];

  const percentageConfig = remunerationConfigs.find(
    (c) => c.remunerationModelType === 'PERCENTAGE_SHARE'
  );

  const weeklyConfig = remunerationConfigs.find(
    (c) => c.remunerationModelType === 'WEEKLY_FIXED_RATE'
  ) as WeeklyFixedRateRemunerationResponse | undefined;

  const flatRateConfigs = remunerationConfigs.filter(
    (c) => c.remunerationModelType === 'FLAT_RATE'
  ) as FlatRateRemunerationResponse[];

  // Cash Fahrten available if driver has percentage share or weekly fixed rate (or fallback if empty)
  const hasCashRides = Boolean(
    percentageConfig || weeklyConfig || remunerationConfigs.length === 0
  );
  const hasWeeklyConfig = Boolean(weeklyConfig);

  const flatRateOptions: DriverShiftFlatRateOption[] = flatRateConfigs.map((c) => ({
    id: c.flatRateTypeId,
    name: c.flatRateTypeName || t('app:flatrate.general', 'Pauschalfahrt'),
    defaultPrice: c.defaultPrice,
  }));

  const { methods, onSubmit, isPending, cancel } = useDriverCreateShiftForm();

  return (
    <Form
      methods={methods as any}
      onSubmit={(values: any) => onSubmit(values, flatRateOptions, hasWeeklyConfig)}
      formActions={
        <>
          <Button
            variant="outline"
            onClick={cancel}
          >
            {t('common:actions.cancel', 'Abbrechen')}
          </Button>
          <Button
            type="submit"
            loading={isPending}
            disabled={isPending}
          >
            {t('common:actions.save', 'Schicht speichern')}
          </Button>
        </>
      }
    >
      <Stack gap="md">
        <DriverShiftMasterDataCard
          carOptions={carOptions}
          isLoadingCars={isLoadingCars}
        />

        <DriverShiftRevenuesCard
          hasCashRides={hasCashRides}
          flatRateTypes={flatRateOptions}
        />

        {hasWeeklyConfig && (
          <DriverWeeklyRentCard
            defaultRentPrice={weeklyConfig?.weeklyFixedCompanySettlement}
            settlementDay={weeklyConfig?.settlementDay}
          />
        )}
      </Stack>
    </Form>
  );
};
