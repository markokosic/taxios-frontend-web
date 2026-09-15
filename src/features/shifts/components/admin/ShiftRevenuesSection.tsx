import { useTranslation } from 'react-i18next';
import { Alert, Skeleton, Stack } from '@mantine/core';
import { DriverShiftRevenuesCard } from '../driver/DriverShiftRevenuesCard';
import { DriverWeeklyRentCard } from '../driver/DriverWeeklyRentCard';
import { DriverShiftFlatRateOption } from '../../domain/shift-calculations';

interface ShiftRevenuesSectionProps {
  driverSelected?: boolean;
  flatRateOptions?: DriverShiftFlatRateOption[];
  hasCashRides?: boolean;
  hasWeeklyConfig?: boolean;
  weeklyConfig?: any;
  isLoading?: boolean;
}

export const ShiftRevenuesSection = ({
  driverSelected = true,
  flatRateOptions = [],
  hasCashRides = false,
  hasWeeklyConfig = false,
  weeklyConfig,
  isLoading = false,
}: ShiftRevenuesSectionProps) => {
  const { t } = useTranslation(['app', 'common']);

  if (!driverSelected) {
    return (
      <Alert color="blue" variant="light" radius="md">
        {t('app:shifts.select_driver_hint', 'Bitte wählen Sie zuerst einen Fahrer aus')}
      </Alert>
    );
  }

  if (isLoading && flatRateOptions.length === 0 && !hasCashRides) {
    return (
      <Stack gap="sm">
        <Skeleton height={120} radius="md" />
        <Skeleton height={80} radius="md" />
      </Stack>
    );
  }

  return (
    <Stack gap="md">
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
  );
};

