import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Form } from '@/components/ui/Form';
import { Box, Button } from '@mantine/core';
import { useDriverCreateForm } from '../hooks/useDriverCreateForm';
import { DriverForm } from './DriverForm';

export const DriverCreateForm = () => {
  const { t } = useTranslation(['app', 'common', 'errors']);
  const navigate = useNavigate();
  const { methods, onSubmit, isPending } = useDriverCreateForm();

  return (
    <Box>
      <Form
        methods={methods}
        onSubmit={onSubmit}
        formActions={
          <>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
            >
              {t('common:actions.cancel')}
            </Button>
            <Button
              type="submit"
              loading={isPending}
              disabled={!methods.formState.isDirty || isPending}
            >
              {t('app:drivers.actions.add_driver')}
            </Button>
          </>
        }
      >
        <DriverForm />
      </Form>
    </Box>
  );
};
