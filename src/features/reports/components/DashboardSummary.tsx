import { useTranslation } from 'react-i18next';
import { SimpleGrid, Stack, Title } from '@mantine/core';
import { StatsCard } from '@/shared/components/ui/StatsCard';
import { createFormatters } from '@/shared/utils';
import { DashboardSummaryData } from '../domain/reports-schemas';

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
    <Stack
      gap="md"
      mb="md"
    >
      <Title order={3}>{title}</Title>
      <SimpleGrid
        cols={{ base: 1, xs: 2, sm: 2, md: 4 }}
        spacing="md"
      >
        <StatsCard
          title={t('app:reports.total_revenue')}
          value={`${fmt.number(data.totalRevenue ?? 0)} €`}
        />
        <StatsCard
          title={t('app:reports.total_company_share')}
          value={`${fmt.number(data.companyShare ?? 0)} €`}
        />
        <StatsCard
          title={t('app:reports.driver_share')}
          value={`${fmt.number(data.driverShare ?? 0)} €`}
        />
        <StatsCard
          title={t('app:reports.rides')}
          value={data.entryCount ?? 0}
        />
      </SimpleGrid>
    </Stack>
  );
};
