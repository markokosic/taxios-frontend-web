import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Button, Grid, Stack, Alert, Text, Box } from '@mantine/core';
import { Calendar, MessageSquareWarning } from 'lucide-react';
import { Form } from '@/components/ui/Form';
import { ControlledDatePicker } from '@/components/ui/ControlledDatePicker/ControlledDatePicker';
import { ControlledNumberInput } from '@/components/ui/ControlledNumberInput/ControlledNumberInput';
import { ControlledCombobox } from '@/components/ui/ControlledSelect/ControlledCombobox';
import { ControlledTextInput } from '@/components/ui/ControlledTextInput/ControlledTextInput';
import { Driver } from '@/features/drivers/drivers-types';
import { Car } from '@/features/cars/cars-types';
import { RemunerationModelType, WeeklyFixedRemunerationConfig } from '@/features/remuneration/remuneration-types';
import { useUpdateRevenue } from '../hooks/useUpdateRevenue';
import { getCreateRevenueRecordSchema } from '../revenues-schemas';

dayjs.extend(isoWeek);

interface RevenueEditFormProps {
  revenue: any; // DailyRevenue type
  drivers: Driver[];
  cars: Car[];
  onCancel: () => void;
  onSuccess: () => void;
}

export const RevenueEditForm = ({
  revenue,
  drivers,
  cars,
  onCancel,
  onSuccess,
}: RevenueEditFormProps) => {
  const { t } = useTranslation(['revenues', 'common', 'errors']);
  const { mutate, isPending } = useUpdateRevenue();

  const carOptions =
    cars?.map((car) => ({
      label: `${car.licensePlate} ${car.model} ${car.brand}`,
      value: car.id,
    })) ?? [];

  const driverOptions =
    drivers?.map((driver) => ({
      label: `${driver.firstName} ${driver.lastName}`,
      value: driver.id,
    })) ?? [];

  const methods = useForm({
    resolver: zodResolver(getCreateRevenueRecordSchema(t)),
    mode: 'onChange',
    defaultValues: {
      driverId: revenue.driverId ?? undefined,
      carId: revenue.carId ?? undefined,
      date: revenue.date ? dayjs(revenue.date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      kilometersDriven: revenue.kilometersDriven ?? undefined,
      kilometersFrom: revenue.kilometersFrom ?? undefined,
      kilometersTo: revenue.kilometersTo ?? undefined,
      drivenFrom: revenue.drivingStartTime ? revenue.drivingStartTime.substring(0, 5) : undefined,
      drivenTo: revenue.drivingEndTime ? revenue.drivingEndTime.substring(0, 5) : undefined,
      driverRemunerationType: revenue.remunerationModelType ?? undefined,
      revenue: revenue.revenue ?? undefined,
      tripCount: revenue.tripCount ?? undefined,
      pricePerTrip: revenue.pricePerTrip ?? undefined,
      companyRemuneration: revenue.companyRemuneration ?? undefined,
    },
  });

  const { control, setValue, resetField } = methods;

  const driverId = useWatch({ name: 'driverId', control });
  const selectedDriverRemunerationConfig = useWatch({ name: 'driverRemunerationType', control });
  const tripCount = useWatch({ name: 'tripCount', control });
  const pricePerTrip = useWatch({ name: 'pricePerTrip', control });
  const kilometersFrom = useWatch({ name: 'kilometersFrom', control });
  const kilometersTo = useWatch({ name: 'kilometersTo', control });

  const i18nDriverRemunerationConfigMap: Record<RemunerationModelType, string> = {
    [RemunerationModelType.PERCENTAGE_SHARE]: 'percentageShare',
    [RemunerationModelType.WEEKLY_FIXED_RATE]: 'weeklyFixedRate',
    [RemunerationModelType.FLAT_RATE]: 'flatRate',
  };

  const driver = drivers?.find((d) => d.id === driverId);

  const driverRemunerationConfigOptions =
    driver?.currentRemunerationConfigs?.map((config) => ({
      label: `${t(`remuneration:type.${i18nDriverRemunerationConfigMap[config.remunerationModelType]}`)}`,
      value: config.remunerationModelType,
    })) ?? [];

  const selectedConfig = driver?.currentRemunerationConfigs?.find(
    (c) => c.remunerationModelType === selectedDriverRemunerationConfig
  );

  const isWeeklyFixedRate = selectedDriverRemunerationConfig === RemunerationModelType.WEEKLY_FIXED_RATE;
  const weeklyConfig = isWeeklyFixedRate ? (selectedConfig as WeeklyFixedRemunerationConfig) : null;
  const isWeeklyPaymentToday = weeklyConfig && weeklyConfig.settlementDay === dayjs().isoWeekday();
  const weekdayName = weeklyConfig ? dayjs().isoWeekday(weeklyConfig.settlementDay).format('dddd') : null;

  // Sync revenue for flat rate
  useEffect(() => {
    if (
      selectedDriverRemunerationConfig === RemunerationModelType.FLAT_RATE &&
      tripCount &&
      pricePerTrip
    ) {
      setValue('revenue', tripCount * pricePerTrip, { shouldValidate: true });
    }
  }, [selectedDriverRemunerationConfig, tripCount, pricePerTrip, setValue]);

  // Set default remuneration type if driver has only one config
  useEffect(() => {
    if (driver?.currentRemunerationConfigs?.length === 1) {
      setValue('driverRemunerationType', driver.currentRemunerationConfigs[0].remunerationModelType, {
        shouldValidate: true,
      });
    }
  }, [driver, setValue]);

  // Calculate kilometers driven
  useEffect(() => {
    if (
      kilometersFrom !== undefined &&
      kilometersTo !== undefined &&
      kilometersFrom !== null &&
      kilometersTo !== null
    ) {
      const diff = kilometersTo - kilometersFrom;
      if (diff >= 0) {
        setValue('kilometersDriven', diff, { shouldValidate: true });
      }
    }
  }, [kilometersFrom, kilometersTo, setValue]);

  // Set weekly fixed rate settlement
  useEffect(() => {
    if (isWeeklyFixedRate && isWeeklyPaymentToday && weeklyConfig) {
      setValue('companyRemuneration', weeklyConfig.weeklyFixedCompanySettlement, {
        shouldValidate: true,
      });
    } else {
      resetField('companyRemuneration');
    }
  }, [isWeeklyFixedRate, isWeeklyPaymentToday, weeklyConfig, resetField, setValue]);

  const onSubmit = (data: any) => {
    mutate(
      { id: revenue.id, payload: data },
      {
        onSuccess: () => {
          toast.success(t('common:actions.confirm'));
          onSuccess();
        },
        onError: (err) => {
          toast.error(err.message || 'Error updating revenue');
        },
      }
    );
  };

  const formIsValid = methods.formState.isValid;

  return (
    <Box p="xs">
      <Form
        methods={methods}
        onSubmit={onSubmit}
        formActions={
          <>
            <Button
              variant="outline"
              onClick={onCancel}
            >
              {t('common:actions.cancel')}
            </Button>
            <Button
              type="submit"
              loading={isPending}
              disabled={!formIsValid || isPending}
            >
              {t('common:actions.save')}
            </Button>
          </>
        }
      >
        <Grid gutter="md">
          {/* Stammdaten */}
          <Grid.Col span={12}>
            <Text
              fw={600}
              size="sm"
              c="dimmed"
            >
              {t('common:master_data')}
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ControlledCombobox
              name="driverId"
              label={t('common:driver')}
              placeholder={t('common:select_driver')}
              data={driverOptions}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ControlledCombobox
              name="driverRemunerationType"
              label={t('revenues:fields.revenue_type')}
              placeholder={t('revenues:fields.select_revenue_type')}
              data={driverRemunerationConfigOptions}
              disabled={!driver}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ControlledCombobox
              name="carId"
              label={t('common:car')}
              placeholder={t('common:select_car')}
              data={carOptions}
            />
          </Grid.Col>

          {/* Fahrstrecke & Zeiten */}
          <Grid.Col span={12} mt="xs">
            <Text
              fw={600}
              size="sm"
              c="dimmed"
            >
              {t('revenues:sections.route_and_times')}
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ControlledDatePicker
              name="date"
              label={t('common:date')}
              dropdownType="modal"
              placeholder={t('common:pick_date')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ControlledTextInput
              type="time"
              name="drivenFrom"
              label={t('revenues:fields.driven_from')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ControlledTextInput
              type="time"
              name="drivenTo"
              label={t('revenues:fields.driven_to')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ControlledNumberInput
              min={0}
              suffix=" km"
              name="kilometersFrom"
              label={t('revenues:fields.km_from')}
              placeholder="0"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ControlledNumberInput
              min={0}
              suffix=" km"
              name="kilometersTo"
              label={t('revenues:fields.km_to')}
              placeholder="0"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ControlledNumberInput
              min={0}
              suffix=" km"
              name="kilometersDriven"
              label={t('revenues:fields.kilometers_driven')}
              placeholder="0"
            />
          </Grid.Col>

          {/* Umsatz & Abrechnung */}
          <Grid.Col span={12} mt="xs">
            <Text
              fw={600}
              size="sm"
              c="dimmed"
            >
              {t('revenues:sections.billing')}
            </Text>
          </Grid.Col>

          {selectedDriverRemunerationConfig === RemunerationModelType.FLAT_RATE && (
            <>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <ControlledNumberInput
                  min={0}
                  name="tripCount"
                  label={t('revenues:fields.trip_count')}
                  placeholder="0"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <ControlledNumberInput
                  min={0}
                  suffix=" €"
                  name="pricePerTrip"
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
              name="revenue"
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
                name="companyRemuneration"
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
      </Form>
    </Box>
  );
};
