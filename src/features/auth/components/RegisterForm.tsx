import { useTranslation } from 'react-i18next';
import { Button, SimpleGrid, Stack } from '@mantine/core';
import { ControlledPasswordInput } from '@/shared/components/forms/ControlledPasswordInput';
import { ControlledTextInput } from '@/shared/components/forms/ControlledTextInput';
import { Form } from '@/shared/components/forms/Form';
import { useRegisterForm } from '@/features/auth/hooks/useRegisterForm';
import { AUTH_FORM_FIELDS } from '../domain/auth-form-fields';

export const RegisterForm = () => {
  const { t } = useTranslation(['common', 'app', 'errors']);
  const { methods, onSubmit, isPending } = useRegisterForm();

  return (
    <Form
      methods={methods}
      onSubmit={onSubmit}
    >
      <Stack gap="sm">
        <ControlledTextInput
          {...AUTH_FORM_FIELDS.tenantName}
          label={t(AUTH_FORM_FIELDS.tenantName.labelKey)}
          placeholder={t(AUTH_FORM_FIELDS.tenantName.placeholderKey)}
          withAsterisk
        />

        <SimpleGrid
          cols={{ base: 1, sm: 2 }}
          spacing="sm"
        >
          <ControlledTextInput
            {...AUTH_FORM_FIELDS.firstName}
            label={t(AUTH_FORM_FIELDS.firstName.labelKey)}
            placeholder={t(AUTH_FORM_FIELDS.firstName.placeholderKey)}
            withAsterisk
          />
          <ControlledTextInput
            {...AUTH_FORM_FIELDS.lastName}
            label={t(AUTH_FORM_FIELDS.lastName.labelKey)}
            placeholder={t(AUTH_FORM_FIELDS.lastName.placeholderKey)}
            withAsterisk
          />
        </SimpleGrid>

        <ControlledTextInput
          {...AUTH_FORM_FIELDS.email}
          label={t(AUTH_FORM_FIELDS.email.labelKey)}
          placeholder={t(AUTH_FORM_FIELDS.email.placeholderKey)}
          withAsterisk
        />

        <ControlledPasswordInput
          {...AUTH_FORM_FIELDS.password}
          label={t(AUTH_FORM_FIELDS.password.labelKey)}
          placeholder={t(AUTH_FORM_FIELDS.password.placeholderKey)}
          withAsterisk
        />

        <ControlledPasswordInput
          {...AUTH_FORM_FIELDS.confirmPassword}
          label={t(AUTH_FORM_FIELDS.confirmPassword.labelKey)}
          placeholder={t(AUTH_FORM_FIELDS.confirmPassword.placeholderKey)}
          withAsterisk
        />

        <Button
          mt="md"
          type="submit"
          fullWidth
          loading={isPending}
        >
          {t('app:auth.register.submit')}
        </Button>
      </Stack>
    </Form>
  );
};
