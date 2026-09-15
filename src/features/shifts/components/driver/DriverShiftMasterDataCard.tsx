import { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Card, SimpleGrid, Stack, Text } from '@mantine/core';
import { ControlledDateTimePicker } from '@/shared/components/forms/ControlledDateTimePicker';
import { ControlledNumberInput } from '@/shared/components/forms/ControlledNumberInput';
import { FormSelect } from '@/shared/components/forms/ControlledSelect';
import { CarOption } from '@/features/cars/utils/car-options.utils';

interface DriverShiftMasterDataCardProps {
  carOptions: CarOption[];
  isLoadingCars: boolean;
}

export const DriverShiftMasterDataCard = ({
  carOptions,
  isLoadingCars,
}: DriverShiftMasterDataCardProps) => {
  const { t } = useTranslation(['app', 'common']);
  const { setValue } = useFormContext();

  const [shiftStart] = useWatch({
    name: ['shiftStart'],
  });

  const previousShiftStartRef = useRef<string | undefined>(undefined);

  // When shiftStart is selected, automatically prefill shiftEnd with +12 hours
  // The driver can still freely edit shiftEnd afterwards at any time
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
    <Card
      withBorder
      radius="md"
      p="md"
      shadow="xs"
    >
      <Stack gap="md">
        <FormSelect
          withAsterisk
          isNumber
          name="carId"
          label={t('common:car', 'Fahrzeug')}
          placeholder={t('common:select_car', 'Fahrzeug auswählen')}
          data={carOptions}
          disabled={isLoadingCars}
        />

        <div>
          <Text
            fw={600}
            size="sm"
            mb="xs"
          >
            Zeiten eintragen
          </Text>
          <SimpleGrid
            cols={{ base: 1, sm: 2 }}
            spacing="xs"
          >
            <ControlledDateTimePicker
              withAsterisk
              highlightToday
              name="shiftStart"
              label={t('app:shifts.fields.shift_start.label', 'Schichtbeginn')}
              placeholder={t('app:shifts.fields.shift_start.placeholder', 'Beginn wählen')}
            />

            <ControlledDateTimePicker
              withAsterisk
              highlightToday
              name="shiftEnd"
              label={t('app:shifts.fields.shift_end.label', 'Schichtende')}
              placeholder={t('app:shifts.fields.shift_end.placeholder', 'Ende wählen')}
            />
          </SimpleGrid>
        </div>

        <div>
          <Text
            fw={600}
            size="sm"
            mb="xs"
          >
            Tachostand eintragen
          </Text>
          <SimpleGrid
            cols={{ base: 1, sm: 2 }}
            spacing="xs"
          >
            <ControlledNumberInput
              withAsterisk
              name="odometerStart"
              label={t('app:shifts.fields.odometer_start.label', 'Tacho Beginn')}
              placeholder="0"
              min={0}
              suffix=" km"
            />

            <ControlledNumberInput
              withAsterisk
              name="odometerEnd"
              label={t('app:shifts.fields.odometer_end.label', 'Tacho Ende')}
              placeholder="0"
              min={0}
              suffix=" km"
            />
          </SimpleGrid>
        </div>
      </Stack>
    </Card>
  );
};
