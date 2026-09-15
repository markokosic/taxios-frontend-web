import { Badge, Card, Group, Stack, Text } from '@mantine/core';
import { Car as CarIcon, Gauge, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CarResponse as Car, CarResponseStatus } from '@/api/generated/model';

interface CarCardProps {
  car: Car;
}

export const CarCard = ({ car }: CarCardProps) => {
  const { t } = useTranslation(['app', 'common']);

  const isStatusActive = car.status === CarResponseStatus.ACTIVE;

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      h="100%"
      w={{ base: '100%', sm: 320 }}
    >
      <Stack
        gap="xs"
        justify="space-between"
        style={{ height: '100%' }}
      >
        <Stack gap="xs">
          {/* Top Row: Status Badge */}
          {car.status && (
            <Group justify="flex-start">
              <Badge
                variant="light"
                color={isStatusActive ? 'green' : 'gray'}
                size="xs"
              >
                {isStatusActive ? t('common:status.active') : car.status}
              </Badge>
            </Group>
          )}

          {/* Car Brand & Model */}
          <Group gap="xs" wrap="nowrap">
            <CarIcon size={18} color="var(--mantine-color-blue-6)" style={{ flexShrink: 0 }} />
            <Text fw={600} size="md" truncate style={{ flex: 1 }}>
              {car.brand} {car.model}
            </Text>
          </Group>

          {/* License Plate & Horsepower Info */}
          <Stack gap="4px">
            {car.licensePlate && (
              <Group gap="xs" c="dimmed" wrap="nowrap">
                <Shield size={14} style={{ flexShrink: 0 }} />
                <Text size="xs" fw={500} truncate style={{ wordBreak: 'break-all' }}>
                  {car.licensePlate}
                </Text>
              </Group>
            )}

            {car.horsepower && (
              <Group gap="xs" c="dimmed" wrap="nowrap">
                <Gauge size={14} style={{ flexShrink: 0 }} />
                <Text size="xs" truncate>
                  {car.horsepower} {car.horsepower.toLowerCase().includes('ps') || car.horsepower.toLowerCase().includes('hp') ? '' : 'PS'}
                </Text>
              </Group>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};
