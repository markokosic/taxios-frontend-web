import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Paper, Stack, Text, Alert } from '@mantine/core';
import { Info } from 'lucide-react';
import { useGetAllShifts } from '@/api/generated/endpoints/shifts/shifts';
import { ShiftManagementTable } from '@/features/shifts/components/admin/ShiftManagementTable';
import { DataLoadingWrapper } from '@/shared/components/ui/DataLoadingWrapper';
import { ShiftsListSkeleton } from '@/features/shifts/components/shared/ShiftsListSkeleton';
import { ROUTES } from '@/config/routes';
import { useDeleteShiftAction } from '@/features/shifts/hooks/admin/useDeleteShiftAction';
import { ShiftResponse, GetAllShiftsStatus } from '@/api/generated/model';

export const PendingShiftsView = () => {
  const { t } = useTranslation(['app', 'common']);
  const navigate = useNavigate();

  const { data: response, isLoading, error } = useGetAllShifts({
    status: GetAllShiftsStatus.PENDING,
    size: 100, 
  });

  const { handleDelete } = useDeleteShiftAction();

  const shifts = response?.data?.content || [];
  const isEmpty = !isLoading && shifts.length === 0;

  const actions = {
    onViewDetails: (shift: ShiftResponse) => navigate(ROUTES.app.shifts.view.getHref(shift.id as number)),
    onEdit: (shift: ShiftResponse) => navigate(ROUTES.app.shifts.edit.getHref(shift.id as number)),
    onDelete: handleDelete,
  };

  return (
    <Stack gap="md">
      <Alert icon={<Info size={16} />} title={t('app:dashboard.pending_shifts.info', 'Ausstehende Freigaben')}>
        {t('app:dashboard.pending_shifts.description', 'Überprüfen Sie die ausstehenden Schichten der Fahrer und geben Sie diese frei.')}
      </Alert>
      <DataLoadingWrapper
        isLoading={isLoading}
        error={error}
        isEmpty={isEmpty}
        skeleton={<ShiftsListSkeleton />}
        emptyFallback={
          <Paper withBorder p="xl" radius="md" ta="center">
            <Text c="dimmed">{t('app:shifts.empty_pending', 'Keine ausstehenden Schichten zur Freigabe.')}</Text>
          </Paper>
        }
      >
        <ShiftManagementTable shifts={shifts} actions={actions} />
      </DataLoadingWrapper>
    </Stack>
  );
};
