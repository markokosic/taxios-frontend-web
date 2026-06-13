import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useEffect } from 'react';
import { Calendar, MessageSquareWarning, Trash } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Alert, Box, Fieldset, Grid, Group, Paper, Stack, Text } from '@mantine/core';
import { ControlledDatePicker } from '@/components/ui/ControlledDatePicker/ControlledDatePicker';
import { ControlledNumberInput } from '@/components/ui/ControlledNumberInput/ControlledNumberInput';
import { ControlledCombobox } from '@/components/ui/ControlledSelect/ControlledCombobox';
import { ControlledTextInput } from '@/components/ui/ControlledTextInput/ControlledTextInput';
import { FieldGroup } from '@/components/ui/Form';
import { Driver, DriverId } from '@/features/drivers/drivers-types';
import {
  RemunerationModelType,
  WeeklyFixedRemunerationConfig,
} from '@/features/remuneration/remuneration-types';

dayjs.extend(isoWeek);

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
  const { t } = useTranslation(['revenues', 'common']);
  const { control, setValue, resetField } = useFormContext();

  const driverId = useWatch({
    name: `dailyRevenueRecords.${index}.driverId`,
    control,
  });

  const selectedDriverRemunerationConfig = useWatch({
    name: `dailyRevenueRecords.${index}.driverRemunerationType`,
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

  const kilometersFrom = useWatch({
    name: `dailyRevenueRecords.${index}.kilometersFrom`,
    control,
  });

  const kilometersTo = useWatch({
    name: `dailyRevenueRecords.${index}.kilometersTo`,
    control,
  });

  const i18nDriverRemunerationConfigMap: Record<RemunerationModelType, string> = {
    [RemunerationModelType.PERCENTAGE_SHARE]: 'percentageShare',
    [RemunerationModelType.WEEKLY_FIXED_RATE]: 'weeklyFixedRate',
    [RemunerationModelType.FLAT_RATE]: 'flatRate',
  };

  const driver = drivers?.find((d: any) => d.id === driverId);

  const driverRemunerationConfigOptions =
    driver?.currentRemunerationConfigs?.map((config) => ({
      label: `${t(`remuneration:type.${i18nDriverRemunerationConfigMap[config.remunerationModelType]}`)} `,
      value: config.remunerationModelType,
    })) ?? [];

  const selectedConfig = driver?.currentRemunerationConfigs?.find(
    (c) => c.remunerationModelType === selectedDriverRemunerationConfig
  );

  const isWeeklyFixedRate =
    selectedDriverRemunerationConfig === RemunerationModelType.WEEKLY_FIXED_RATE;
  const weeklyConfig = isWeeklyFixedRate ? (selectedConfig as WeeklyFixedRemunerationConfig) : null;

  const isWeeklyPaymentToday = weeklyConfig && weeklyConfig.settlementDay === dayjs().isoWeekday();

  const weekdayName = weeklyConfig
    ? dayjs().isoWeekday(weeklyConfig.settlementDay).format('dddd')
    : null;

  useEffect(() => {
    if (
      selectedDriverRemunerationConfig === RemunerationModelType.FLAT_RATE &&
      tripCount &&
      pricePerTrip
    ) {
      setValue(`dailyRevenueRecords.${index}.revenue`, tripCount * pricePerTrip, {
        shouldValidate: true,
      });
    }
  }, [selectedDriverRemunerationConfig, tripCount, pricePerTrip, index, setValue]);

  useEffect(() => {
    if (driver?.currentRemunerationConfigs?.length === 1) {
      setValue(
        `dailyRevenueRecords.${index}.driverRemunerationType`,
        driver.currentRemunerationConfigs[0].remunerationModelType,
        { shouldValidate: true }
      );
    }
  }, [driver, index, setValue]);

  useEffect(() => {
    if (
      kilometersFrom !== undefined &&
      kilometersTo !== undefined &&
      kilometersFrom !== null &&
      kilometersTo !== null
    ) {
      const diff = kilometersTo - kilometersFrom;
      if (diff >= 0) {
        setValue(`dailyRevenueRecords.${index}.kilometersDriven`, diff, { shouldValidate: true });
      }
    }
  }, [kilometersFrom, kilometersTo, index, setValue]);

  useEffect(() => {
    if (isWeeklyFixedRate && isWeeklyPaymentToday && weeklyConfig) {
      setValue(
        `dailyRevenueRecords.${index}.companyRemuneration`,
        weeklyConfig.weeklyFixedCompanySettlement,
        { shouldValidate: true }
      );
    } else {
      resetField(`dailyRevenueRecords.${index}.companyRemuneration`);
    }
  }, [isWeeklyFixedRate, isWeeklyPaymentToday, weeklyConfig, index, resetField, setValue]);

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
          >
            {t('revenues:bulk.row_title', { index: index + 1 })}
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
            label={t('revenues:fields.revenue_type')}
            placeholder={t('revenues:fields.select_revenue_type')}
            data={[...driverRemunerationConfigOptions]}
            disabled={!driver}
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
            {t('revenues:sections.route_and_times' /* oder 'Fahrstrecke & Zeiten' */)}
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
            name={`dailyRevenueRecords.${index}.drivenFrom`}
            label={t('revenues:fields.driven_from')}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <ControlledTextInput
            type="time"
            name={`dailyRevenueRecords.${index}.drivenTo`}
            label={t('revenues:fields.driven_to')}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <ControlledNumberInput
            min={0}
            suffix=" km"
            name={`dailyRevenueRecords.${index}.kilometersFrom`}
            label={t('revenues:fields.km_from')}
            placeholder="0"
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <ControlledNumberInput
            min={0}
            suffix=" km"
            name={`dailyRevenueRecords.${index}.kilometersTo`}
            label={t('revenues:fields.km_to')}
            placeholder="0"
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <ControlledNumberInput
            min={0}
            suffix=" km"
            name={`dailyRevenueRecords.${index}.kilometersDriven`}
            label={t('revenues:fields.kilometers_driven')}
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
            {t('revenues:sections.billing' /* oder 'Umsatz & Abrechnung' */)}
          </Text>
        </Grid.Col>

        {selectedDriverRemunerationConfig === RemunerationModelType.FLAT_RATE && (
          <>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <ControlledNumberInput
                min={0}
                name={`dailyRevenueRecords.${index}.tripCount`}
                label={t('revenues:fields.trip_count')}
                placeholder="0"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
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
              label={t('revenues:fields.weekly_company_share')}
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
              ? t('revenues:fields.share_due_today')
              : t('revenues:fields.share_due_on', { day: weekdayName })
          }
          icon={isWeeklyPaymentToday ? <MessageSquareWarning /> : <Calendar />}
        >
          {isWeeklyPaymentToday && weeklyConfig && (
            <Text size="sm">
              {t('revenues:fields.auto_set_message', {
                amount: weeklyConfig.weeklyFixedCompanySettlement,
              })}
            </Text>
          )}
        </Alert>
      )}
    </Fieldset>
  );
};
