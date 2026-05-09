import { TFunction } from 'i18next';
import { z } from 'zod';

export const getCreateRevenueRecordSchema = (t: TFunction) =>
  z.object({
    driverId: z.number().int(),
    //TODO change to "licensePlate"
    licencePlate: z.string().min(1),
    date: z.iso
      .date()
      .refine((date) => new Date(date) <= new Date(), 'Date must be in the past or present'),
    kilometersDriven: z.number().positive(),
    revenue: z.number(),
    companyRemuneration: z.number().optional(),
  });

export const getCreateDailyRevenueBulkRequestSchema = (t: TFunction) =>
  z.object({
    dailyRevenueRecords: z.array(getCreateRevenueRecordSchema(t)),
  });

export type CreateRevenueRecordRequest = z.infer<ReturnType<typeof getCreateRevenueRecordSchema>>;

export type CreateRevenueRecordBulkRequest = z.infer<typeof getCreateDailyRevenueBulkRequestSchema>;
