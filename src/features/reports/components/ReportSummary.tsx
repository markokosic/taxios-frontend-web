import { useTranslation } from 'react-i18next';
import { SimpleGrid } from '@mantine/core';
import { StatsCard } from '@/shared/components/ui/StatsCard';
import { createFormatters } from '@/shared/utils';
import { RevenueReportData } from '../domain/reports-schemas';

type ReportSummaryProps = {
  data: RevenueReportData | undefined;
};

export const ReportSummary = ({ data }: ReportSummaryProps) => {
  const { i18n, t } = useTranslation(['app', 'common']);
  const fmt = createFormatters(i18n.language);

  if (!data || !data.totals) {
    return null;
  }

  const { totals } = data;

  return (
    <SimpleGrid
      cols={{ base: 1, xs: 2, md: 3 }}
      mb="xl"
    >
      <StatsCard
        title={t('app:reports.total_revenue')}
        value={`${fmt.number(totals.revenue ?? 0)} €`}
      />
      <StatsCard
        title={t('app:reports.total_company_share')}
        value={`${fmt.number(totals.companyShare ?? 0)} €`}
      />
      <StatsCard
        title={t('app:reports.driver_share')}
        value={`${fmt.number(totals.driverShare ?? 0)} €`}
      />
    </SimpleGrid>
  );
};
