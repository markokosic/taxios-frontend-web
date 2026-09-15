import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Anchor, ScrollArea, Table } from '@mantine/core';
import { ROUTES } from '@/config/routes';
import { createFormatters } from '@/shared/utils';
import { GroupBy, RevenueReportData, RevenueReportRow } from '../domain/reports-schemas';
import { EntryCategoryBadge } from './EntryCategoryBadge';

type ReportTableProps = {
  data: RevenueReportData | undefined;
  isLoading: boolean;
  groupBy?: GroupBy | null;
};

export const ReportTable = ({ data, isLoading, groupBy }: ReportTableProps) => {
  const { i18n, t } = useTranslation(['app', 'common']);
  const fmt = createFormatters(i18n.language);

  if (isLoading) {
    return null;
  }
  if (!data || data.rows.length === 0) {
    return null;
  }

  const getDateFormat = (groupBy?: GroupBy | null) => {
    switch (groupBy) {
      case 'MONTH':
        return 'MMMM YYYY';
      case 'YEAR':
        return 'YYYY';
      case 'DAY':
      case 'NONE':
      default:
        return 'DD.MM.YYYY';
    }
  };

  const dateFormat = getDateFormat(groupBy);

  const rows = data.rows.map((row: RevenueReportRow, index) => (
    <Table.Tr key={index}>
      <Table.Td>{row.date ? dayjs(row.date).format(dateFormat) : '-'}</Table.Td>
      <Table.Td>
        {row.shiftId != null ? (
          <Anchor
            component={Link}
            to={ROUTES.app.shifts.view.getHref(row.shiftId)}
            fw={500}
            size="sm"
          >
            #{row.shiftId}
          </Anchor>
        ) : (
          '-'
        )}
      </Table.Td>
      <Table.Td>
        <EntryCategoryBadge category={row.entryCategory} />
      </Table.Td>
      <Table.Td>
        {row.drivers && row.drivers.length > 0
          ? row.drivers
              .map((d) => `${d.firstName ?? ''} ${d.lastName ?? ''}`.trim())
              .filter(Boolean)
              .join(', ') || '-'
          : '-'}
      </Table.Td>
      <Table.Td ta="right">
        {row.revenue !== undefined ? `${fmt.number(row.revenue)} €` : '-'}
      </Table.Td>
      <Table.Td ta="right">
        {row.companyRemuneration !== undefined ? `${fmt.number(row.companyRemuneration)} €` : '-'}
      </Table.Td>
      <Table.Td ta="right">
        {row.driverRemuneration !== undefined ? `${fmt.number(row.driverRemuneration)} €` : '-'}
      </Table.Td>
      <Table.Td ta="right">{row.entryCount ?? '-'}</Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea
      h={600}
      offsetScrollbars
    >
      <Table
        striped
        highlightOnHover
        verticalSpacing="sm"
        stickyHeader
        stickyHeaderOffset={0}
      >
        <Table.Thead
          bg="var(--mantine-color-body)"
          style={{ zIndex: 1 }}
        >
          <Table.Tr>
            <Table.Th>{t('common:date')}</Table.Th>
            <Table.Th>{t('app:reports.shift_id', 'Schicht-ID')}</Table.Th>
            <Table.Th>{t('app:reports.category', 'Kategorie')}</Table.Th>
            <Table.Th>{t('common:drivers')}</Table.Th>
            <Table.Th ta="right">{t('common:revenue')}</Table.Th>
            <Table.Th ta="right">{t('app:reports.company_share')}</Table.Th>
            <Table.Th ta="right">{t('app:reports.driver_share')}</Table.Th>
            <Table.Th ta="right">{t('app:reports.rides')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
};
