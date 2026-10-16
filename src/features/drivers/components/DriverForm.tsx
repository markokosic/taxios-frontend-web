import { useTranslation } from 'react-i18next';
import { Stack } from '@mantine/core';
import { ControlledTextInput } from '@/shared/components/forms/ControlledTextInput';
import { FieldGroup } from '@/shared/components/forms/Form';
import { DRIVERS_FORM_FIELDS } from '../domain/drivers-form-fields';
import { DriverBaseRemunerationSection } from './DriverBaseRemunerationSection';
import { DriverFlatRatesSection } from './DriverFlatRatesSection';

export const DriverForm = () => {
  const { t } = useTranslation(['common', 'app']);

  return (
    <Stack gap="lg">
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

      <DriverBaseRemunerationSection />

      <DriverFlatRatesSection />
    </Stack>
  );
};
