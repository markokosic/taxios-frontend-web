import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useEffect } from 'react';
import { Calendar, MessageSquareWarning, Trash } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';
import { ActionIcon, Alert, Box, Grid, Group, Paper, Stack, Text } from '@mantine/core';
import { ControlledDatePicker } from '@/components/ui/ControlledDatePicker/ControlledDatePicker';
import { ControlledNumberInput } from '@/components/ui/ControlledNumberInput/ControlledNumberInput';
import { ControlledCombobox } from '@/components/ui/ControlledSelect/ControlledCombobox';
import { RemunerationModelType } from '@/features/remuneration/remuneration-types';

dayjs.extend(isoWeek);

interface CreateRevenueRecordRowProps {
  index: number;
  remove: (index: number) => void;
  carOptions: { label: string; value: string }[];
  driverOptions: { label: string; value: string }[];
  drivers: any;
}

export const CreateRevenueRecordRow = ({
  index,
  remove,
  carOptions,
  driverOptions,
  drivers,
}: CreateRevenueRecordRowProps) => {
  const { control, getValues, setValue } = useFormContext();

  const driverId = useWatch({
    name: `dailyRevenueRecords.${index}.driverId`,
    control,
  });

  const driver = drivers?.find((d: any) => d.id === driverId);
  const driverConfig = driver?.currentRemunerationConfig;
  const hasWeeklyPayment =
    driverConfig?.remunerationModelType === RemunerationModelType.WEEKLY_FIXED_RATE;

  const isWeeklyPaymentToday =
    hasWeeklyPayment && driverConfig.settlementDay === dayjs().isoWeekday();

  const weekdayName = hasWeeklyPayment
    ? dayjs().isoWeekday(driverConfig.settlementDay).format('dddd')
    : null;

  useEffect(() => {
    if (isWeeklyPaymentToday && driverConfig) {
      const currentVal = getValues(`dailyRevenueRecords.${index}.companyRemuneration`);
      if (currentVal !== driverConfig.weeklyFixedCompanySettlement) {
        setValue(
          `dailyRevenueRecords.${index}.companyRemuneration`,
          driverConfig.weeklyFixedCompanySettlement,
          { shouldValidate: true }
        );
      }
    }
  }, [driverId, isWeeklyPaymentToday, index, setValue, getValues, driverConfig]);


  //TODO: Firmenanteil wird nicht korrekt gesetzt?
  
  return (
    <Paper
      withBorder
      radius="md"
    >
      <Box p="md">
        <Grid>
          <Grid.Col span={12}>
            <Group justify="space-between">
              <Text fw={700}>Tagesumsatz #{index + 1}</Text>
              <ActionIcon
                color="red"
                variant="light"
                size="lg"
                onClick={() => remove(index)}
              >
                <Trash size={18} />
              </ActionIcon>
            </Group>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <ControlledCombobox
              name={`dailyRevenueRecords.${index}.driverId`}
              label="Fahrer"
              placeholder="Wähle Fahrer"
              data={driverOptions}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <ControlledCombobox
              name={`dailyRevenueRecords.${index}.licencePlate`}
              label="Fahrzeug"
              placeholder="Wähle Fahrzeug"
              data={carOptions}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ControlledDatePicker
              name={`dailyRevenueRecords.${index}.date`}
              label="Datum"
              dropdownType="modal"
              placeholder="Datum wählen"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ControlledNumberInput
              min={0}
              suffix=" km"
              name={`dailyRevenueRecords.${index}.kilometersDriven`}
              label="Gefahrene Km"
              placeholder="0"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ControlledNumberInput
              min={0}
              suffix=" €"
              name={`dailyRevenueRecords.${index}.revenue`}
              label="Umsatz"
              placeholder="0.00"
            />
          </Grid.Col>

          {hasWeeklyPayment && (
            <Grid.Col span={{ base: 12, md: 4 }}>
              <ControlledNumberInput
                suffix=" €"
                name={`dailyRevenueRecords.${index}.companyRemuneration`}
                label="Firmenanteil"
                placeholder="0.00"
              />
            </Grid.Col>
          )}
        </Grid>
        {hasWeeklyPayment && (
          <Alert
            mt="lg"
            variant="light"
            color={isWeeklyPaymentToday ? 'red' : 'blue'}
            title={
              isWeeklyPaymentToday
                ? 'Firmenanteil heute fällig'
                : `Firmenanteil fällig am ${weekdayName}`
            }
            icon={isWeeklyPaymentToday ? <MessageSquareWarning /> : <Calendar />}
          >
            {isWeeklyPaymentToday && (
              <Text size="sm">
                Der Betrag wurde automatisch auf {driverConfig.weeklyFixedCompanySettlement}€
                gesetzt.
              </Text>
            )}
          </Alert>
        )}
      </Box>
    </Paper>
  );
};
