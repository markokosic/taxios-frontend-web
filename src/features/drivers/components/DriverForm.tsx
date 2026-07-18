import { PlusCircle } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@mantine/core';
import { ControlledTextInput } from '@/components/ui/ControlledTextInput/ControlledTextInput';
import { FieldGroup } from '@/components/ui/Form';
import { DRIVERS_FORM_FIELDS } from '../config/drivers-form-fields';
import { DriverFormRemunerationConfigRow } from './DriverFormRemunerationConfigRow';

export const DriverForm = () => {
  const { t } = useTranslation(['common', 'app']);

  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: 'remunerationConfigs',
    control,
  });

  const emptyRemunerationConfig = {
    remunerationModelType: undefined,
  };

  return (
    <>
      <FieldGroup
        columnConfig={{ desktop: { columns: 2 }, mobile: { columns: 1 } }}
        groupNameKey="form.groups.general_information"
      >
        <ControlledTextInput
          name={DRIVERS_FORM_FIELDS.common.firstName.name}
          type={DRIVERS_FORM_FIELDS.common.firstName.type}
          label={t(DRIVERS_FORM_FIELDS.common.firstName.labelKey)}
          placeholder={t(DRIVERS_FORM_FIELDS.common.firstName.placeholderKey)}
        />
        <ControlledTextInput
          name={DRIVERS_FORM_FIELDS.common.lastName.name}
          type={DRIVERS_FORM_FIELDS.common.lastName.type}
          label={t(DRIVERS_FORM_FIELDS.common.lastName.labelKey)}
          placeholder={t(DRIVERS_FORM_FIELDS.common.lastName.placeholderKey)}
        />
        <ControlledTextInput
          name={DRIVERS_FORM_FIELDS.common.phone.name}
          type={DRIVERS_FORM_FIELDS.common.phone.type}
          label={t(DRIVERS_FORM_FIELDS.common.phone.labelKey)}
          placeholder={t(DRIVERS_FORM_FIELDS.common.phone.placeholderKey)}
        />
        <ControlledTextInput
          name={DRIVERS_FORM_FIELDS.common.email.name}
          type={DRIVERS_FORM_FIELDS.common.email.type}
          label={t(DRIVERS_FORM_FIELDS.common.email.labelKey)}
          placeholder={t(DRIVERS_FORM_FIELDS.common.email.placeholderKey)}
        />
      </FieldGroup>

      <FieldGroup
        columnConfig={{ desktop: { columns: 1 }, mobile: { columns: 1 } }}
        groupNameKey="app:remuneration.driver_remuneration"
      >
        {fields.map((field, index) => (
          <DriverFormRemunerationConfigRow
            key={field.id}
            index={index}
            remove={remove}
          />
        ))}
        <Button
          variant="light"
          leftSection={<PlusCircle size={18} />}
          onClick={() => append(emptyRemunerationConfig)}
        >
          {t('app:remuneration.add_driver_remuneration_config')}
        </Button>
      </FieldGroup>
    </>
  );
};
