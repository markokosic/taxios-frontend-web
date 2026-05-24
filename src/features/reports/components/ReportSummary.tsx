import { useTranslation } from 'react-i18next';
import { SimpleGrid } from '@mantine/core';
import { StatsCard } from '@/components/ui/StatsCard';
import { createFormatters } from '@/lib/utils';
import { RevenueReportData } from '../report-schema';

type ReportSummaryProps = {
  data: RevenueReportData | undefined;
};

export const ReportSummary = ({ data }: ReportSummaryProps) => {
  const { i18n, t } = useTranslation(['reports', 'common']);
  const fmt = createFormatters(i18n.language);

  if (!data) {
    return null;
  }

  const { totals } = data;

  return (
    <SimpleGrid
      cols={{ base: 1, xs: 2, md: 4 }}
      mb="xl"
    >
      <StatsCard
        title={t('reports:total_revenue')}
        value={`${fmt.number(totals.revenue)} €`}
      />
      <StatsCard
        title={t('reports:total_company_share')}
        value={`${fmt.number(totals.companyShare)} €`}
      />
      <StatsCard
        title={t('reports:driver_share')}
        value={`${fmt.number(totals.driverShare)} €`}
      />
      <StatsCard
        title={t('reports:total_kilometers')}
        value={`${fmt.number(totals.totalKm)} km`}
      />
    </SimpleGrid>
  );
};
