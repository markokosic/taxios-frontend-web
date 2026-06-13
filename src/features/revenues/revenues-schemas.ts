import { TFunction } from 'i18next';
import { z } from 'zod';
import { RemunerationModelType } from '../remuneration/remuneration-types';

export const getCreateRevenueRecordSchema = (t: TFunction) =>
  z.object({
    driverId: z.number().int(),
    carId: z.number().int(),
    date: z.string()
      .refine((date) => new Date(date) <= new Date(), t('errors:date.past_or_present')),
    kilometersDriven: z.number().nonnegative(),
    kilometersFrom: z.number().nonnegative(),
    kilometersTo: z.number().nonnegative(),
    drivenFrom: z.string().optional(),
    drivenTo: z.string().optional(),
    driverRemunerationType: z.nativeEnum(RemunerationModelType),
    revenue: z.number().nonnegative(),
    tripCount: z.number().optional(),
    pricePerTrip: z.number().optional(),
    companyRemuneration: z.number().optional(),
  }).refine((data) => data.kilometersTo >= data.kilometersFrom, {
    message: t('errors:revenue.kilometers_invalid'),
    path: ['kilometersTo'],
  });

export const getCreateDailyRevenueBulkRequestSchema = (t: TFunction) =>
  z.object({
    dailyRevenueRecords: z.array(getCreateRevenueRecordSchema(t)),
  });

export type CreateRevenueRecordRequest = z.infer<ReturnType<typeof getCreateRevenueRecordSchema>>;

export type CreateRevenueRecordBulkRequest = z.infer<
  ReturnType<typeof getCreateDailyRevenueBulkRequestSchema>
>;
