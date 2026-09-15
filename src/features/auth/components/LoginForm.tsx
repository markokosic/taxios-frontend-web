import { useTranslation } from 'react-i18next';
import { Button, Stack } from '@mantine/core';
import { ControlledPasswordInput } from '@/shared/components/forms/ControlledPasswordInput';
import { ControlledTextInput } from '@/shared/components/forms/ControlledTextInput';
import { Form } from '@/shared/components/forms/Form';
import { AUTH_FORM_FIELDS } from '../domain/auth-form-fields';
import { useLoginForm } from '../hooks/useLoginForm';

export const LoginForm = () => {
  const { t } = useTranslation(['common', 'app']);
  const { methods, onSubmit, isPending } = useLoginForm();

  return (
    <Form
      methods={methods}
      onSubmit={onSubmit}
    >
      <Stack gap="sm">
        <ControlledTextInput
          {...AUTH_FORM_FIELDS.email}
          label={t(AUTH_FORM_FIELDS.email.labelKey)}
          placeholder={t(AUTH_FORM_FIELDS.email.placeholderKey)}
        />
        <ControlledPasswordInput
          {...AUTH_FORM_FIELDS.password}
          label={t(AUTH_FORM_FIELDS.password.labelKey)}
          placeholder={t(AUTH_FORM_FIELDS.password.placeholderKey)}
        />
        <Button
          type="submit"
          fullWidth
          mt="md"
          loading={isPending}
        >
          {t('app:auth.login.submit')}
        </Button>
      </Stack>
    </Form>
  );
};
