import { Paper, Table } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { ShiftResponse } from '@/api/generated/model';
import { ShiftActions, ShiftTableRow } from './ShiftTableRow';

export interface ShiftManagementTableProps {
  shifts: ShiftResponse[];
  actions: ShiftActions;
}

export const ShiftManagementTable = ({ shifts, actions }: ShiftManagementTableProps) => {
  const { t } = useTranslation(['app', 'common']);

  return (
    <Paper withBorder radius="md" p="0" style={{ overflow: 'hidden' }}>
      <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('app:shifts.table.id')}</Table.Th>
            <Table.Th>{t('app:shifts.table.date')}</Table.Th>
            <Table.Th>{t('app:shifts.table.time')}</Table.Th>
            <Table.Th>{t('app:shifts.table.driver')}</Table.Th>
            <Table.Th>{t('app:shifts.table.license_plate')}</Table.Th>
            <Table.Th>{t('app:shifts.table.car')}</Table.Th>
            <Table.Th>{t('app:shifts.table.km')}</Table.Th>
            <Table.Th style={{ textAlign: 'right' }}>
              {t('app:shifts.table.total_revenue')}
            </Table.Th>
            <Table.Th style={{ textAlign: 'right' }}>
              {t('app:shifts.table.driver_payout')}
            </Table.Th>
            <Table.Th style={{ textAlign: 'right' }}>
              {t('app:shifts.table.company_share')}
            </Table.Th>
            <Table.Th>{t('app:shifts.table.status')}</Table.Th>
            <Table.Th style={{ textAlign: 'right' }}>{t('app:shifts.table.actions')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {shifts.map((shift) => (
            <ShiftTableRow
              key={shift.id}
              shift={shift}
              actions={actions}
            />
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
};
