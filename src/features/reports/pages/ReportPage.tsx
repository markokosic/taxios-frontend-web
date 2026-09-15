import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, LoadingOverlay } from '@mantine/core';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { ReportFilters } from '../components/ReportFilters';
import { ReportSummary } from '../components/ReportSummary';
import { ReportTable } from '../components/ReportTable';
import { useGetRevenueReport } from '../hooks/useGetRevenueReport';
import { useReportFilters } from '../hooks/useReportFilters';

export const ReportPage = () => {
  const { t } = useTranslation(['app', 'common']);
  const { filters, setFilter } = useReportFilters();

  const { data, isLoading, error } = useGetRevenueReport(filters);

  return (
    <PageLayout
      title={t('common:navigation.reports')}
      showBack={false}
    >
      <Box pos="relative">
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />

        <ReportFilters
          filters={filters}
          setFilter={setFilter}
        />

        {error && (
          <Alert
            icon={<AlertCircle size={16} />}
            title={t('common:error')}
            color="red"
            mb="xl"
          >
            {error.message}
          </Alert>
        )}

        {!isLoading && !data && (
          <Alert
            icon={<AlertCircle size={16} />}
            title={t('common:info')}
            color="blue"
            mb="xl"
          >
            {t('app:reports.no_data_info')}
          </Alert>
        )}

        <ReportSummary data={data} />

        <ReportTable
          data={data}
          isLoading={isLoading}
          groupBy={filters.groupBy}
        />
      </Box>
    </PageLayout>
  );
};

export default ReportPage;
