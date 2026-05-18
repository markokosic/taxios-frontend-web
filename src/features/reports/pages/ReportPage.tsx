import { useState } from 'react';
import { PlusCircle, ReceiptEuro } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { PageLayout } from 'src/components/layout/PageLayout';
import { Group, Paper, Select, SimpleGrid, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useMediaQuery } from '@mantine/hooks';
import { ActionMenu } from '@/components/ui/Menu';
import { SpeedDial } from '@/components/ui/Menu/SpeedDial';
import { ROUTES } from '@/config/routes';
import { useGetRevenueReport } from '../hooks/useGetRevenueReport';
import { GroupByEnum, GroupBySchema } from '../report-schema';

//TODO rename into RevenueReportPage?
export const ReportPage = () => {
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<string | null>('');

  const { t } = useTranslation(['reports']);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetRevenueReport({
    dateFrom: '2026-05-01',
    dateTo: '2026-05-31',
    groupBy: 'NONE',
  });

  // console.log(data?.totals);

  // const navigateToBulkRevenues = () => navigate(ROUTES.app.revenues.createBulk.getHref());

  // const menuActions = [
  //   {
  //     label: t('record_revenue.daily'),
  //     icon: ReceiptEuro,
  //     onClick: navigateToBulkRevenues,
  //   },
  //   {
  //     //TODO OPEN MODAL HERE
  //     label: t('record_revenue.single'),
  //     icon: ReceiptEuro,
  //     onClick: () => null,
  //   },
  // ];

  const groupByOptions =
    GroupBySchema.options?.map((option) => ({
      label: `${option} `,
      value: option,
    })) ?? [];

  return (
    <PageLayout
      title={t('common:revenues')}
      showBack={false}
      // actions={<ActionMenu actions={menuActions} />}
    >
      <DatePickerInput
        label="Pick start date"
        placeholder="Pick date"
        value={dateFrom}
        onChange={setDateFrom}
      />
      <DatePickerInput
        label="Pick end date"
        placeholder="Pick date"
        value={dateTo}
        onChange={setDateTo}
      />
      <Select
        label="Your favorite library"
        placeholder="Pick value"
        value={groupBy}
        onChange={setGroupBy}
        data={GroupBySchema.options}
      />
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
        <Paper
          withBorder
          p="md"
          radius="md"
          key={'bbbas'}
        >
          <Group justify="space-between">
            <Text
              size="xs"
              c="dimmed"
            >
              Revenue
            </Text>
            {/* <Icon
            size={22}
            stroke={1.5}
          /> */}
          </Group>

          <Group
            justify="flex-end"
            gap="xs"
            mt={25}
          >
            <Text>{data?.totals?.companyShare} €</Text>
          </Group>

          <Text
            fz="xs"
            c="dimmed"
            mt={7}
          >
            Total KM
          </Text>
        </Paper>
      </SimpleGrid>
      <>asdf</>
    </PageLayout>
  );
};
