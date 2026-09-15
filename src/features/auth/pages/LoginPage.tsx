import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Anchor, Button, Divider, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { ROUTES } from '@/config/routes';
import { LoginForm } from '../components/LoginForm';

const LoginPage = () => {
  const { t } = useTranslation('app');

  return (
    <Paper withBorder shadow="sm" p="xl" radius="md">
      <Stack gap="md">
        {/* Top: Title & Subtitle */}
        <Stack gap={4}>
          <Title order={2} fw={700}>
            {t('auth.login.title')}
          </Title>
          <Text c="dimmed" size="sm">
            {t('auth.login.subtitle')}
          </Text>
        </Stack>

        {/* Middle: Form */}
        <LoginForm />

        {/* Passwort vergessen Link */}
        <Group justify="flex-end" mt="-xs">
          <Anchor component={Link} to="#" size="xs" c="dimmed">
            {t('auth.login.forgotPassword')}
          </Anchor>
        </Group>

        {/* Social Logins Slot */}
        <Stack gap="xs" mt="xs">
          <Divider label="oder weiter mit" labelPosition="center" color="gray.3" />
          <Group grow gap="xs">
            <Button variant="default" radius="md" disabled size="xs" style={{ opacity: 0.6 }}>
              Google
            </Button>
            <Button variant="default" radius="md" disabled size="xs" style={{ opacity: 0.6 }}>
              iCloud
            </Button>
          </Group>
        </Stack>

        {/* Bottom: Register Link */}
        <Text size="sm" ta="center" c="dimmed" pt="xs">
          {t('auth.login.noAccountHint')}{' '}
          <Anchor component={Link} to={ROUTES.auth.register.path} fw={600} size="sm">
            {t('auth.register.linkCta')}
          </Anchor>
        </Text>
      </Stack>
    </Paper>
  );
};

export default LoginPage;
