import { Edit2, MoreVertical, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Button, Group, Menu, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useGetMyShiftById } from '@/api/generated/endpoints/shifts/shifts';
import { ROUTES } from '@/config/routes';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { DataLoadingWrapper } from '@/shared/components/ui/DataLoadingWrapper';
import { FloatingActionButton } from '@/shared/components/ui/FloatingActionButton';
import { ShiftViewFinancialSummary } from '../../components/admin/ShiftViewFinancialSummary';
import { ShiftViewMasterData } from '../../components/admin/ShiftViewMasterData';
import { ShiftViewRevenues } from '../../components/admin/ShiftViewRevenues';
import { calculateShiftTotals } from '../../domain/shift-calculations';
import { useDriverDeleteShiftAction } from '../../hooks/driver/useDriverDeleteShiftAction';

export const DriverViewShiftPage = () => {
  const { t } = useTranslation(['app', 'common']);
  const { shiftId } = useParams<{ shiftId: string }>();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const { handleDelete, isPending: isDeleting } = useDriverDeleteShiftAction({
    onSuccess: () => navigate(ROUTES.app.driver.shifts.path),
  });

  const {
    data: response,
    isLoading,
    error,
  } = useGetMyShiftById(Number(shiftId), {
    query: {
      enabled: !!shiftId && !isNaN(Number(shiftId)),
    },
  });

  const shift = response?.data;
  const isPendingStatus = shift?.status === 'PENDING';

  const { totalRevenue, totalDriverRemuneration, totalCompanyRemuneration } =
    calculateShiftTotals(shift);

  const actions =
    shift && isPendingStatus ? (
      <Group gap="xs">
        <Button
          variant="outline"
          color="red"
          leftSection={<Trash2 size={16} />}
          loading={isDeleting}
          onClick={() => handleDelete(shift)}
        >
          {t('common:actions.delete', 'Löschen')}
        </Button>
        <Button
          leftSection={<Edit2 size={16} />}
          onClick={() => navigate(ROUTES.app.driver.shifts.edit.getHref(shift.id!))}
        >
          {t('common:actions.edit', 'Bearbeiten')}
        </Button>
      </Group>
    ) : null;

  return (
    <PageLayout backTo={ROUTES.app.driver.shifts.getHref()}
      title={`${t('app:shifts.detail_title', 'Schicht')} #${shiftId}`}
      showBack
      actions={actions}
    >
      <DataLoadingWrapper
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !shift}
      >
        {shift && (
          <Stack gap="xl">
            <ShiftViewMasterData shift={shift} />
            <ShiftViewFinancialSummary
              totalRevenue={totalRevenue}
              totalDriverRemuneration={totalDriverRemuneration}
              totalCompanyRemuneration={totalCompanyRemuneration}
            />
            <ShiftViewRevenues shift={shift} />
          </Stack>
        )}
      </DataLoadingWrapper>
      
      {isMobile && shift && isPendingStatus && (
        <Menu withinPortal position="top-end" shadow="sm">
          <Menu.Target>
            <FloatingActionButton>
              <MoreVertical size={24} />
            </FloatingActionButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item 
              leftSection={<Edit2 size={16} />} 
              onClick={() => navigate(ROUTES.app.driver.shifts.edit.getHref(shift.id!))}
            >
              {t('common:actions.edit', 'Bearbeiten')}
            </Menu.Item>
            <Menu.Item 
              leftSection={<Trash2 size={16} />} 
              color="red" 
              disabled={isDeleting}
              onClick={() => handleDelete(shift)}
            >
              {t('common:actions.delete', 'Löschen')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </PageLayout>
  );
};

export default DriverViewShiftPage;
