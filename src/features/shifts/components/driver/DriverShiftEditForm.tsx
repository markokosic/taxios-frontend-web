import { useTranslation } from 'react-i18next';
import { Button, Stack } from '@mantine/core';
import {
  ShiftResponse,
  ShiftRevenueEntryResponseEntryCategory,
  WeeklyFixedRateRemunerationResponse,
} from '@/api/generated/model';
import { useCarSelectOptions } from '@/features/cars/hooks/useCarOptions';
import { Form } from '@/shared/components/forms/Form';
import { useDriverUpdateShiftForm } from '../../hooks/driver/useDriverUpdateShiftForm';
import { DriverShiftMasterDataCard } from './DriverShiftMasterDataCard';
import { DriverShiftFlatRateOption, DriverShiftRevenuesCard } from './DriverShiftRevenuesCard';
import { DriverWeeklyRentCard } from './DriverWeeklyRentCard';
import { RemunerationModelType } from '@/features/drivers/domain/remuneration-types';
import { extractShiftFlatRateOptions } from '../../utils/shift-options.utils';

interface DriverShiftEditFormProps {
  shift: ShiftResponse;
}

export const DriverShiftEditForm = ({ shift }: DriverShiftEditFormProps) => {
  const { t } = useTranslation(['app', 'common']);
  const { carOptions, isLoading: isLoadingCars } = useCarSelectOptions();

  const appliedConfigs = shift.appliedRemunerationConfigs || [];
  const weeklyConfig = appliedConfigs.find(
    (c) => c.remunerationModelType === RemunerationModelType.WEEKLY_FIXED_RATE
  ) as WeeklyFixedRateRemunerationResponse | undefined;

  const hasWeeklyConfig = Boolean(
    weeklyConfig || shift.weeklyDriverRent != null || (shift.revenues || []).some(
      (r) => r.entryCategory === ShiftRevenueEntryResponseEntryCategory.WEEKLY
    )
  );

  const flatRateOptions: DriverShiftFlatRateOption[] = extractShiftFlatRateOptions(
    shift.appliedRemunerationConfigs,
    t('app:flatrate.general', 'Pauschalfahrt')
  );

  const hasCashRides = true; // Cash rides are always editable for historical shifts
  const { methods, onSubmit, isPending, cancel } = useDriverUpdateShiftForm({ shift });

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
            {t('common:actions.save', 'Änderungen speichern')}
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
