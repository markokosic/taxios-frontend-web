import { useState } from 'react';
import { Button, Group, Stack } from '@mantine/core';
import { Edit2, KeyRound, Trash2, UserX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useGetDriver } from '@/api/generated/endpoints/drivers/drivers';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { DataLoadingWrapper } from '@/shared/components/ui/DataLoadingWrapper';
import { ActionMenu } from '@/shared/components/ui/ActionMenu';
import { ROUTES } from '@/config/routes';
import { CreateDriverUserModal } from '../components/CreateDriverUserModal';
import { DriverViewMasterData } from '../components/DriverViewMasterData';
import { DriverViewRemuneration } from '../components/DriverViewRemuneration';
import { useDeactivateDriverUserAction } from '../hooks/useDeactivateDriverUserAction';
import { useDeleteDriverAction } from '../hooks/useDeleteDriverAction';

export const DriverViewPage = () => {
  const { t } = useTranslation(['app', 'common']);
  const { driverId } = useParams<{ driverId: string }>();
  const navigate = useNavigate();
  const [accessModalOpened, setAccessModalOpened] = useState(false);

  const { handleDelete } = useDeleteDriverAction({
    onSuccess: () => navigate(ROUTES.app.drivers.path),
  });

  const { handleDeactivate, isDeactivating } = useDeactivateDriverUserAction();

  const { data: response, isPending: isLoading, error } = useGetDriver(Number(driverId), {
    query: {
      enabled: !!driverId && !isNaN(Number(driverId)),
    },
  });

  const driver = response?.data;

  return (
    <PageLayout
      title={driver ? `${driver.firstName} ${driver.lastName}` : t('common:driver')}
      actions={
        driver && (
          <Group gap="sm">
            {driver.userId ? (
              <Button
                leftSection={<UserX size={16} />}
                color="red"
                variant="light"
                loading={isDeactivating}
                onClick={() => handleDeactivate(driver)}
              >
                {t('app:drivers.actions.deactivate_access')}
              </Button>
            ) : (
              <Button
                leftSection={<KeyRound size={16} />}
                onClick={() => setAccessModalOpened(true)}
              >
                {t('app:drivers.actions.activate_access')}
              </Button>
            )}
            <ActionMenu
              actions={[
                {
                  label: t('common:actions.edit'),
                  icon: Edit2,
                  onClick: () => navigate(ROUTES.app.drivers.edit.getHref(driver.id)),
                },
                {
                  label: t('common:actions.delete'),
                  icon: Trash2,
                  isDanger: true,
                  onClick: () => handleDelete(driver),
                },
              ]}
            />
          </Group>
        )
      }
    >
      <DataLoadingWrapper
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !driver}
      >
        {driver && (
          <Stack gap="xl">
            <DriverViewMasterData driver={driver} />
            <DriverViewRemuneration driver={driver} />
            <CreateDriverUserModal
              driver={driver}
              opened={accessModalOpened}
              onClose={() => setAccessModalOpened(false)}
            />
          </Stack>
        )}
      </DataLoadingWrapper>
    </PageLayout>
  );
};

export default DriverViewPage;
