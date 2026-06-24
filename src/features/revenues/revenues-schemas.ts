import { TFunction } from 'i18next';
import { z } from 'zod';
import { createPageResponseSchema } from '@/common/types/api-types';
import { RemunerationModelType } from '../remuneration/remuneration-types';

export const getCreateRevenueRecordSchema = (t: TFunction) =>
  z
    .object({
      driverId: z.number().int(),
      carId: z.number().int(),
      date: z
        .string()
        .refine((date) => new Date(date) <= new Date(), t('errors:date.past_or_present')),
      kilometersDriven: z.number().nonnegative(),
      kilometersFrom: z.number().nonnegative(),
      kilometersTo: z.number().nonnegative(),
      drivingStartTime: z.string().optional(),
      drivingEndTime: z.string().optional(),
      driverRemunerationType: z.nativeEnum(RemunerationModelType),
      revenue: z.number().nonnegative(),
      tripCount: z.number().optional(),
      pricePerTrip: z.number().optional(),
      companyRemuneration: z.number().optional(),
    })
    .refine((data) => data.kilometersTo >= data.kilometersFrom, {
      message: t('errors:revenue.kilometers_invalid'),
      path: ['kilometersTo'],
    });

export type CreateRevenueRecordRequest = z.infer<ReturnType<typeof getCreateRevenueRecordSchema>>;

export const getCreateDailyRevenueBulkRequestSchema = (t: TFunction) =>
  z.object({
    dailyRevenueRecords: z.array(getCreateRevenueRecordSchema(t)),
  });

export type CreateRevenueRecordBulkRequest = z.infer<
  ReturnType<typeof getCreateDailyRevenueBulkRequestSchema>
>;

export const DriverSummarySchema = z.object({
  id: z.number().int(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
});

export const CarSummarySchema = z.object({
  id: z.number().int(),
  licensePlate: z.string(),
  brand: z.string().nullable(),
  model: z.string().nullable(),
});

export const DailyRevenueSchema = z.object({
  id: z.number(),
  date: z.string(),
  remunerationModelType: z.enum(RemunerationModelType),
  tripCount: z.number().int().nullable(),
  pricePerTrip: z.number().nullable(),

  driver: DriverSummarySchema,
  car: CarSummarySchema,

  kilometersDriven: z.number(),
  kilometersFrom: z.number(),
  kilometersTo: z.number(),
  revenue: z.number(),
  companyRemuneration: z.number(),
  driverRemuneration: z.number(),
  drivingStartTime: z.string().nullable(),
  drivingEndTime: z.string().nullable(),
});

export const DailyRevenuePageSchema = createPageResponseSchema(DailyRevenueSchema);
export type DailyRevenues = z.infer<typeof DailyRevenuePageSchema>;
