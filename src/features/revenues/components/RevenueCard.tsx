import React from 'react';
import { ArrowRight, Clock, Edit2, Route, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Badge,
  Box,
  Flex,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { RemunerationModelType } from '@/features/remuneration/remuneration-types';
import { getTimeDuration } from '@/lib/utils';

interface RevenueCardProps {
  item: any;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  getRemunerationLabel: (type: RemunerationModelType) => string;
}

export const RevenueCard = ({ item, onEdit, onDelete, getRemunerationLabel }: RevenueCardProps) => {
  const { t } = useTranslation(['revenues', 'common']);

  const carLabel = item.car?.licensePlate ?? item.licensePlate ?? t('common:car');

  const exactDuration = getTimeDuration(item.drivingStartTime, item.drivingEndTime);

  const driverName = item.driver
    ? `${item.driver.firstName} ${item.driver.lastName}`
    : item.driverFirstName && item.driverLastName
      ? `${item.driverFirstName} ${item.driverLastName}`
      : '';

  return (
    <Paper
      p="md"
      withBorder
      radius="md"
      className="hover:shadow-md hover:translate-y-[-2px] transition-all duration-200"
    >
      <Grid
        gutter="lg"
        align="center"
      >
        {/* 1. COLUMN: Typ, Name, Datum, Kennzeichen */}
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Stack gap="xs">
            <Group>
              <Badge
                variant="filled"
                color="indigo"
                size="sm"
                radius="xl"
              >
                {getRemunerationLabel(item.remunerationModelType)}
              </Badge>
            </Group>

            <Text
              fw={600}
              size="md"
              c="dark.4"
            >
              {driverName}
            </Text>

            <Text
              size="sm"
              c="dimmed"
            >
              {item.date}
            </Text>

            <Text
              size="xs"
              fw={500}
              c="dimmed"
              style={{ wordBreak: 'break-all' }}
            >
              {carLabel}
            </Text>
          </Stack>
        </Grid.Col>

        {/* 2. COLUMN: km gesamt & km von/bis */}
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Stack gap="4px">
            <Group
              gap="4px"
              c="dimmed"
            >
              <Route size={14} />
              <Text
                size="xs"
                fw={500}
              >
                {t('revenues:fields.kilometers_driven')}
              </Text>
            </Group>

            <Text
              size="md"
              fw={700}
            >
              {item.kilometersDriven} km
            </Text>

            <Text
              size="xs"
              c="dimmed"
            >
              {item.kilometersFrom} km{' '}
              <ArrowRight
                size={10}
                className="inline align-middle"
              />{' '}
              {item.kilometersTo} km
            </Text>
          </Stack>
        </Grid.Col>

        {/* 3. COLUMN: Uhrzeit gesamt & von/bis */}
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Stack gap="4px">
            <Group
              gap="4px"
              c="dimmed"
            >
              <Clock size={14} />
              <Text
                size="xs"
                fw={500}
              >
                {t('revenues:sections.route_and_times')}
              </Text>
            </Group>

            <Text
              size="md"
              fw={700}
              c="dark.4"
            >
              {exactDuration}
            </Text>

            <Text
              size="xs"
              c="dimmed"
            >
              {item.drivingStartTime?.substring(0, 5) || '-'} bis{' '}
              {item.drivingEndTime?.substring(0, 5) || '-'}
            </Text>
          </Stack>
        </Grid.Col>

        {/* 4. COLUMN: Prominent Umsatz, Firmenanteil, Fahreranteil */}
        <Grid.Col span={{ base: 12, md: 2 }}>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--mantine-spacing-xs)',
              alignItems: 'var(--align-responsive, flex-end)',
            }}
            className="[--align-responsive:flex-start] md:[--align-responsive:flex-end]"
          >
            <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'inherit' }}>
              <Text
                size="xs"
                c="dimmed"
                fw={500}
                lts="0.5px"
              >
                UMSATZ
              </Text>
              <Text
                fw={800}
                size="xl"
                c="teal.7"
              >
                {item.revenue.toFixed(2)} €
              </Text>
            </Box>

            <Stack
              gap="2px"
              w="100%"
            >
              <Group
                gap="xs"
                justify="space-between"
                w="100%"
              >
                <Text
                  size="xs"
                  c="dimmed"
                >
                  Firma:
                </Text>
                <Text
                  size="xs"
                  fw={600}
                  c="grape.6"
                >
                  {item.companyRemuneration.toFixed(2)} €
                </Text>
              </Group>

              <Group
                gap="xs"
                justify="space-between"
                w="100%"
              >
                <Text
                  size="xs"
                  c="dimmed"
                >
                  Fahrer:
                </Text>
                <Text
                  size="xs"
                  fw={600}
                  c="blue.6"
                >
                  {item.driverRemuneration.toFixed(2)} €
                </Text>
              </Group>
            </Stack>
          </Box>
        </Grid.Col>

        {/* 5. COLUMN: Dedizierter Platz für Actions */}
        <Grid.Col span={{ base: 12, md: 1 }}>
          <Flex
            direction="column"
            gap="md"
            justify="center"
            align="center"
          >
            <Tooltip label={t('common:actions.edit')}>
              <ActionIcon
                variant="light"
                color="blue"
                onClick={() => onEdit(item)}
                size="md"
                radius="md"
              >
                <Edit2 size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={t('common:actions.edit')}>
              <ActionIcon
                variant="light"
                color="red"
                onClick={() => onDelete(item)}
                size="md"
                radius="md"
              >
                <Trash size={16} />
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};
