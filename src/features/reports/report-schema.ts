import { TFunction } from 'i18next';
import z from 'zod';

export const GroupBySchema = z.enum(['NONE', 'DAY', 'WEEK', 'MONTH', 'YEAR']);

export type GroupBy = z.infer<typeof GroupBySchema>;

export const getRevenueReportParamsSchema = (t: TFunction) =>
  z.object({
    dateFrom: z.string().nullable(),
    dateTo: z.string().nullable(),
    driverId: z.string().nullable(),
    groupBy: GroupBySchema.optional(),
  });

export type RevenueReportParams = {
  dateFrom: string | null;
  dateTo: string | null;
  driverId: string | null;
  groupBy: GroupBy | null;
};

export type ReportRowDriver = {
  id: number;
  firstName: string;
  lastName: string;
};

export type RevenueReportRow = {
  date: string;
  revenue: number;
  companyRemuneration: number;
  driverRemuneration: number;
  kilometersDriven: number;
  entryCount: number;
  drivers: ReportRowDriver[];
};

export type RevenueReportData = {
  rows: RevenueReportRow[];
  totals: {
    revenue: number;
    companyShare: number;
    driverShare: number;
    totalKm: number;
    totalEntries: number;
  };
};
