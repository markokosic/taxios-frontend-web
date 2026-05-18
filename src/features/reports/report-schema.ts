import { TFunction } from 'i18next';
import z from 'zod';

export const GroupBySchema = z.enum(['NONE', 'DAY', 'MONTH', 'YEAR']);

export type GroupBy = z.infer<typeof GroupBySchema>;

export const getRevenueReportParamsSchema = (t: TFunction) =>
  z.object({
    dateFrom: z.iso.date(),
    dateTo: z.iso.date(),
    driverId: z.number().int().optional(),
    groupBy: GroupBySchema.optional(),
  });

export type RevenueReportParams = z.infer<typeof getRevenueReportParamsSchema>;
