import dayjs from 'dayjs';
import isoWeekday from 'dayjs/plugin/isoWeek';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ActionIcon, Button, Grid, Paper, Stack } from '@mantine/core';
import { ControlledDatePicker } from '@/components/ui/ControlledDatePicker/ControlledDatePicker';
import { ControlledNumberInput } from '@/components/ui/ControlledNumberInput/ControlledNumberInput';
import { ControlledCombobox } from '@/components/ui/ControlledSelect/ControlledCombobox';
import { Form } from '@/components/ui/Form';
import { useGetCars } from '@/features/cars/hooks/useGetCars';
import { useGetDrivers } from '@/features/drivers/hooks/useGetDrivers';
import {
  RemunerationModelType,
  WeeklyFixedRemunerationConfig,
} from '@/features/remuneration/remuneration-types';
import {
  CreateRevenueRecordBulkRequest,
  getCreateDailyRevenueBulkRequestSchema,
} from '../revenues-schemas';

export const CreateRevenueRecordsBulkForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: drivers, isPending: isPendingDrivers } = useGetDrivers();
  const { data: cars, isPending: isPendingCars } = useGetCars();

  const emptyRevenueRecord = {
    driverId: undefined,
    licencePlate: '',
    date: dayjs().format('YYYY-MM-DD'),
    kilometersDriven: undefined,
    revenue: undefined,
    companyRemuneration: undefined,
  };

  const onSubmit = (data: CreateRevenueRecordBulkRequest) => {
    console.log(data);
    return;
    // mutate(
    //   { data },
    //   {
    //     onSuccess: (response) => {
    //       const newId = response?.id;
    //       navigate(ROUTES.app.drivers.view.getHref(newId));
    //       toast.success(t('drivers:notifications.create.success'));
    //     },
    //   }
    // );
  };

  const methods = useForm({
    resolver: zodResolver(getCreateDailyRevenueBulkRequestSchema(t)),
    shouldUnregister: true,
    // mode: 'onChange',
    defaultValues: {
      dailyRevenueRecords: [emptyRevenueRecord],
    },
  });

  const { control, formState } = methods;

  const { fields, append, remove, update } = useFieldArray({
    name: 'dailyRevenueRecords',
    control,
  });

  const carOptions =
    cars?.content?.map((car) => ({
      label: `${car.licensePlate} ${car.model} ${car.brand}`,
      value: car.licensePlate,
    })) ?? [];

  const driverOptions =
    drivers?.content?.map((driver) => ({
      label: `${driver.firstName} ${driver.lastName} `,
      value: driver.id,
    })) ?? [];

  const driverIds = useWatch({
    name: 'dailyRevenueRecords',
    control,
  });

  const isPending = isPendingCars && isPendingDrivers;

  return (
    <Form
      methods={methods}
      onSubmit={onSubmit}
      formActions={
        <>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            {t('common:actions.cancel')}
          </Button>
          <Button
            type="submit"
            loading={isPending}
            disabled={!methods.formState.isValid || isPending}
          >
            SAVE
          </Button>
        </>
      }
    >
      <Stack gap="sm">
        {cars &&
          drivers &&
          fields.map((field, index) => {
            const driverId = driverIds?.[index]?.driverId;
            const driver = drivers.content.find((d) => d.id === driverId);

            const hasWeeklyPayment =
              driver?.currentRemunerationConfig?.remunerationModelType ===
              RemunerationModelType.WEEKLY_FIXED_RATE;

            const config = driver?.currentRemunerationConfig;

            const isWeeklyPaymentToday =
              config?.remunerationModelType === RemunerationModelType.WEEKLY_FIXED_RATE &&
              config.settlementDay === 6;

            console.log(isWeeklyPaymentToday);

            //TODO find solution how to programmatically set value without infinite rerenders
            if (isWeeklyPaymentToday) {
              methods.setValue(
                `dailyRevenueRecords.${index}.companyRemuneration`,
                config.weeklyFixedCompanySettlement
              );
            }

            return (
              <Paper
                key={field.id}
                withBorder
                p="md"
                radius="md"
              >
                <Grid>
                  <Grid.Col span={{ base: 12, md: 5 }}>
                    <ControlledCombobox
                      name={`dailyRevenueRecords.${index}.driverId`}
                      label="Driver"
                      placeholder="Select driver"
                      data={driverOptions}
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 5 }}>
                    <ControlledCombobox
                      name={`dailyRevenueRecords.${index}.licencePlate`}
                      label="Car"
                      placeholder="Select car"
                      data={carOptions}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 5 }}>
                    <ControlledDatePicker
                      name={`dailyRevenueRecords.${index}.date`}
                      label="Date"
                      dropdownType="modal"
                      placeholder="Select date"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 5 }}>
                    <ControlledNumberInput
                      min={0}
                      suffix="km"
                      name={`dailyRevenueRecords.${index}.kilometersDriven`}
                      label="Km"
                      placeholder="km"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 5 }}>
                    <ControlledNumberInput
                      min={0}
                      suffix="€"
                      name={`dailyRevenueRecords.${index}.revenue`}
                      label="Revenue"
                      placeholder="revenue in €"
                    />
                  </Grid.Col>
                  {hasWeeklyPayment && (
                    <Grid.Col span={{ base: 12, md: 5 }}>
                      <ControlledNumberInput
                        suffix="€"
                        name={`dailyRevenueRecords.${index}.companyRemuneration`}
                        label="Firmenanteil"
                        placeholder="Firmenanteil in €"
                      />
                    </Grid.Col>
                  )}
                </Grid>
                <ActionIcon
                  color="red"
                  variant="light"
                  size="lg"
                  onClick={() => remove(index)}
                >
                  <Trash size={18} />
                </ActionIcon>
              </Paper>
            );
          })}
      </Stack>

      {/* date: undefined,
          kilometersDriven: undefined,
          revenue: undefined,
          companyRemuneration: undefined, */}

      <div onClick={() => append(emptyRevenueRecord)}>ddd</div>
    </Form>
  );
};
