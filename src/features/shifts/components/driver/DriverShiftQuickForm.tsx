import { useTranslation } from 'react-i18next';
import { Button, Stack } from '@mantine/core';
import { useGetMyDriverProfile } from '@/api/generated/endpoints/drivers/drivers';
import { WeeklyFixedRateRemunerationResponse } from '@/api/generated/model';
import { Form } from '@/shared/components/forms/Form';
import { useCarSelectOptions } from '@/features/cars/hooks/useCarOptions';
import { useDriverCreateShiftForm } from '../../hooks/driver/useDriverCreateShiftForm';
import { DriverShiftMasterDataCard } from './DriverShiftMasterDataCard';
import { buildShiftFlatRateOptions, hasCashRidesForConfigs } from '../../utils/shift-options.utils';
import { DriverShiftFlatRateOption, DriverShiftRevenuesCard } from './DriverShiftRevenuesCard';
import { DriverWeeklyRentCard } from './DriverWeeklyRentCard';

export const DriverShiftQuickForm = () => {
  const { t } = useTranslation(['app', 'common']);
  const { carOptions, isLoading: isLoadingCars } = useCarSelectOptions();
  const { data: driverResponse } = useGetMyDriverProfile();

  const remunerationConfigs = driverResponse?.data?.currentRemunerationConfigs || [];

  const weeklyConfig = remunerationConfigs.find(
    (c) => c.remunerationModelType === 'WEEKLY_FIXED_RATE'
  ) as WeeklyFixedRateRemunerationResponse | undefined;

  // Cash rides are available as soon as the driver has a base model (or none yet)
  const hasCashRides = hasCashRidesForConfigs(remunerationConfigs);
  const hasWeeklyConfig = Boolean(weeklyConfig);

  // Only the flat rides the admin explicitly allowed for this driver
  const flatRateOptions: DriverShiftFlatRateOption[] = buildShiftFlatRateOptions({
    allowedFlatRateTypes: driverResponse?.data?.allowedFlatRateTypes,
    fallbackName: t('app:flatrate.general', 'Pauschalfahrt'),
  });

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
