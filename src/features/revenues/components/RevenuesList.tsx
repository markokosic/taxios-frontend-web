import { useTranslation } from 'react-i18next';
import { Paper, Skeleton, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useGetAllCars } from '@/api/generated/endpoints/cars/cars';
import { Car } from '@/api/generated/model';
import { useGetAllDrivers } from '@/api/generated/endpoints/drivers/drivers';
import { RemunerationModelType } from '@/features/remuneration/remuneration-types';
import { useQueryClient } from '@tanstack/react-query';
import { useDeleteDailyRevenue, getGetAllDailyRevenuesQueryKey } from '@/api/generated/endpoints/revenues/revenues';
import { RevenueCard } from './RevenueCard';
import { RevenueEditForm } from './RevenueEditForm';
import toast from 'react-hot-toast';

interface RevenuesListProps {
  revenues: any[];
}

export const RevenuesList = ({ revenues }: RevenuesListProps) => {
  const { t } = useTranslation(['app', 'common']);
  const { data: driversResponse, isPending: isLoadingDrivers } = useGetAllDrivers({});
  const { data: cars = [], isLoading: isLoadingCars } = useGetAllCars<Car[]>(
    { pageable: {} },
    {
      query: {
        select: (response) => response.data?.content ?? [],
      },
    }
  );
  const queryClient = useQueryClient();
  const { mutate: deleteRevenue } = useDeleteDailyRevenue({
    mutation: {
      onSuccess: () => {
        toast.success(t('common:actions.confirm'));
        queryClient.invalidateQueries({ queryKey: getGetAllDailyRevenuesQueryKey() });
      },
      onError: (err: any) => {
        const apiErrorMessage = err?.response?.data?.message || err.message || t('common:errors.unknown');
        toast.error(apiErrorMessage);
      },
    },
  });

  const drivers = driversResponse?.data?.content ?? [];

  const i18nDriverRemunerationConfigMap: Record<RemunerationModelType, string> = {
    [RemunerationModelType.PERCENTAGE_SHARE]: 'percentageShare',
    [RemunerationModelType.WEEKLY_FIXED_RATE]: 'weeklyFixedRate',
    [RemunerationModelType.FLAT_RATE]: 'flatRate',
  };

  const getRemunerationLabel = (type: RemunerationModelType) => {
    const key = i18nDriverRemunerationConfigMap[type];
    return key ? t(`app:remuneration.type.${key}`) : type;
  };

  const handleEdit = (revenue: any) => {
    const modalId = modals.open({
      title: t('common:actions.edit'),
      size: 'xl',
      children: (
        <RevenueEditForm
          revenue={revenue}
          drivers={drivers}
          cars={cars}
          onCancel={() => modals.close(modalId)}
          onSuccess={() => modals.close(modalId)}
        />
      ),
    });
  };

  const handleDelete = (revenue: any) => {
  modals.openConfirmModal({
    title: t('common:actions.delete', 'Delete Revenue'),
    centered: true,
    labels: {
      confirm: t('common:actions.yes', 'Yes, delete'),
      cancel: t('common:actions.cancel', 'Cancel'),
    },
    confirmProps: { color: 'red' },
    children: (
      <Text size="sm">
        Are you sure you want to delete this daily revenue entry for{' '}
        <strong>
          {revenue.driver
            ? `${revenue.driver.firstName} ${revenue.driver.lastName}`
            : `${revenue.driverFirstName} ${revenue.driverLastName}`}
        </strong>{' '}
        on <strong>{revenue.date}</strong>? This action cannot be undone.
      </Text>
    ),
    onConfirm: () => {
      deleteRevenue({ id: revenue.id });
    },
  });
};

  if (isLoadingDrivers || isLoadingCars) {
    return (
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
  }

  return (
    <Stack gap="md">
      {revenues.map((item) => (
        <RevenueCard
          key={item.id}
          item={item}
          onEdit={handleEdit}
          onDelete={handleDelete}
          getRemunerationLabel={getRemunerationLabel}
        />
      ))}
    </Stack>
  );
};
