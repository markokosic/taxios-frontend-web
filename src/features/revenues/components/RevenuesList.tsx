import { useTranslation } from 'react-i18next';
import { Paper, Stack, Skeleton } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useGetDrivers } from '@/features/drivers/hooks/useGetDrivers';
import { useGetCars } from '@/features/cars/hooks/useGetCars';
import { RemunerationModelType } from '@/features/remuneration/remuneration-types';
import { RevenueEditForm } from './RevenueEditForm';
import { RevenueCard } from './revenue-card';

interface RevenuesListProps {
  revenues: any[];
}

export const RevenuesList = ({ revenues }: RevenuesListProps) => {
  const { t } = useTranslation(['revenues', 'common']);
  const { data: driversData, isLoading: isLoadingDrivers } = useGetDrivers();
  const { data: carsData, isLoading: isLoadingCars } = useGetCars();

  const drivers = driversData?.content ?? [];
  const cars = carsData?.content ?? [];

  const i18nDriverRemunerationConfigMap: Record<RemunerationModelType, string> = {
    [RemunerationModelType.PERCENTAGE_SHARE]: 'percentageShare',
    [RemunerationModelType.WEEKLY_FIXED_RATE]: 'weeklyFixedRate',
    [RemunerationModelType.FLAT_RATE]: 'flatRate',
  };

  const getRemunerationLabel = (type: RemunerationModelType) => {
    const key = i18nDriverRemunerationConfigMap[type];
    return key ? t(`remuneration:type.${key}`) : type;
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

  if (isLoadingDrivers || isLoadingCars) {
    return (
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
  }

  return (
    <Stack gap="md">
      {revenues.map((item) => (
        <RevenueCard
          key={item.id}
          item={item}
          onEdit={handleEdit}
          getRemunerationLabel={getRemunerationLabel}
        />
      ))}
    </Stack>
  );
};