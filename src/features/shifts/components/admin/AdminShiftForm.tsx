import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Stack } from '@mantine/core';
import { Form } from '@/shared/components/forms/Form';
import { useCarSelectOptions } from '@/features/cars/hooks/useCarOptions';
import { useDriverSelectOptions } from '@/features/drivers/hooks/useDriverOptions';
import { useAdminCreateShiftForm } from '@/features/shifts/hooks/admin/useAdminCreateShiftForm';
import { useDriverRemunerationConfig } from '@/features/shifts/hooks/useDriverRemunerationConfig';
import { ShiftMasterDataSection } from './ShiftMasterDataSection';
import { ShiftRevenuesSection } from './ShiftRevenuesSection';

export const AdminShiftForm = () => {
  const { t } = useTranslation(['app', 'common']);
  const { driverOptions, isLoading: isLoadingDrivers } = useDriverSelectOptions();
  const { carOptions, isLoading: isLoadingCars } = useCarSelectOptions();

  const { methods, onSubmit, isPending, cancel } = useAdminCreateShiftForm();

  const selectedDriverId = methods.watch('driverId');
  const numericDriverId =
    selectedDriverId !== undefined && selectedDriverId !== null
      ? Number(selectedDriverId)
      : undefined;

  const previousDriverIdRef = useRef<number | undefined>(numericDriverId);

  useEffect(() => {
    if (
      previousDriverIdRef.current !== undefined &&
      previousDriverIdRef.current !== numericDriverId
    ) {
      methods.setValue('singleRides', [], { shouldValidate: true });
      methods.setValue('flatRateCounts', {}, { shouldValidate: true });
      methods.setValue('flatRatePrices', {}, { shouldValidate: true });
      methods.setValue('weeklyRentPaid', undefined, { shouldValidate: true });
    }
    previousDriverIdRef.current = numericDriverId;
  }, [numericDriverId, methods]);

  const {
    flatRateOptions,
    hasCashRides,
    hasWeeklyConfig,
    weeklyConfig,
    isLoading: isLoadingDriverConfig,
  } = useDriverRemunerationConfig(numericDriverId);

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
            {t('common:actions.cancel')}
          </Button>
          <Button
            type="submit"
            loading={isPending}
            disabled={isPending}
          >
            {t('common:actions.save')}
          </Button>
        </>
      }
    >
      <Stack gap="xl">
        <ShiftMasterDataSection
          driverOptions={driverOptions}
          carOptions={carOptions}
          isLoadingDrivers={isLoadingDrivers}
          isLoadingCars={isLoadingCars}
        />

        <ShiftRevenuesSection
          driverSelected={Boolean(numericDriverId)}
          flatRateOptions={flatRateOptions}
          hasCashRides={hasCashRides}
          hasWeeklyConfig={hasWeeklyConfig}
          weeklyConfig={weeklyConfig}
          isLoading={isLoadingDriverConfig}
        />
      </Stack>
    </Form>
  );
};
