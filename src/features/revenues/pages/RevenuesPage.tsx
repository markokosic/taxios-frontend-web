import { PlusCircle, ReceiptEuro } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router';
import { Group, Pagination, Paper, Skeleton, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useGetAllDailyRevenues } from '@/api/generated/endpoints/revenues/revenues';
import { PageLayout } from '@/components/layout/PageLayout';
import { DataLoadingWrapper } from '@/components/ui/DataLoadingWrapper';
import { ActionMenu } from '@/components/ui/Menu';
import { SpeedDial } from '@/components/ui/Menu/SpeedDial';
import { ROUTES } from '@/config/routes';
import { RevenuesList } from '../components/RevenuesList';
import { RevenueFilters } from '../components/RevenueFilters';


export const RevenuesPage = () => {
  const { t } = useTranslation(['revenues', 'common', 'app' ]);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  const navigateToBulkRevenues = () => navigate(ROUTES.app.revenues.createBulk.getHref());

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const size = 10;

  const driverId = searchParams.get('driverId') ? Number(searchParams.get('driverId')) : undefined;
  const dateFrom = searchParams.get('dateFrom') || undefined;
  const dateTo = searchParams.get('dateTo') || undefined;

  const {
    data: response,
    isPending: isLoading,
    error,
  } = useGetAllDailyRevenues({
    pageable: { page: page - 1, size },
    driverId,
    dateFrom,
    dateTo,
  });
  const data = response?.data;

  const menuActions = [
    {
      label: t('app:revenues.record_revenue.daily'),
      icon: ReceiptEuro,
      onClick: navigateToBulkRevenues,
    },
  ];

  const listSkeleton = (
    <Stack gap="md">
      {Array.from({ length: 3 }).map((_, idx) => (
        <Paper
          key={idx}
          p="md"
          withBorder
          radius="md"
        >
          <Skeleton
            height={20}
            width="40%"
            mb="sm"
          />
          <Skeleton
            height={50}
            mb="sm"
          />
          <Skeleton
            height={20}
            width="20%"
          />
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
      <Stack
        gap="lg"
        style={{ width: '100%' }}
      >
        <RevenueFilters />

        <DataLoadingWrapper
          isLoading={isLoading}
          error={error}
          isEmpty={!data || data.totalElements === 0}
          skeleton={listSkeleton}
        >
          {data && <RevenuesList revenues={data.content ?? []} />}
        </DataLoadingWrapper>

        {data && data.totalPages !== undefined && data.totalPages > 1 && (
          <Group
            justify="center"
            mt="md"
            mb="xl"
          >
            <Pagination
              value={page}
              onChange={(val) => {
                setSearchParams((prev) => {
                  prev.set('page', val.toString());
                  return prev;
                });
              }}
              total={data.totalPages ?? 1}
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
