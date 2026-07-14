import { Calendar, MessageSquareWarning, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Alert, Fieldset, Grid, Group, Text } from '@mantine/core';
import { ControlledDatePicker } from '@/components/ui/ControlledDatePicker/ControlledDatePicker';
import { ControlledNumberInput } from '@/components/ui/ControlledNumberInput/ControlledNumberInput';
import { ControlledCombobox } from '@/components/ui/ControlledSelect/ControlledCombobox';
import { ControlledTextInput } from '@/components/ui/ControlledTextInput/ControlledTextInput';
import { Driver, DriverId } from '@/features/drivers/drivers-types';
import { RemunerationModelType } from '@/features/remuneration/remuneration-types';
import { useCreateRevenueRecordRow } from '../hooks/useCreateRevenueRecordRow';

interface CreateRevenueRecordRowProps {
  index: number;
  remove: (index: number) => void;
  carOptions: { label: string; value: number }[];
  driverOptions: { label: string; value: DriverId }[];
  drivers: Driver[];
}

export const CreateRevenueRecordRow = ({
  index,
  remove,
  carOptions,
  driverOptions,
  drivers,
}: CreateRevenueRecordRowProps) => {
  const { t } = useTranslation(['app', 'common']);
  const {
    driverRemunerationConfigOptions,
    weekdayName,
    isWeeklyPaymentToday,
    isWeeklyFixedRate,
    driverId,
    selectedDriverRemunerationConfig,
    weeklyConfig,
  } = useCreateRevenueRecordRow({ index, drivers });

  return (
    <Fieldset
      legend={
        <Group
          justify="space-between"
          style={{ width: '100%' }}
        >
          <Text
            fw={700}
            size="lg"
            c="black"
          >
            {t('app:revenues.bulk.row_title', { index: index + 1 })}
          </Text>
          <ActionIcon
            color="red"
            variant="light"
            size="lg"
            onClick={() => remove(index)}
          >
            <Trash size={18} />
          </ActionIcon>
        </Group>
      }
      radius="md"
    >
      <Grid gutter="md">
        {/* --- ABSCHNITT 1: STAMMDATEN --- */}
        <Grid.Col span={12}>
          <Text
            fw={600}
            size="sm"
            c="dimmed"
          >
            {t('common:master_data' /* oder 'Stammdaten' */)}
          </Text>
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
            name={`dailyRevenueRecords.${index}.driverRemunerationType`}
            label={t('app:revenues.fields.revenue_type')}
            placeholder={t('app:revenues.fields.select_revenue_type')}
            data={[...driverRemunerationConfigOptions]}
            disabled={!driverId}
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

        {/* --- ABSCHNITT 2: ZEITEN & KILOMETER --- */}
        <Grid.Col
          span={12}
          mt="xs"
        >
          <Text
            fw={600}
            size="sm"
            c="dimmed"
          >
            {t('app:revenues.sections.route_and_times' /* oder 'Fahrstrecke & Zeiten' */)}
          </Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <ControlledDatePicker
            name={`dailyRevenueRecords.${index}.date`}
            label={t('common:date')}
            dropdownType="modal"
            placeholder={t('common:pick_date')}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <ControlledTextInput
            type="time"
            name={`dailyRevenueRecords.${index}.drivingStartTime`}
            label={t('app:revenues.fields.driven_from')}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <ControlledTextInput
            type="time"
            name={`dailyRevenueRecords.${index}.drivingEndTime`}
            label={t('app:revenues.fields.driven_to')}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <ControlledNumberInput
            min={0}
            suffix=" km"
            name={`dailyRevenueRecords.${index}.kilometersFrom`}
            label={t('app:revenues.fields.km_from')}
            placeholder="0"
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <ControlledNumberInput
            min={0}
            suffix=" km"
            name={`dailyRevenueRecords.${index}.kilometersTo`}
            label={t('app:revenues.fields.km_to')}
            placeholder="0"
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <ControlledNumberInput
            min={0}
            suffix=" km"
            name={`dailyRevenueRecords.${index}.kilometersDriven`}
            label={t('app:revenues.fields.kilometers_driven')}
            placeholder="0"
          />
        </Grid.Col>

        {/* --- ABSCHNITT 3: ABRECHNUNG & UMSATZ --- */}
        <Grid.Col
          span={12}
          mt="xs"
        >
          <Text
            fw={600}
            size="sm"
            c="dimmed"
          >
            {t('app:revenues.sections.billing' /* oder 'Umsatz & Abrechnung' */)}
          </Text>
        </Grid.Col>

        {selectedDriverRemunerationConfig === RemunerationModelType.FLAT_RATE && (
          <>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <ControlledNumberInput
                min={0}
                name={`dailyRevenueRecords.${index}.tripCount`}
                label={t('app:revenues.fields.trip_count')}
                placeholder="0"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <ControlledNumberInput
                min={0}
                suffix=" €"
                name={`dailyRevenueRecords.${index}.pricePerTrip`}
                label={t('app:revenues.fields.price_per_trip')}
                placeholder="0"
              />
            </Grid.Col>
          </>
        )}

        <Grid.Col
          span={{
            base: 12,
            md:
              selectedDriverRemunerationConfig === RemunerationModelType.FLAT_RATE ||
              isWeeklyFixedRate
                ? 4
                : 12,
          }}
        >
          <ControlledNumberInput
            suffix=" €"
            name={`dailyRevenueRecords.${index}.revenue`}
            label={t('common:revenue')}
            decimalScale={2}
            fixedDecimalScale
            placeholder={t('common:enter_amount')}
          />
        </Grid.Col>

        {isWeeklyFixedRate && (
          <Grid.Col span={{ base: 12, md: 4 }}>
            <ControlledNumberInput
              suffix=" €"
              name={`dailyRevenueRecords.${index}.companyRemuneration`}
              decimalScale={2}
              fixedDecimalScale
              label={t('app:revenues.fields.weekly_company_share')}
              placeholder={t('common:enter_amount')}
            />
          </Grid.Col>
        )}
      </Grid>
      {isWeeklyFixedRate && (
        <Alert
          mt="lg"
          variant="light"
          color={isWeeklyPaymentToday ? 'red' : 'blue'}
          title={
            isWeeklyPaymentToday
              ? t('app:revenues.fields.share_due_today')
              : t('app:revenues.fields.share_due_on', { day: weekdayName })
          }
          icon={isWeeklyPaymentToday ? <MessageSquareWarning /> : <Calendar />}
        >
          {isWeeklyPaymentToday && weeklyConfig && (
            <Text size="sm">
              {t('app:revenues.fields.auto_set_message', {
                amount: weeklyConfig.weeklyFixedCompanySettlement,
              })}
            </Text>
          )}
        </Alert>
      )}
    </Fieldset>
  );
};
