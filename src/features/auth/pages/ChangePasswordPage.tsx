import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { LogOut, ShieldCheck } from 'lucide-react';

import { ROUTES } from '@/config/routes';
import { ChangePasswordForm } from '@/features/auth/components/ChangePasswordForm';
import { useAuth } from '../hooks/useAuth';

export const ChangePasswordPage = () => {
  const { t } = useTranslation(['common', 'app']);
  const navigate = useNavigate();
  const { user, logout, isLoggingOut } = useAuth();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate(ROUTES.auth.login.path);
      },
      onError: () => {
        navigate(ROUTES.auth.login.path);
      },
    });
  };

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
  const displayName = fullName || user?.email || '';
  const userRole = user?.role as string | undefined;


  return (
    <Paper
      withBorder
      shadow="sm"
      p="xl"
      radius="md"
    >
      <Stack gap="md">
        {/* HEADER & PERSONALIZED GREETING */}
        <Stack gap={4}>
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={2} fw={700}>
                {t('app:auth.changePassword.firstLogin.greeting', {
                  name: displayName,
                })}
              </Title>
              <Text c="dimmed" size="sm" mt={2}>
                {t('app:auth.changePassword.firstLogin.subtitle')}
              </Text>
            </div>
          </Group>
        </Stack>

        {/* LOGGED IN USER INFO BADGE */}
        {user && (
          <Paper withBorder p="xs" radius="sm" bg="var(--mantine-color-gray-light)">
            <Group justify="space-between">
              <Group gap="xs">
                <Avatar
                  size="sm"
                  radius="xl"
                  color="blue"
                >
                  {displayName.slice(0, 2).toUpperCase()}
                </Avatar>
                <div>
                  <Text size="xs" fw={500}>
                    {displayName}
                  </Text>
                  {user.email && (
                    <Text size="xs" c="dimmed">
                      {user.email}
                    </Text>
                  )}
                </div>
              </Group>

              {userRole && (
                <Badge size="sm" variant="light" color="blue">
                  {userRole}
                </Badge>
              )}
            </Group>
          </Paper>
        )}

        {/* SECURITY NOTICE ALERT */}
        <Alert
          icon={<ShieldCheck size={18} />}
          color="blue"
          variant="light"
          radius="md"
        >
          {t('app:auth.changePassword.firstLogin.securityNotice')}
        </Alert>

        {/* REUSABLE FORM COMPONENT */}
        <ChangePasswordForm />

        {/* LOGOUT BUTTON */}
        <Group justify="center" mt="xs">
          <Button
            variant="subtle"
            color="gray"
            size="xs"
            leftSection={<LogOut size={14} />}
            onClick={handleLogout}
            loading={isLoggingOut}
          >
            {t('app:auth.logout.title')}
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};

export default ChangePasswordPage;
