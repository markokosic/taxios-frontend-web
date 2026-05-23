import {
  Group,
  Paper,
  PaperProps,
  Text,
} from "@mantine/core";
import { ReactNode } from "react";

type StatsCardProps = PaperProps & {
  title: string;
  value: ReactNode;
  description?: string;
  icon?: ReactNode;
};

export function StatsCard({
  title,
  value,
  description,
  icon,
  ...paperProps
}: StatsCardProps) {
  return (
    <Paper
      withBorder
      p="md"
      radius="md"
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