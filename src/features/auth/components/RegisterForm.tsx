import { useTranslation } from 'react-i18next';
import { Button } from '@mantine/core';
import { ControlledTextInput } from '@/components/ui/ControlledTextInput/ControlledTextInput';
import { Form } from '@/components/ui/Form';
import { useRegisterForm } from '@/features/auth/hooks/useRegisterForm';
import { AUTH_FORM_FIELDS } from '../config/auth-form-fields';


export const RegisterForm = () => {
  const { t } = useTranslation(['common', 'app', 'errors']);
  const { methods, onSubmit, isPending } = useRegisterForm();
  const fields = [
    AUTH_FORM_FIELDS.tenantName,
    AUTH_FORM_FIELDS.firstName,
    AUTH_FORM_FIELDS.lastName,
    AUTH_FORM_FIELDS.email,
    AUTH_FORM_FIELDS.password,
    AUTH_FORM_FIELDS.confirmPassword,
  ];

  return (
    <Form
      methods={methods}
      onSubmit={onSubmit}
    >
      {fields.map((field) => (
        <ControlledTextInput
          key={field.name}
          name={field.name}
          type={field.type}
          label={t(field.labelKey)}
          placeholder={t(field.placeholderKey)}
          withAsterisk
        />
      ))}
      <Button
        mt="xs"
        type="submit"
        fullWidth
        loading={isPending}
      >
        {t('app:auth.register.submit')}
      </Button>
    </Form>
  );
};
