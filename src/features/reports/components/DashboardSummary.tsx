import { useTranslation } from 'react-i18next';
import { SimpleGrid, Title, Stack } from '@mantine/core';
import { StatsCard } from '@/components/ui/StatsCard';
import { createFormatters } from '@/lib/utils';
import { DashboardSummaryData } from '../report-schema';

type DashboardSummaryProps = {
  data: DashboardSummaryData | undefined;
  title: string;
};

export const DashboardSummary = ({ data, title }: DashboardSummaryProps) => {
  const { i18n, t } = useTranslation(['app', 'common']);
  const fmt = createFormatters(i18n.language);

  if (!data) {
    return null;
  }

  return (
    <Stack gap="md" mb="xl">
      <Title order={3}>{title}</Title>
      <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="md">
        <StatsCard
          title={t('app:reports.total_revenue')}
          value={`${fmt.number(data.totalRevenue)} €`}
        />
        <StatsCard
          title={t('app:reports.company_share')}
          value={`${fmt.number(data.companyShare)} €`}
        />
        <StatsCard
          title={t('app:reports.driver_share')}
          value={`${fmt.number(data.driverShare)} €`}
        />
        <StatsCard
          title={t('app:reports.total_kilometers')}
          value={`${fmt.number(data.totalKm)} km`}
        />
        <StatsCard
          title={t('app:dashboard.revenue_per_km')}
          value={`${fmt.number(data.revenuePerKm)} €/km`}
        />
        <StatsCard
          title={t('app:dashboard.trip_count')}
          value={data.tripCount}
        />
      </SimpleGrid>
    </Stack>
  );
};
