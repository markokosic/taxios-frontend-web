import { Edit2, Trash2, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Stack, Group, Button } from '@mantine/core';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useGetShiftById, useApproveShift, getGetShiftByIdQueryKey, getGetAllShiftsQueryKey } from '@/api/generated/endpoints/shifts/shifts';
import { ShiftResponseStatus } from '@/api/generated/model';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { DataLoadingWrapper } from '@/shared/components/ui/DataLoadingWrapper';
import { ActionMenu } from '@/shared/components/ui/ActionMenu';
import { ROUTES } from '@/config/routes';
import { calculateShiftTotals } from '../../domain/shift-calculations';
import { useDeleteShiftAction } from '../../hooks/admin/useDeleteShiftAction';
import { ShiftViewMasterData } from '../../components/admin/ShiftViewMasterData';
import { ShiftViewFinancialSummary } from '../../components/admin/ShiftViewFinancialSummary';
import { ShiftViewRevenues } from '../../components/admin/ShiftViewRevenues';

export const AdminViewShiftPage = () => {
  const { t } = useTranslation(['app', 'common']);
  const { shiftId } = useParams<{ shiftId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { shifts: shiftsRoute } = ROUTES.app;

  const { handleDelete } = useDeleteShiftAction({
    onSuccess: () => navigate(shiftsRoute.path),
  });

  const {
    data: response,
    isLoading,
    error,
  } = useGetShiftById(Number(shiftId), {
    query: {
      enabled: !!shiftId && !isNaN(Number(shiftId)),
    },
  });

  const { mutate: approveShift, isPending: isApproving } = useApproveShift({
    mutation: {
      onSuccess: () => {
        toast.success(t('app:shifts.notifications.approve.success', 'Schicht erfolgreich freigegeben'));
        queryClient.invalidateQueries({ queryKey: getGetShiftByIdQueryKey(Number(shiftId)) });
        queryClient.invalidateQueries({ queryKey: getGetAllShiftsQueryKey() });
      },
      onError: () => {
        toast.error(t('app:shifts.notifications.approve.error', 'Fehler beim Freigeben der Schicht'));
      },
    },
  });

  const shiftResponse = response?.data;

  const { totalRevenue, totalDriverRemuneration, totalCompanyRemuneration } =
    calculateShiftTotals(shiftResponse);

  return (
    <PageLayout
      title={`${t('app:shifts.detail_title')} #${shiftId}`}
      actions={
        shiftResponse && (
          <Group gap="sm">
            {shiftResponse.status === ShiftResponseStatus.PENDING && (
              <Button
                color="teal"
                leftSection={<Check size={16} />}
                loading={isApproving}
                disabled={isApproving}
                onClick={() => approveShift({ id: shiftResponse.id! })}
              >
                {t('app:shifts.actions.approve', 'Freigeben')}
              </Button>
            )}
            <ActionMenu
              actions={[
                {
                  label: t('common:actions.edit', 'Bearbeiten'),
                  icon: Edit2,
                  onClick: () => navigate(ROUTES.app.shifts.edit.getHref(shiftResponse.id!)),
                },
                {
                  label: t('common:actions.delete', 'Löschen'),
                  icon: Trash2,
                  isDanger: true,
                  onClick: () => handleDelete(shiftResponse),
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
        isEmpty={!isLoading && !shiftResponse}
      >
        {shiftResponse && (
          <Stack gap="xl">
            <ShiftViewMasterData shift={shiftResponse} />
            <ShiftViewFinancialSummary
              totalRevenue={totalRevenue}
              totalDriverRemuneration={totalDriverRemuneration}
              totalCompanyRemuneration={totalCompanyRemuneration}
            />

            <ShiftViewRevenues shift={shiftResponse} />
          </Stack>
        )}
      </DataLoadingWrapper>
    </PageLayout>
  );
};

export default AdminViewShiftPage;
