import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Box, Center, Loader, SimpleGrid, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { RevenueAreaChart } from './RevenueAreaChart';
import { ShareDonutChart } from './ShareDonutChart';
import { TripsBarChart } from './TripsBarChart';
import { DashboardSummary } from '@/features/reports/components/DashboardSummary';
import { useGetDashboardSummary } from '@/features/reports/hooks/useGetDashboardSummary';
import { useGetRevenueReport } from '@/features/reports/hooks/useGetRevenueReport';

export interface YearlyDashboardViewProps {
  year: number;
}

export const YearlyDashboardView = ({ year }: YearlyDashboardViewProps) => {
  const { t } = useTranslation(['app', 'common']);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const dateFrom = dayjs(`${year}-01-01`).startOf('year').format('YYYY-MM-DD');
  const dateTo = dayjs(`${year}-12-31`).endOf('year').format('YYYY-MM-DD');

  const { data: yearData, isLoading: isSummaryLoading } = useGetDashboardSummary({ year });
  const { data: yearReport, isLoading: isReportLoading } = useGetRevenueReport({
    dateFrom,
    dateTo,
    driverId: null,
    groupBy: 'MONTH',
  });

  const isLoading = isSummaryLoading || isReportLoading;

  const areaChartData =
    yearReport?.rows.map((row) => ({
      date: dayjs(row.date).format('MMM'),
      revenue: row.revenue ?? 0,
      companyRemuneration: row.companyRemuneration,
      driverRemuneration: row.driverRemuneration,
    })) ?? [];

  const tripsChartData =
    yearReport?.rows.map((row) => ({
      label: dayjs(row.date).format('MMM'),
      trips: row.entryCount ?? 0,
    })) ?? [];

  if (isLoading) {
    return (
      <Center h={300}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <Stack gap="xl" style={{ width: '100%', minWidth: 0 }}>
      <DashboardSummary
        data={yearData}
        title={t('app:dashboard.yearly_summary', { year })}
      />

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md" style={{ width: '100%', minWidth: 0 }}>
        <Box style={{ gridColumn: isMobile ? 'span 1' : 'span 2', minWidth: 0 }}>
          <RevenueAreaChart
            data={areaChartData}
            title={t('app:dashboard.charts.yearly_revenue_title', { year })}
            subtitle={t('app:dashboard.charts.yearly_revenue_subtitle')}
            height={280}
          />
        </Box>

        <Box style={{ gridColumn: 'span 1', minWidth: 0 }}>
          <ShareDonutChart
            companyShare={yearData?.companyShare ?? 0}
            driverShare={yearData?.driverShare ?? 0}
            totalRevenue={yearData?.totalRevenue ?? 0}
            title={t('app:dashboard.charts.yearly_share_title', { year })}
            height={200}
          />
        </Box>
      </SimpleGrid>

      <TripsBarChart
        data={tripsChartData}
        title={t('app:dashboard.charts.yearly_trips_title', { year })}
        subtitle={t('app:dashboard.charts.yearly_trips_subtitle')}
        height={260}
      />
    </Stack>
  );
};
