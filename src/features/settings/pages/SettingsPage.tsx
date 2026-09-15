import { useTranslation } from 'react-i18next';
import { Divider, Paper, SimpleGrid, Stack, Title } from '@mantine/core';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { ColorSchemeSwitcher } from '../components/ColorSchemeSwitcher';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

const SettingsPage = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title={t('common:settings', 'Settings')}>
      <Stack gap="lg">
        <Paper
          withBorder
          p="lg"
          radius="md"
        >
          <Stack gap="md">
            <Title
              order={3}
              size="h4"
            >
              {t('common:appearance', 'Erscheinungsbild')}
            </Title>
            <Divider color="gray.2" />
            <SimpleGrid
              cols={{ base: 1, sm: 1 }}
              spacing="lg"
            >
              <LanguageSwitcher />
              <ColorSchemeSwitcher />
            </SimpleGrid>
          </Stack>
        </Paper>
      </Stack>
    </PageLayout>
  );
};

export default SettingsPage;
