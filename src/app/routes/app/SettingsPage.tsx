import { useTranslation } from 'react-i18next';
import { Paper, Stack, Title, Divider } from '@mantine/core';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher/LanguageSwitcher';
import { PageLayout } from '@/components/layout/PageLayout';

const SettingsPage = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title={t('common:settings', 'Settings')}>
      <Stack gap="lg">
        <Paper withBorder p="md" radius="md">
          <Stack gap="md">
            <Title order={3} size="h4">
              {t('common:appearance', 'Appearance')}
            </Title>
            <Divider />
            <LanguageSwitcher />
          </Stack>
        </Paper>
      </Stack>
    </PageLayout>
  );
};

export default SettingsPage;
