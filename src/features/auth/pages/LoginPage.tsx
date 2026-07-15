import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Center, Flex, Stack, Text, Title } from '@mantine/core';
import { ROUTES } from '@/config/routes';
import { LoginForm } from '@/features/auth/components';

const LoginPage = () => {
  const { t } = useTranslation('app');
  return (
    <>
      <Center
        pb="xl"
        pt="xl"
      >
        <Stack
          align="center"
          gap="xs"
        >
          <Title order={1}>{t('auth.login.title')}</Title>
          <Text c="dimmed">{t('auth.login.subtitle')}</Text>
        </Stack>
      </Center>
      <LoginForm />

      <Flex
        pt="xl"
        justify="center"
        align="center"
        direction="column"
        gap="xs"
      >
        <Text
          c="dimmed"
          size="sm"
        >
          {t('auth.login.noAccountHint')}{' '}
          <Text
            td="underline"
            fw={700}
            component={Link}
            to={ROUTES.auth.register.path}
          >
            {t('auth.register.linkCta')}
          </Text>
        </Text>

        <Text
          component={Link}
          td="underline"
          c="dimmed"
          size="sm"
          to={ROUTES.auth.resetPassword.path}
        >
          {t('auth.login.forgotPassword')}
        </Text>
      </Flex>
    </>
  );
};

export default LoginPage;
