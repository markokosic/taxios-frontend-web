import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Center, Loader, Paper, Stack, Text } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { getMyShifts, useGetMyShiftsInfinite } from '@/api/generated/endpoints/shifts/shifts';
import { GetMyShiftsParams } from '@/api/generated/model';
import { ROUTES } from '@/config/routes';
import { DataLoadingWrapper } from '@/shared/components/ui/DataLoadingWrapper';
import { ShiftsListSkeleton } from '../shared/ShiftsListSkeleton';
import { DriverShiftCard } from './DriverShiftCard';

export const DriverShiftsList = () => {
  const { t } = useTranslation(['app', 'common']);
  const navigate = useNavigate();

  const params: GetMyShiftsParams = { size: 10, sort: ['shiftStart,desc'] };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useGetMyShiftsInfinite(params, {
    query: {
      initialPageParam: 1,
      queryFn: ({ pageParam, signal }) =>
        getMyShifts({ ...params, page: pageParam as number }, undefined, signal),
      getNextPageParam: (lastPage, allPages) => {
        const pageData = lastPage.data;
        if (
          !pageData ||
          pageData.last ||
          (pageData.page !== undefined &&
            pageData.totalPages !== undefined &&
            pageData.page >= pageData.totalPages)
        ) {
          return undefined;
        }
        return (pageData.page ?? allPages.length) + 1;
      },
    },
  });

  const { ref, entry } = useIntersection({
    root: null,
    threshold: 0.5,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const shifts = data?.pages.flatMap((p) => p.data?.content ?? []) ?? [];
  const isEmpty = !isLoading && shifts.length === 0;

  const handleCardClick = (shiftId?: number) => {
    if (shiftId) {
      navigate(ROUTES.app.driver.shifts.view.getHref(shiftId));
    }
  };

  return (
    <DataLoadingWrapper
      isLoading={isLoading}
      error={error}
      isEmpty={isEmpty}
      skeleton={<ShiftsListSkeleton />}
      emptyFallback={
        <Paper
          withBorder
          p="xl"
          radius="md"
          ta="center"
        >
          <Text c="dimmed">
            {t('app:shifts.empty', 'Keine Schichten vorhanden.')}
          </Text>
        </Paper>
      }
    >
      <Stack gap="sm">
        {shifts.map((shift) => (
          <DriverShiftCard
            key={shift.id}
            shift={shift}
            onClick={() => handleCardClick(shift.id)}
          />
        ))}

        <div
          ref={ref}
          style={{ height: 1 }}
        />

        {isFetchingNextPage && (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        )}
      </Stack>
    </DataLoadingWrapper>
  );
};

