import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Form } from '@/components/ui/Form';
import { ROUTES } from '@/config/routes';
import { Box, Button } from '@mantine/core';
import { getCreateDriverSchema } from '../drivers-schemas';
import { CreateDriverRequest } from '../drivers-types';
import { useCreateDriver } from '../hooks/useCreateDriver';
import { DriverForm } from './DriverForm';

export const DriverCreateForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateDriver({});

  const methods = useForm({
    resolver: zodResolver(getCreateDriverSchema(t)),
    shouldUnregister: true,
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      remunerationConfigs: [{}],
    },
  });

  const onSubmit = (data: CreateDriverRequest) => {
    mutate(
      { data },
      {
        onSuccess: (response) => {
          const newId = response?.id;
          navigate(ROUTES.app.drivers.view.getHref(newId));
          toast.success(t('drivers:notifications.create.success'));
        },
      }
    );
  };

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
              {t('drivers:actions.add_driver')}
            </Button>
          </>
        }
      >
        <DriverForm />
      </Form>
    </Box>
  );
};
