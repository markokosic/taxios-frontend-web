import { PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button, Stack } from '@mantine/core';
import { Form } from '@/components/ui/Form';
import { useCreateRevenueRecordsBulkForm } from '../hooks/useCreateRevenueRecordsBulkForm';
import { CreateRevenueRecordRow } from './CreateRevenueRecordRow';

export const CreateRevenueRecordsBulkForm = () => {
  const { t } = useTranslation(['app', 'common']);
  const navigate = useNavigate();

  const {
    methods,
    onSubmit,
    fields,
    append,
    remove,
    carOptions,
    driverOptions,
    drivers,
    isPendingData,
    isPendingCreation,
  } = useCreateRevenueRecordsBulkForm();

  const isPending = isPendingData && carOptions.length === 0 && driverOptions.length === 0;
  const fieldArrayIsEmpty = fields.length === 0;
  const formIsValid = methods.formState.isValid;

  return (
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
            loading={isPending || isPendingCreation}
            disabled={!formIsValid || fieldArrayIsEmpty || isPending}
          >
            {t('common:actions.save')}
          </Button>
        </>
      }
    >
      <Stack gap="sm">
        {!isPending &&
          fields.map((field, index) => (
            <CreateRevenueRecordRow
              key={field.id}
              index={index}
              remove={remove}
              carOptions={carOptions}
              driverOptions={driverOptions}
              drivers={drivers}
            />
          ))}
      </Stack>

      <Button
        mt="md"
        variant="light"
        leftSection={<PlusCircle size={18} />}
        onClick={append}
      >
        {t('app:revenues.bulk.add_row')}
      </Button>
    </Form>
  );
};
