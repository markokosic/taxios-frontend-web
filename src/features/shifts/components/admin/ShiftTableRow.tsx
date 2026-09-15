import { Edit2, Eye, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Group, Table } from '@mantine/core';
import { ShiftResponse } from '@/api/generated/model';
import { ActionMenu } from '@/shared/components/ui/ActionMenu';
import { createFormatters } from '@/shared/utils';
import {
  calculateShiftTotals,
  formatShiftDate,
  formatShiftTime,
} from '../../domain/shift-calculations';
import { ShiftStatusBadge } from '../shared/ShiftStatusBadge';

export interface ShiftActions {
  onViewDetails: (shift: ShiftResponse) => void;
  onEdit?: (shift: ShiftResponse) => void;
  onDelete?: (shift: ShiftResponse) => void;
}

interface ShiftTableRowProps {
  shift: ShiftResponse;
  actions: ShiftActions;
}

export const ShiftTableRow = ({ shift, actions }: ShiftTableRowProps) => {
  const { t, i18n } = useTranslation(['app', 'common']);
  const fmt = createFormatters(i18n.language);

  const { totalRevenue, totalDriverRemuneration, totalCompanyRemuneration } =
    calculateShiftTotals(shift);

  const dateFormatted = formatShiftDate(shift.shiftStart);
  const timeFormatted = `${formatShiftTime(shift.shiftStart)} - ${formatShiftTime(shift.shiftEnd)}`;

  return (
    <Table.Tr
      onClick={() => actions.onViewDetails(shift)}
      style={{ cursor: 'pointer' }}
    >
      <Table.Td fw={500}>#{shift.id}</Table.Td>
      <Table.Td fw={500}>{dateFormatted}</Table.Td>
      <Table.Td>{timeFormatted}</Table.Td>
      <Table.Td>
        {shift.driver ? `${shift.driver.firstName} ${shift.driver.lastName}` : '-'}
      </Table.Td>
      <Table.Td>{shift.car?.licensePlate || '-'}</Table.Td>
      <Table.Td>
        {shift.car ? `${shift.car.brand || ''} ${shift.car.model || ''}`.trim() || '-' : '-'}
      </Table.Td>
      <Table.Td>
        {shift.kilometersDriven !== undefined ? `${shift.kilometersDriven} km` : '-'}
      </Table.Td>
      <Table.Td
        style={{ textAlign: 'right' }}
        fw={600}
      >
        {fmt.number(totalRevenue)} €
      </Table.Td>
      <Table.Td
        style={{ textAlign: 'right' }}
        c="teal"
      >
        {fmt.number(totalDriverRemuneration)} €
      </Table.Td>
      <Table.Td
        style={{ textAlign: 'right' }}
        c="indigo"
      >
        {fmt.number(totalCompanyRemuneration)} €
      </Table.Td>
      <Table.Td>
        <ShiftStatusBadge status={shift.status} />
      </Table.Td>
      <Table.Td
        style={{ textAlign: 'right' }}
        onClick={(e) => e.stopPropagation()}
      >
        <Group
          gap="xs"
          justify="flex-end"
        >
          <ActionMenu
            actions={[
              {
                label: t('app:shifts.actions.view_details', 'Details'),
                icon: Eye,
                onClick: () => actions.onViewDetails(shift),
              },
              {
                label: t('common:actions.edit', 'Bearbeiten'),
                icon: Edit2,
                onClick: () => actions.onEdit?.(shift),
              },
              ...(actions.onDelete
                ? [
                    {
                      label: t('common:actions.delete', 'Löschen'),
                      icon: Trash2,
                      isDanger: true,
                      onClick: () => actions.onDelete?.(shift),
                    },
                  ]
                : []),
            ]}
          />
        </Group>
      </Table.Td>
    </Table.Tr>
  );
};
