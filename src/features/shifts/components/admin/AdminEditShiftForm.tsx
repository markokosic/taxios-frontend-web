import { useTranslation } from 'react-i18next';
import { Button, Stack } from '@mantine/core';
import { ShiftResponse, ShiftResponseStatus } from '@/api/generated/model';
import { Form } from '@/shared/components/forms/Form';
import { useAdminUpdateShiftForm } from '../../hooks/admin/useAdminUpdateShiftForm';
import { DriverShiftFlatRateOption } from '../../domain/shift-calculations';
import { ShiftMasterDataSection } from './ShiftMasterDataSection';
import { ShiftRevenuesSection } from './ShiftRevenuesSection';
import { mapCarsToOptions } from '@/features/cars/utils/car-options.utils';
import { mapDriversToOptions } from '@/features/drivers/utils/driver-options.utils';
import { RemunerationModelType } from '@/features/drivers/domain/remuneration-types';
import { extractShiftFlatRateOptions } from '../../utils/shift-options.utils';

interface AdminEditShiftFormProps {
  shift: ShiftResponse;
}

export const AdminEditShiftForm = ({ shift }: AdminEditShiftFormProps) => {
  const { t } = useTranslation(['app', 'common']);

  const { methods, onSubmit, isPending, cancel } = useAdminUpdateShiftForm(shift);

  const selectedDriverId = shift.driver?.id;

  const driverOptions = mapDriversToOptions(shift.driver);
  const carOptions = mapCarsToOptions(shift.car);

  const flatRateOptions: DriverShiftFlatRateOption[] = extractShiftFlatRateOptions(
    shift.appliedRemunerationConfigs,
    t('app:flatrate.general', 'Pauschalfahrt')
  );

  const appliedConfigs = shift.appliedRemunerationConfigs || [];
  const weeklyConfig = appliedConfigs.find(
    (c) => c.remunerationModelType === RemunerationModelType.WEEKLY_FIXED_RATE
  );

  const finalHasWeeklyConfig = Boolean(weeklyConfig);
  const finalWeeklyConfig = weeklyConfig;
  const finalHasCashRides = true; // Cash rides are always adjustable in edit mode

  return (
    <Form
      methods={methods as any}
      onSubmit={(values: any) => onSubmit(values, flatRateOptions, finalHasWeeklyConfig)}
      formActions={
        <>
          <Button
            variant="outline"
            onClick={cancel}
          >
            {t('common:actions.cancel')}
          </Button>
          {shift.status === ShiftResponseStatus.PENDING && (
            <Button
              variant="light"
              color="teal"
              onClick={methods.handleSubmit((values: any) => onSubmit(values, flatRateOptions, finalHasWeeklyConfig, true))}
              loading={isPending}
              disabled={isPending}
            >
              {t('app:shifts.actions.save_and_approve', 'Speichern & Freigeben')}
            </Button>
          )}
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
          isLoadingDrivers={false}
          isLoadingCars={false}
          isEdit
        />

        <ShiftRevenuesSection
          driverSelected={Boolean(selectedDriverId)}
          flatRateOptions={flatRateOptions}
          hasCashRides={finalHasCashRides}
          hasWeeklyConfig={finalHasWeeklyConfig}
          weeklyConfig={finalWeeklyConfig}
        />
      </Stack>
    </Form>
  );
};

