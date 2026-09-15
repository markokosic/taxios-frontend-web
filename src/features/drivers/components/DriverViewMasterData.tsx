import { Badge, Card, Divider, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { Calendar, Mail, Phone, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { DriverResponse, DriverResponseStatus } from '@/api/generated/model';

interface DriverViewMasterDataProps {
  driver: DriverResponse;
}

export const DriverViewMasterData = ({ driver }: DriverViewMasterDataProps) => {
  const { t } = useTranslation(['common', 'app']);

  const isStatusActive = driver.status === DriverResponseStatus.ACTIVE;

  return (
    <Card
      withBorder
      radius="md"
      p="lg"
      shadow="sm"
    >
      <Group
        justify="space-between"
        align="center"
        mb="md"
      >
        <Text
          fw={600}
          size="xl"
        >
          {t('common:master_data')}
        </Text>
        <Group gap="xs">
          <Badge
            color={isStatusActive ? 'green' : 'gray'}
            size="lg"
            variant="light"
          >
            {isStatusActive ? t('common:status.active') : driver.status}
          </Badge>
          {driver.userId ? (
            <Badge
              color="blue"
              size="lg"
              variant="light"
            >
              {t('app:drivers.status.has_user')}
            </Badge>
          ) : (
            <Badge
              color="gray"
              size="lg"
              variant="outline"
            >
              {t('app:drivers.status.no_user')}
            </Badge>
          )}
        </Group>
      </Group>

      <Divider mb="lg" />

      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3 }}
        spacing="xl"
      >
        <Stack gap="xs">
          <Group
            gap="xs"
            c="dimmed"
          >
            <User size={18} />
            <Text fw={500}>{t('common:form.firstName.label')}</Text>
          </Group>
          <Text
            fw={600}
            size="lg"
          >
            {driver.firstName} {driver.lastName}
          </Text>
        </Stack>

        <Stack gap="xs">
          <Group
            gap="xs"
            c="dimmed"
          >
            <Mail size={18} />
            <Text fw={500}>{t('common:form.email.label')}</Text>
          </Group>
          <Text
            fw={600}
            size="lg"
          >
            {driver.email || '-'}
          </Text>
        </Stack>

        <Stack gap="xs">
          <Group
            gap="xs"
            c="dimmed"
          >
            <Phone size={18} />
            <Text fw={500}>{t('common:form.phone.label')}</Text>
          </Group>
          <Text
            fw={600}
            size="lg"
          >
            {driver.phone || '-'}
          </Text>
        </Stack>

        {driver.createdAt && (
          <Stack gap="xs">
            <Group
              gap="xs"
              c="dimmed"
            >
              <Calendar size={18} />
              <Text fw={500}>{t('common:date')}</Text>
            </Group>
            <Text
              fw={600}
              size="md"
            >
              {dayjs(driver.createdAt).format('DD.MM.YYYY HH:mm')}
            </Text>
          </Stack>
        )}
      </SimpleGrid>
    </Card>
  );
};
