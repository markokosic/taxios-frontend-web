import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useEffect } from 'react';
import { Calendar, MessageSquareWarning, Trash } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Alert, Box, Grid, Group, Paper, Stack, Text } from '@mantine/core';
import { ControlledDatePicker } from '@/components/ui/ControlledDatePicker/ControlledDatePicker';
import { ControlledNumberInput } from '@/components/ui/ControlledNumberInput/ControlledNumberInput';
import { ControlledCombobox } from '@/components/ui/ControlledSelect/ControlledCombobox';
import { ControlledTextInput } from '@/components/ui/ControlledTextInput/ControlledTextInput';
import { DriverId } from '@/features/drivers/drivers-types';
import { RevenueType } from '@/features/revenues/revenues-types';

dayjs.extend(isoWeek);

interface CreateRevenueRecordRowProps {
  index: number;
  remove: (index: number) => void;
  carOptions: { label: string; value: number }[];
  driverOptions: { label: string; value: DriverId }[];
  drivers: any;
}

export const CreateRevenueRecordRow = ({
  index,
  remove,
  carOptions,
  driverOptions,
  drivers,
}: CreateRevenueRecordRowProps) => {
  const { t } = useTranslation(['revenues', 'common']);
  const { control, setValue, resetField } = useFormContext();

  const driverId = useWatch({
    name: `dailyRevenueRecords.${index}.driverId`,
    control,
  });

  const revenueType = useWatch({
    name: `dailyRevenueRecords.${index}.revenueType`,
    control,
  });

  const tripCount = useWatch({
    name: `dailyRevenueRecords.${index}.tripCount`,
    control,
  });

  const pricePerTrip = useWatch({
    name: `dailyRevenueRecords.${index}.pricePerTrip`,
    control,
  });

  useEffect(() => {
    if (revenueType === RevenueType.FLAT_RATE_TRIP && tripCount && pricePerTrip) {
      setValue(`dailyRevenueRecords.${index}.revenue`, tripCount * pricePerTrip);
    }
  }, [revenueType, tripCount, pricePerTrip, index, setValue]);

  const driver = drivers?.find((d: any) => d.id === driverId);
  const driverConfig = driver?.currentRemunerationConfig;

  return (
    <Paper
      withBorder
      w={{ base: '100%' }}
    >
      <Box p="md">
        <Grid>
          <Grid.Col span={12}>
            <Group justify="space-between">
              <Text fw={700}>{t('revenues:bulk.row_title', { index: index + 1 })}</Text>
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

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ControlledCombobox
              name={`dailyRevenueRecords.${index}.driverId`}
              label={t('common:driver')}
              placeholder={t('common:select_driver')}
              data={driverOptions}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ControlledCombobox
              name={`dailyRevenueRecords.${index}.carId`}
              label={t('common:car')}
              placeholder={t('common:select_car')}
              data={carOptions}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ControlledCombobox
              name={`dailyRevenueRecords.${index}.revenueType`}
              label={t('revenues:fields.revenue_type')}
              placeholder={t('revenues:fields.select_revenue_type')}
              data={[
                { label: t('revenues:types.manual'), value: RevenueType.MANUAL_DAILY_REVENUE },
                { label: t('revenues:types.flat_rate'), value: RevenueType.FLAT_RATE_TRIP },
              ]}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 3 }}>
            <ControlledDatePicker
              name={`dailyRevenueRecords.${index}.date`}
              label={t('common:date')}
              dropdownType="modal"
              placeholder={t('common:pick_date')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 3 }}>
            <ControlledNumberInput
              min={0}
              name={`dailyRevenueRecords.${index}.kilometersFrom`}
              label={t('revenues:fields.km_from')}
              placeholder="0"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 3 }}>
            <ControlledNumberInput
              min={0}
              name={`dailyRevenueRecords.${index}.kilometersTo`}
              label={t('revenues:fields.km_to')}
              placeholder="0"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 3 }}>
            <ControlledNumberInput
              min={0}
              suffix=" km"
              name={`dailyRevenueRecords.${index}.kilometersDriven`}
              label={t('revenues:fields.kilometers_driven')}
              placeholder="0"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 3 }}>
            <ControlledTextInput
              type="time"
              name={`dailyRevenueRecords.${index}.drivenFrom`}
              label={t('revenues:fields.driven_from')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 3 }}>
            <ControlledTextInput
              type="time"
              name={`dailyRevenueRecords.${index}.drivenTo`}
              label={t('revenues:fields.driven_to')}
            />
          </Grid.Col>

          {revenueType === RevenueType.FLAT_RATE_TRIP && (
            <>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <ControlledNumberInput
                  min={0}
                  name={`dailyRevenueRecords.${index}.tripCount`}
                  label={t('revenues:fields.trip_count')}
                  placeholder="0"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <ControlledNumberInput
                  min={0}
                  suffix=" €"
                  name={`dailyRevenueRecords.${index}.pricePerTrip`}
                  label={t('revenues:fields.price_per_trip')}
                  placeholder="0"
                />
              </Grid.Col>
            </>
          )}

          <Grid.Col span={{ base: 12, md: 3 }}>
            <ControlledNumberInput
              suffix=" €"
              name={`dailyRevenueRecords.${index}.revenue`}
              label={t('common:revenue')}
              decimalScale={2}
              fixedDecimalScale
              placeholder={t('common:enter_amount')}
              readOnly={revenueType === RevenueType.FLAT_RATE_TRIP}
            />
          </Grid.Col>
        </Grid>
      </Box>
    </Paper>
  );
};
