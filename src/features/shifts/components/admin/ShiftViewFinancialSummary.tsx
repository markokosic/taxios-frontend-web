import { Banknote, Building2, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Group, Paper, SimpleGrid, Text, ThemeIcon } from '@mantine/core';
import { createFormatters } from '@/shared/utils';

interface ShiftViewFinancialSummaryProps {
  totalRevenue: number;
  totalDriverRemuneration: number;
  totalCompanyRemuneration: number;
}

export const ShiftViewFinancialSummary = ({
  totalRevenue,
  totalDriverRemuneration,
  totalCompanyRemuneration,
}: ShiftViewFinancialSummaryProps) => {
  const { t, i18n } = useTranslation(['app']);
  const fmt = createFormatters(i18n.language);

  return (
    <SimpleGrid
      cols={{ base: 1, sm: 3 }}
      spacing="md"
    >
      <Paper
        withBorder
        p="md"
        radius="md"
        shadow="sm"
      >
        <Group
          justify="space-between"
          align="flex-start"
          mb="xs"
        >
          <Text
            size="sm"
            c="dimmed"
            fw={500}
            tt="uppercase"
          >
            {t('app:shifts.table.total_revenue')}
          </Text>
          <ThemeIcon
            color="blue"
            variant="light"
            size="lg"
            radius="md"
          >
            <Wallet size={20} />
          </ThemeIcon>
        </Group>
        <Text
          fw={700}
          size="xl"
          c="blue.7"
        >
          {fmt.number(totalRevenue)} €
        </Text>
      </Paper>

      <Paper
        withBorder
        p="md"
        radius="md"
        shadow="sm"
      >
        <Group
          justify="space-between"
          align="flex-start"
          mb="xs"
        >
          <Text
            size="sm"
            c="dimmed"
            fw={500}
            tt="uppercase"
          >
            {t('app:shifts.table.driver_payout')}
          </Text>
          <ThemeIcon
            color="teal"
            variant="light"
            size="lg"
            radius="md"
          >
            <Banknote size={20} />
          </ThemeIcon>
        </Group>
        <Text
          fw={700}
          size="xl"
          c="teal.7"
        >
          {fmt.number(totalDriverRemuneration)} €
        </Text>
      </Paper>

      <Paper
        withBorder
        p="md"
        radius="md"
        shadow="sm"
      >
        <Group
          justify="space-between"
          align="flex-start"
          mb="xs"
        >
          <Text
            size="sm"
            c="dimmed"
            fw={500}
            tt="uppercase"
          >
            {t('app:shifts.table.company_share')}
          </Text>
          <ThemeIcon
            color="indigo"
            variant="light"
            size="lg"
            radius="md"
          >
            <Building2 size={20} />
          </ThemeIcon>
        </Group>
        <Text
          fw={700}
          size="xl"
          c="indigo.7"
        >
          {fmt.number(totalCompanyRemuneration)} €
        </Text>
      </Paper>
    </SimpleGrid>
  );
};
