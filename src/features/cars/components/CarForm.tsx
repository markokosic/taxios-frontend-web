import { useTranslation } from 'react-i18next';
import { ControlledTextInput } from '@/components/ui/ControlledTextInput/ControlledTextInput';
import { FieldGroup } from '@/components/ui/Form';
import { CARS_FORM_FIELDS } from '../config/cars-form-fields';

export const CarForm = () => {
  const { t } = useTranslation();

  return (
    <>
      <FieldGroup
        columnConfig={{ desktop: { columns: 2 }, mobile: { columns: 1 } }}
        groupNameKey="form:groups.general_information"
      >
        <ControlledTextInput
          name={CARS_FORM_FIELDS.common.brand.name}
          type={CARS_FORM_FIELDS.common.brand.type}
          label={t(CARS_FORM_FIELDS.common.brand.labelKey)}
          placeholder={t(CARS_FORM_FIELDS.common.brand.placeholderKey)}
        />
        <ControlledTextInput
          name={CARS_FORM_FIELDS.common.model.name}
          type={CARS_FORM_FIELDS.common.model.type}
          label={t(CARS_FORM_FIELDS.common.model.labelKey)}
          placeholder={t(CARS_FORM_FIELDS.common.model.placeholderKey)}
        />
        <ControlledTextInput
          name={CARS_FORM_FIELDS.common.licensePlate.name}
          type={CARS_FORM_FIELDS.common.licensePlate.type}
          label={t(CARS_FORM_FIELDS.common.licensePlate.labelKey)}
          placeholder={t(CARS_FORM_FIELDS.common.licensePlate.placeholderKey)}
        />
        <ControlledTextInput
          name={CARS_FORM_FIELDS.common.horsepower.name}
          type={CARS_FORM_FIELDS.common.horsepower.type}
          label={t(CARS_FORM_FIELDS.common.horsepower.labelKey)}
          placeholder={t(CARS_FORM_FIELDS.common.horsepower.placeholderKey)}
        />
      </FieldGroup>
    </>
  );
};
