import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Anchor, Button, Divider, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { ROUTES } from '@/config/routes';
import { RegisterForm } from '../components/RegisterForm';

const RegisterPage = () => {
  const { t } = useTranslation('app');

  return (
    <Paper withBorder shadow="sm" p="xl" radius="md">
      <Stack gap="md">
        {/* Top: Title & Subtitle */}
        <Stack gap={4}>
          <Title order={2} fw={700}>
            {t('auth.register.title')}
          </Title>
          <Text c="dimmed" size="sm">
            {t('auth.register.submit')}
          </Text>
        </Stack>

        {/* Middle: Form */}
        <RegisterForm />

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

        {/* Bottom: Login Link */}
        <Text size="sm" ta="center" c="dimmed" pt="xs">
          {t('auth.account.existingAccount')}{' '}
          <Anchor component={Link} to={ROUTES.auth.login.path} fw={600} size="sm">
            {t('auth.login.title')}
          </Anchor>
        </Text>
      </Stack>
    </Paper>
  );
};

export default RegisterPage;
