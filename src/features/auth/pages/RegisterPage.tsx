import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button, Center, Stack, Text, Title } from '@mantine/core';
import { ROUTES } from '@/config/routes';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

const RegisterPage = () => {
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
          <Title order={1}>{t('auth.register.title')}</Title>
          <Text c="dimmed">{t('auth.register.submit')}</Text>
        </Stack>
      </Center>
      <RegisterForm />

      <Center pt="xl">
        <Stack
          align="center"
          w="100%"
        >
          <Text c="dimmed">{t('auth.account.existingAccount')}</Text>
          <Button
            fullWidth
            variant="outline"
          >
            <Link to={ROUTES.auth.login.path}>{t('auth.login.title')}</Link>
          </Button>
        </Stack>
      </Center>
    </>
  );
};

export default RegisterPage;
