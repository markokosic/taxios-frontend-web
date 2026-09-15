import { Card, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { FuelStationRecommendations } from '../../components/FuelStationRecommendations';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const DriverDashboardPage = () => {
  const { t } = useTranslation(['common', 'app']);
  const { user } = useAuth();

  return (
    <PageLayout
      title={t('common:navigation.dashboard')}
      showBack={false}
    >
      <Stack gap="lg" pb="xl">
        <Card withBorder radius="md" p="xl">
          <Title order={2}>{t('app:driver_dashboard.greeting', { name: user?.firstName || 'Fahrer' })}</Title>
          <Text c="dimmed" mt="xs">
            {t('app:driver_dashboard.welcome')}
          </Text>
        </Card>
        
        <FuelStationRecommendations />
      </Stack>
    </PageLayout>
  );
};

export default DriverDashboardPage;
