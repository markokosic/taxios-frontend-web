import { useTranslation } from 'react-i18next';
import { Button } from '@mantine/core';
import { ControlledNumberInput } from '@/shared/components/forms/ControlledNumberInput';
import { ControlledTextInput } from '@/shared/components/forms/ControlledTextInput';
import { FieldGroup, Form } from '@/shared/components/forms/Form';
import { useCreateFlatRateForm } from '../hooks/useCreateFlatRateForm';

export const CreateNewFlatRateForm = () => {
  const { t } = useTranslation(['app', 'common']);
  const { methods, onSubmit, isPending, cancel } = useCreateFlatRateForm();

  const formIsValid = methods.formState.isValid;

  return (
    <Form
      methods={methods}
      onSubmit={onSubmit}
      formActions={
        <>
          <Button
            variant="outline"
            onClick={cancel}
          >
            {t('common:actions.cancel')}
          </Button>
          <Button
            type="submit"
            loading={isPending}
            disabled={!formIsValid || !methods.formState.isDirty || isPending}
          >
            {t('common:actions.save')}
          </Button>
        </>
      }
    >
      <FieldGroup
        columnConfig={{ desktop: { columns: 2 }, mobile: { columns: 1 } }}
        groupNameKey="app:flatrate.group_title"
      >
        <ControlledTextInput
          name="name"
          label={t('app:flatrate.name.label')}
          placeholder={t('app:flatrate.name.placeholder')}
          withAsterisk
        />
        <ControlledNumberInput
          name="defaultPrice"
          label={t('app:flatrate.default_price.label')}
          placeholder={t('app:flatrate.default_price.placeholder')}
          min={0}
          decimalScale={2}
          suffix=" €"
        />
      </FieldGroup>
    </Form>
  );
};
