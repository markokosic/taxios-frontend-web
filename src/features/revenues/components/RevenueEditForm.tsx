import { Calendar, MessageSquareWarning } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Grid, Text } from '@mantine/core';
import { DailyRevenueResponse, DriverResponse } from '@/api/generated/model';
import { ControlledDatePicker } from '@/components/ui/ControlledDatePicker/ControlledDatePicker';
import { ControlledNumberInput } from '@/components/ui/ControlledNumberInput/ControlledNumberInput';
import { ControlledCombobox } from '@/components/ui/ControlledSelect/ControlledCombobox';
import { ControlledTextInput } from '@/components/ui/ControlledTextInput/ControlledTextInput';
import { Form } from '@/components/ui/Form';
import { RemunerationModelType } from '@/features/remuneration/remuneration-types';
import { useRevenueEditForm } from '../hooks/useRevenueEditForm';


interface RevenueEditFormProps {
  revenue: DailyRevenueResponse;
  drivers: DriverResponse[];
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
  const { t } = useTranslation(['app', 'common', 'errors']);
  const {
    methods,
    onSubmit,
    isPending,
    carOptions,
    driverOptions,
    driverRemunerationConfigOptions,
    weekdayName,
    isWeeklyPaymentToday,
    isWeeklyFixedRate,
    driverId,
    selectedDriverRemunerationConfig,
    weeklyConfig,
  } = useRevenueEditForm({ revenue, drivers, cars, onSuccess });

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
              label={t('app:revenues.fields.revenue_type')}
              placeholder={t('app:revenues.fields.select_revenue_type')}
              data={driverRemunerationConfigOptions}
              disabled={!driverId}
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
              name="drivingStartTime"
              label={t('app:revenues.fields.driven_from')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ControlledTextInput
              type="time"
              name="drivingEndTime"
              label={t('app:revenues.fields.driven_to')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ControlledNumberInput
              min={0}
              suffix=" km"
              name="kilometersFrom"
              label={t('app:revenues.fields.km_from')}
              placeholder="0"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ControlledNumberInput
              min={0}
              suffix=" km"
              name="kilometersTo"
              label={t('app:revenues.fields.km_to')}
              placeholder="0"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ControlledNumberInput
              min={0}
              suffix=" km"
              name="kilometersDriven"
              label={t('app:revenues.fields.kilometers_driven')}
              placeholder="0"
            />
          </Grid.Col>

          {/* Umsatz & Abrechnung */}
          <Grid.Col
            span={12}
            mt="xs"
          >
            <Text
              fw={600}
              size="sm"
              c="dimmed"
            >
              {t('app:revenues.sections.billing')}
            </Text>
          </Grid.Col>

          {selectedDriverRemunerationConfig === RemunerationModelType.FLAT_RATE && (
            <>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <ControlledNumberInput
                  min={0}
                  name="tripCount"
                  label={t('app:revenues.fields.trip_count')}
                  placeholder="0"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <ControlledNumberInput
                  min={0}
                  suffix=" €"
                  name="pricePerTrip"
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
      </Form>
    </Box>
  );
};
