import { useTranslation } from 'react-i18next';
import { useLoginForm } from '@/features/auth/hooks/useLoginForm';
import { Form } from '@/components/ui/Form';
import { ControlledTextInput } from '@/components/ui/ControlledTextInput/ControlledTextInput';
import { Button } from '@mantine/core';
import { AUTH_FORM_FIELDS } from '@/features/auth/config/auth-form-fields';

export const LoginForm = () => {
  const { t } = useTranslation(['common', 'app']);
  const { methods, onSubmit, isPending } = useLoginForm();
  const fields = [AUTH_FORM_FIELDS.email, AUTH_FORM_FIELDS.password];

  return (
    <Form
      methods={methods}
      onSubmit={onSubmit}
    >
      {fields.map((field) => (
        <ControlledTextInput
          key={field.name}
          {...field}
          label={t(field.labelKey)}
        />
      ))}
      <Button
        type="submit"
        fullWidth
        mt="xs"
        loading={isPending}
      >
        {t('app:auth.login.submit')}
      </Button>
    </Form>
  );
};
