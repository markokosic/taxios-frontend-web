import { Moon, Sun, SunMoon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Center, Group, SegmentedControl, Stack, Text, useMantineColorScheme } from '@mantine/core';

export const ColorSchemeSwitcher = () => {
  const { t } = useTranslation();
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <Stack gap="xs">
      <Text fw={500} size="sm">
        {t('common:theme', 'Design / Theme')}
      </Text>
      <SegmentedControl
        value={colorScheme}
        onChange={(value) => setColorScheme(value as 'light' | 'dark' | 'auto')}
        data={[
          {
            value: 'light',
            label: (
              <Center>
                <Group gap={6}>
                  <Sun size={16} />
                  <span>{t('common:theme_light', 'Hell')}</span>
                </Group>
              </Center>
            ),
          },
          {
            value: 'dark',
            label: (
              <Center>
                <Group gap={6}>
                  <Moon size={16} />
                  <span>{t('common:theme_dark', 'Dunkel')}</span>
                </Group>
              </Center>
            ),
          },
          {
            value: 'auto',
            label: (
              <Center>
                <Group gap={6}>
                  <SunMoon size={16} />
                  <span>{t('common:theme_auto', 'System')}</span>
                </Group>
              </Center>
            ),
          },
        ]}
      />
    </Stack>
  );
};
