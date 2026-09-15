import { ReactNode } from 'react';
import { Group, Paper, PaperProps, Text } from '@mantine/core';

type StatsCardProps = PaperProps & {
  title: string;
  value: ReactNode;
  description?: string;
  icon?: ReactNode;
};

export function StatsCard({ title, value, description, icon, ...paperProps }: StatsCardProps) {
  return (
    <Paper
      withBorder
      p="md"
      {...paperProps}
    >
      <Group justify="space-between">
        <Text
          size="xs"
          c="dimmed"
        >
          {title}
        </Text>

        {icon}
      </Group>

      <Group
        justify="flex-end"
        gap="xs"
        mt={25}
      >
        <Text>{value}</Text>
      </Group>

      {description && (
        <Text
          fz="xs"
          c="dimmed"
          mt={7}
        >
          {description}
        </Text>
      )}
    </Paper>
  );
}
