import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Form } from 'src/components/ui/Form';
import { Box, Button } from '@mantine/core';
import { getUpdateDriverSchema } from '../drivers-schemas';
import { Driver, UpdateDriverRequest } from '../drivers-types';
import { useUpdateDriver } from '../hooks/useUpdateDriver';
import { DriverForm } from './DriverForm';

interface DriverUpdateFormProps {
  driver: Driver;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export const DriverUpdateForm = ({ driver, onCancel, onSuccess }: DriverUpdateFormProps) => {
  const { t } = useTranslation();
  const { mutate, isPending } = useUpdateDriver();

  const methods = useForm<UpdateDriverRequest>({
    resolver: zodResolver(getUpdateDriverSchema(t)),
    mode: 'onChange',
    defaultValues: {
      firstName: driver.firstName,
      lastName: driver.lastName,
      phone: driver.phone,
      email: driver.email,
      remunerationConfig: driver.currentRemunerationConfig,
    },
  });

  const onSubmit = (data: UpdateDriverRequest) => {
    const changedFields: UpdateDriverRequest = {};

    Object.keys(methods.formState.dirtyFields).forEach((key) => {
      const fieldKey = key as keyof UpdateDriverRequest;
      if (fieldKey === 'remunerationConfig') {
        //TODO use loadash or other deep comparison
        if (
          JSON.stringify(data.remunerationConfig) !==
          JSON.stringify(driver.currentRemunerationConfig)
        ) {
          changedFields.remunerationConfig = data.remunerationConfig;
        }
      } else {
        changedFields[fieldKey] = data[fieldKey] as any;
      }
    });

    if (Object.keys(changedFields).length === 0) {
      return;
    }

    mutate(
      { driverId: driver.id, data: changedFields },
      {
        onSuccess: () => {
          toast.success(t('drivers:notifications.edit.success'));
          onSuccess?.();
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
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
              >
                {t('common:actions.cancel')}
              </Button>
            )}
            <Button
              type="submit"
              loading={isPending}
              disabled={!methods.formState.isDirty || isPending}
            >
              {t('common:actions.save')}
            </Button>
          </>
        }
      >
        <DriverForm />
      </Form>
    </Box>
  );
};
