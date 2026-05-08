import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ActionIcon, Button, Grid, Paper, Stack } from '@mantine/core';
import { ControlledDatePicker } from '@/components/ui/ControlledDatePicker/ControlledDatePicker';
import { ControlledCombobox } from '@/components/ui/ControlledSelect/ControlledCombobox';
import { Form } from '@/components/ui/Form';
import { useGetCars } from '@/features/cars/hooks/useGetCars';
import { useGetDrivers } from '@/features/drivers/hooks/useGetDrivers';
import {
  CreateRevenueRecordBulkRequest,
  getCreateDailyRevenueBulkRequestSchema,
} from '../revenues-schemas';

export const CreateRevenueRecordsBulkForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
    mode: 'onChange',
    defaultValues: {
      dailyRevenueRecords: [
        {
          driverId: undefined,
          licencePlate: '',
          date: new Date().toISOString(),
          kilometersDriven: undefined,
          revenue: undefined,
          companyRemuneration: undefined,
        },
      ],
    },
  });

  const { control } = methods;

  const { fields, append, remove } = useFieldArray({
    name: 'dailyRevenueRecords',
    control,
  });

  const { data: cars } = useGetCars();

  const carOptions =
    cars?.content?.map((car) => ({
      label: `${car.licensePlate} ${car.model} ${car.brand}`,
      value: car.licensePlate,
    })) ?? [];

  const { data: drivers } = useGetDrivers();
  const driverOptions =
    drivers?.content?.map((driver) => ({
      label: `${driver.firstName} ${driver.lastName} `,
      value: driver.id,
    })) ?? [];

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
            // loading={isPending}
            // disabled={!methods.formState.isDirty || isPending}
          >
            SAVE
          </Button>
        </>
      }
    >
      <Stack gap="sm">
        {cars &&
          drivers &&
          fields.map((field, index) => (
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

                <Grid.Col
                  span="content"
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <ActionIcon
                    color="red"
                    variant="light"
                    size="lg"
                    onClick={() => remove(index)}
                  >
                    <Trash size={18} />
                  </ActionIcon>
                </Grid.Col>
              </Grid>
              <ControlledDatePicker name={`dailyRevenueRecords.${index}.date`} />
            </Paper>
          ))}
      </Stack>

      {/* date: undefined,
          kilometersDriven: undefined,
          revenue: undefined,
          companyRemuneration: undefined, */}

      <div onClick={append}>ddd</div>
    </Form>
  );
};
