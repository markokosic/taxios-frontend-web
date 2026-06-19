import { useState } from 'react';
import { PlusCircle, ReceiptEuro } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { PageLayout } from 'src/components/layout/PageLayout';
import { useMediaQuery } from '@mantine/hooks';
import { ActionMenu } from '@/components/ui/Menu';
import { SpeedDial } from '@/components/ui/Menu/SpeedDial';
import { ROUTES } from '@/config/routes';
import { useGetRevenues } from '../hooks/useGetRevenues';
import { RevenuesList } from '../components/RevenuesList';
import { DataLoadingWrapper } from '@/components/ui/DataLoadingWrapper';
import { Pagination, Paper, Skeleton, Stack, Group } from '@mantine/core';

export const RevenuesPage = () => {
  const { t } = useTranslation(['revenues', 'common']);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  const navigateToBulkRevenues = () => navigate(ROUTES.app.revenues.createBulk.getHref());

  const [page, setPage] = useState<number>(0);
  const [size] = useState<number>(10);

  const { data, isLoading, isError, error } = useGetRevenues(page, size);

  const menuActions = [
    {
      label: t('record_revenue.daily'),
      icon: ReceiptEuro,
      onClick: navigateToBulkRevenues,
    },
  ];

  const listSkeleton = (
    <Stack gap="md">
      {Array.from({ length: 3 }).map((_, idx) => (
        <Paper key={idx} p="md" withBorder radius="md">
          <Skeleton height={20} width="40%" mb="sm" />
          <Skeleton height={50} mb="sm" />
          <Skeleton height={20} width="20%" />
        </Paper>
      ))}
    </Stack>
  );

  return (
    <PageLayout
      title={t('common:revenues')}
      showBack={false}
      actions={<ActionMenu actions={menuActions} />}
    >
      <Stack gap="lg" style={{ width: '100%' }}>
        <DataLoadingWrapper
          isLoading={isLoading}
          error={error}
          isEmpty={!data || data.totalElements === 0}
          skeleton={listSkeleton}
        >
          {data && <RevenuesList revenues={data.content} />}
        </DataLoadingWrapper>

        {data && data.totalPages > 1 && (
          <Group justify="center" mt="md" mb="xl">
            <Pagination
              value={page + 1}
              onChange={(val) => setPage(val - 1)}
              total={data.totalPages}
              withEdges
            />
          </Group>
        )}
      </Stack>

      {isMobile && (
        <SpeedDial
          actions={menuActions}
          Icon={PlusCircle}
        />
      )}
    </PageLayout>
  );
};
