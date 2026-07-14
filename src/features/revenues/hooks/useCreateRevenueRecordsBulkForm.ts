import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Car } from '@/api/generated/model';
import { useGetAllCars } from '@/api/generated/endpoints/cars/cars';
import { useGetAllDrivers } from '@/api/generated/endpoints/drivers/drivers';
import {
  useCreateDailyRevenuesBulk,
  getGetAllDailyRevenuesQueryKey,
} from '@/api/generated/endpoints/revenues/revenues';
import {
  CreateRevenueRecordBulkRequest,
  getCreateDailyRevenueBulkRequestSchema,
} from '../revenues-schemas';

dayjs.extend(isoWeek);

export const useCreateRevenueRecordsBulkForm = () => {
  const { t } = useTranslation(['app', 'common']);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const emptyRevenueRecord = {
    driverId: undefined,
    carId: undefined,
    date: dayjs().format('YYYY-MM-DD'),
    kilometersDriven: undefined,
    kilometersFrom: undefined,
    kilometersTo: undefined,
    drivingStartTime: undefined,
    drivingEndTime: undefined,
    driverRemunerationType: undefined,
    revenue: undefined,
    tripCount: undefined,
    pricePerTrip: undefined,
    companyRemuneration: undefined,
  };

  const methods = useForm<CreateRevenueRecordBulkRequest>({
    resolver: zodResolver(getCreateDailyRevenueBulkRequestSchema(t)),
    mode: 'onChange',
    defaultValues: {
      dailyRevenueRecords: [emptyRevenueRecord as any],
    },
  });

  const { control } = methods;

  const { fields, append, remove } = useFieldArray({
    name: 'dailyRevenueRecords',
    control,
  });

  const { mutate, isPending: isPendingCreation } = useCreateDailyRevenuesBulk({
    mutation: {
      onSuccess: () => {
        toast.success(t('app:revenues.bulk.success_message'));
        queryClient.invalidateQueries({ queryKey: getGetAllDailyRevenuesQueryKey() });
        navigate('/revenues');
      },
      onError: (error: any) => {
        const apiErrorMessage = error?.response?.data?.message || t('common:errors.unknown');
        toast.error(apiErrorMessage);
      },
    },
  });

  const { data: driversResponse, isPending: isPendingDrivers } = useGetAllDrivers({});
  const drivers = driversResponse?.data;

  const { data: cars, isLoading: isPendingCars } = useGetAllCars<Car[]>(
    { pageable: {} },
    {
      query: {
        select: (response) => response.data?.content || [],
      },
    }
  );

  const isPendingData = (isPendingCars || isPendingDrivers) && !cars && !drivers;

  const carOptions =
    cars?.map((car) => ({
      label: `${car.licensePlate} ${car.model} ${car.brand}`,
      value: car.id!,
    })) ?? [];

  const driverOptions =
    drivers?.content?.map((driver) => ({
      label: `${driver.firstName} ${driver.lastName} `,
      value: driver.id!,
    })) ?? [];

  const onSubmit = (data: CreateRevenueRecordBulkRequest) => {
    mutate({ data: data.dailyRevenueRecords as any });
  };

  return {
    methods,
    onSubmit,
    fields,
    append: () => append(emptyRevenueRecord as any),
    remove,
    carOptions,
    driverOptions,
    drivers: drivers?.content || [],
    isPendingData,
    isPendingCreation,
    emptyRevenueRecord,
  };
};
