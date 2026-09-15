import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Paper, Stack, Text } from '@mantine/core';
import { useGetAllShifts } from '@/api/generated/endpoints/shifts/shifts';
import { AppPagination } from '@/shared/components/ui/AppPagination';
import { DataLoadingWrapper } from '@/shared/components/ui/DataLoadingWrapper';
import { ROUTES } from '@/config/routes';
import { usePagination } from '@/shared/hooks/usePagination';
import { useDeleteShiftAction } from '../../hooks/admin/useDeleteShiftAction';
import { useShiftFilters } from '../../hooks/shared/useShiftFilters';
import { ShiftsListSkeleton } from '../shared/ShiftsListSkeleton';
import { ShiftFilters } from './ShiftFilters';
import { ShiftManagementTable } from './ShiftManagementTable';
import { GetAllShiftsStatus } from '@/api/generated/model';

export interface AdminShiftsListProps {
  status?: GetAllShiftsStatus;
}

export const AdminShiftsList = ({ status }: AdminShiftsListProps = {}) => {
  const { t } = useTranslation(['app', 'common']);
  const { page, size, setPage } = usePagination({ defaultSize: 25 });
  const { driverId, dateFrom, dateTo } = useShiftFilters();

  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    error,
  } = useGetAllShifts({
    page,
    size,
    driverId,
    dateFrom,
    dateTo,
    status,
  });
  const pageData = response?.data;
  const shifts = pageData?.content || [];
  const totalPages = pageData?.totalPages || 1;
  const isEmpty = !isLoading && shifts.length === 0;

  const { handleDelete } = useDeleteShiftAction();

  const actions = {
    onViewDetails: (shift: any) => navigate(ROUTES.app.shifts.view.getHref(shift.id)),
    onEdit: (shift: any) => navigate(ROUTES.app.shifts.edit.getHref(shift.id)),
    onDelete: handleDelete,
  };

  return (
    <Stack gap="md">
      <ShiftFilters />
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
            <Text c="dimmed">{t('app:shifts.empty')}</Text>
          </Paper>
        }
      >
        <ShiftManagementTable
          shifts={shifts}
          actions={actions}
        />

        <AppPagination
          page={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      </DataLoadingWrapper>
    </Stack>
  );
};
