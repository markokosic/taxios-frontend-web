import { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Grid, Paper, Text, TextInput } from '@mantine/core';
import { ControlledDateTimePicker } from '@/shared/components/forms/ControlledDateTimePicker';
import { ControlledNumberInput } from '@/shared/components/forms/ControlledNumberInput';
import { FormSelect } from '@/shared/components/forms/ControlledSelect';
import { CarOption } from '@/features/cars/utils/car-options.utils';
import { DriverOption } from '@/features/drivers/utils/driver-options.utils';
import {
  calculateKilometersDriven,
  calculateShiftDuration,
} from '../../domain/shift-calculations';

interface ShiftMasterDataSectionProps {
  driverOptions: DriverOption[];
  carOptions: CarOption[];
  isLoadingDrivers: boolean;
  isLoadingCars: boolean;
  isEdit?: boolean;
}

export const ShiftMasterDataSection = ({
  driverOptions,
  carOptions,
  isLoadingDrivers,
  isLoadingCars,
  isEdit = false,
}: ShiftMasterDataSectionProps) => {
  const { t } = useTranslation(['app', 'common']);

  const { setValue } = useFormContext();
  const [odometerStart, odometerEnd, shiftStart, shiftEnd] = useWatch({
    name: ['odometerStart', 'odometerEnd', 'shiftStart', 'shiftEnd', 'driverId'],
  });

  const calculatedKm = calculateKilometersDriven(odometerStart, odometerEnd);
  const calculatedDuration = calculateShiftDuration(shiftStart, shiftEnd);

  const previousShiftStartRef = useRef<string | undefined>(undefined);

  // When shiftStart is selected, automatically prefill shiftEnd with +12 hours
  useEffect(() => {
    if (shiftStart && shiftStart !== previousShiftStartRef.current) {
      const start = dayjs(shiftStart);
      if (start.isValid()) {
        setValue('shiftEnd', start.add(12, 'hour').format('YYYY-MM-DDTHH:mm:ss'), { shouldValidate: true });
      }
      previousShiftStartRef.current = shiftStart;
    }
  }, [shiftStart, setValue]);

  return (
    <Paper
      withBorder
      p="md"
      radius="md"
    >
      <Grid>
        <Grid.Col span={12}>
          <Text
            fw={600}
            size="sm"
            c="dimmed"
          >
            {t('common:master_data')}
          </Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <FormSelect
            withAsterisk
            isNumber
            name="driverId"
            label={t('common:driver')}
            placeholder={t('common:select_driver')}
            data={driverOptions}
            disabled={isLoadingDrivers || isEdit}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <FormSelect
            withAsterisk
            isNumber
            name="carId"
            label={t('common:car')}
            placeholder={t('common:select_car')}
            data={carOptions}
            disabled={isLoadingCars || isEdit}
          />
        </Grid.Col>

        <Grid.Col
          span={12}
          mt="xs"
        >
          <Text
            fw={600}
            size="sm"
            c="dimmed"
          >
            {t('app:revenues.sections.route_and_times')}
          </Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <ControlledDateTimePicker
            withAsterisk
            highlightToday
            name="shiftStart"
            label={t('app:shifts.fields.shift_start.label')}
            placeholder={t('app:shifts.fields.shift_start.placeholder')}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <ControlledDateTimePicker
            withAsterisk
            highlightToday
            name="shiftEnd"
            label={t('app:shifts.fields.shift_end.label')}
            placeholder={t('app:shifts.fields.shift_end.placeholder')}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <TextInput
            label={t('app:shifts.fields.duration.label', 'Berechnete Schichtdauer')}
            value={calculatedDuration ? calculatedDuration.text : '-'}
            readOnly
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <ControlledNumberInput
            withAsterisk
            name="odometerStart"
            label={t('app:shifts.fields.odometer_start.label')}
            placeholder="0"
            min={0}
            suffix=" km"
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <ControlledNumberInput
            withAsterisk
            name="odometerEnd"
            label={t('app:shifts.fields.odometer_end.label')}
            placeholder="0"
            min={0}
            suffix=" km"
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <TextInput
            label={t('app:shifts.fields.kilometers_driven.label', 'Gefahrene Kilometer')}
            value={calculatedKm !== null ? `${calculatedKm} km` : '-'}
            readOnly
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};
