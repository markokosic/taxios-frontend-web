import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button, Stack } from '@mantine/core';
import { Form } from '@/components/ui/Form';
import { useGetCars } from '@/features/cars/hooks/useGetCars';
import { useGetDrivers } from '@/features/drivers/hooks/useGetDrivers';
import { useCreateRevenuesBulk } from '../hooks/useCreateRevenuesBulk';
import {
  CreateRevenueRecordBulkRequest,
  getCreateDailyRevenueBulkRequestSchema,
} from '../revenues-schemas';
import { CreateRevenueRecordRow } from './CreateRevenueRecordRow';
import { RevenueType } from '../revenues-types';

dayjs.extend(isoWeek);

export const CreateRevenueRecordsBulkForm = () => {
  const { t } = useTranslation(['revenues', 'common']);
  const navigate = useNavigate();

  const { mutate, isPending: isPendingCreation } = useCreateRevenuesBulk();
  //TODO anpassen dass useGetDrivers nicht aufgerufen wird sondern usGetDriversSelect
  const { data: drivers, isPending: isPendingDrivers } = useGetDrivers();
  const { data: cars, isPending: isPendingCars } = useGetCars();

  const emptyRevenueRecord = {
    driverId: undefined,
    carId: undefined,
    date: dayjs().format('YYYY-MM-DD'),
    kilometersDriven: undefined,
    kilometersFrom: undefined,
    kilometersTo: undefined,
    drivenFrom: undefined,
    drivenTo: undefined,
    revenueType: RevenueType.MANUAL_DAILY_REVENUE,
    revenue: undefined,
    tripCount: undefined,
    pricePerTrip: undefined,
    companyRemuneration: undefined,
  };

  const onSubmit = (data: CreateRevenueRecordBulkRequest) => {
    mutate(data.dailyRevenueRecords, {
      onSuccess: () => {
        toast.success(t('revenues:bulk.success_message'));
        navigate('/revenues');
      },
    });
  };

  const methods = useForm({
    resolver: zodResolver(getCreateDailyRevenueBulkRequestSchema(t)),
    shouldUnregister: true,
    defaultValues: {
      dailyRevenueRecords: [emptyRevenueRecord],
    },
  });

  const { control } = methods;

  const { fields, append, remove } = useFieldArray({
    name: 'dailyRevenueRecords',
    control,
  });

  const isPending = (isPendingCars || isPendingDrivers) && !cars && !drivers;
  const fieldArrayIsEmpty = fields.length === 0;
  const formIsValid = methods.formState.isValid;

  const carOptions =
    cars?.content?.map((car) => ({
      label: `${car.licensePlate} ${car.model} ${car.brand}`,
      value: car.id,
    })) ?? [];

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
            loading={isPending || isPendingCreation}
            disabled={!formIsValid || fieldArrayIsEmpty || isPending}
          >
            {t('common:actions.save')}
          </Button>
        </>
      }
    >
      <Stack gap="sm">
        {cars &&
          drivers &&
          fields.map((field, index) => (
            <CreateRevenueRecordRow
              key={field.id}
              index={index}
              remove={remove}
              carOptions={carOptions}
              driverOptions={driverOptions}
              drivers={drivers?.content}
            />
          ))}
      </Stack>

      <Button
        mt="md"
        variant="light"
        leftSection={<PlusCircle size={18} />}
        onClick={() => append(emptyRevenueRecord as any)}
      >
        {t('revenues:bulk.add_row')}
      </Button>
    </Form>
  );
};
