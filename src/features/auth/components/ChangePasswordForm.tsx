import { useTranslation } from 'react-i18next';
import { Button, Stack } from '@mantine/core';
import { ControlledPasswordInput } from '@/shared/components/forms/ControlledPasswordInput';
import { Form } from '@/shared/components/forms/Form';
import { AUTH_FORM_FIELDS } from '../domain/auth-form-fields';
import { useChangePasswordForm } from '../hooks/useChangePasswordForm';

export interface ChangePasswordFormProps {
  submitLabelKey?: string;
  onSuccess?: () => void;
  hideCurrentPassword?: boolean;
}

export const ChangePasswordForm = ({
  submitLabelKey = 'app:auth.changePassword.submit',
  onSuccess,
  hideCurrentPassword = false,
}: ChangePasswordFormProps) => {
  const { t } = useTranslation(['common', 'app', 'errors']);
  const { methods, onSubmit, isPending } = useChangePasswordForm({ onSuccess });

  return (
    <Form
      methods={methods}
      onSubmit={onSubmit}
    >
      <Stack gap="sm">
        {!hideCurrentPassword && (
          <ControlledPasswordInput
            {...AUTH_FORM_FIELDS.currentPassword}
            label={t(AUTH_FORM_FIELDS.currentPassword.labelKey)}
            placeholder={t(AUTH_FORM_FIELDS.currentPassword.placeholderKey)}
          />
        )}

        <ControlledPasswordInput
          {...AUTH_FORM_FIELDS.newPassword}
          label={t(AUTH_FORM_FIELDS.newPassword.labelKey)}
          placeholder={t(AUTH_FORM_FIELDS.newPassword.placeholderKey)}
        />

        <ControlledPasswordInput
          {...AUTH_FORM_FIELDS.confirmPassword}
          label={t(AUTH_FORM_FIELDS.confirmPassword.labelKey)}
          placeholder={t(AUTH_FORM_FIELDS.confirmPassword.placeholderKey)}
        />

        <Button
          type="submit"
          fullWidth
          mt="md"
          loading={isPending}
        >
          {t(submitLabelKey)}
        </Button>
      </Stack>
    </Form>
  );
};
