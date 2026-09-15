import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

type ColumnConfig = {
  desktop: { columns: number };
  mobile: { columns: number };
};

type FieldGroupProps = {
  children: ReactNode;
  columnConfig: ColumnConfig;
  groupNameKey?: string;
  description?: string;
};

export const FieldGroup = ({
  children,
  columnConfig,
  groupNameKey,
  description,
}: FieldGroupProps) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const columns = isMobile ? columnConfig.mobile.columns : columnConfig.desktop.columns;

  return (
    <Paper withBorder shadow="xs" p="lg" radius="md" mb="lg">
      <Stack gap="md">
        {groupNameKey && (
          <Stack gap={2}>
            <Text fw={700} size="md">
              {t(groupNameKey)}
            </Text>
            {description && (
              <Text size="xs" c="dimmed">
                {description}
              </Text>
            )}
          </Stack>
        )}
        <SimpleGrid cols={columns} spacing="md" verticalSpacing="md">
          {children}
        </SimpleGrid>
      </Stack>
    </Paper>
  );
};
