import { FormFieldsGroupConfig } from '@/common/types/common-types';

export const CARS_FORM_FIELDS = {
  common: {
    licensePlate: {
      name: 'licensePlate',
      labelKey: 'app:cars.licensePlate.label',
      placeholderKey: 'app:cars.licensePlate.placeholder',
      type: 'text',
    },
    model: {
      name: 'model',
      labelKey: 'app:cars.model.label',
      placeholderKey: 'app:cars.model.placeholder',
      type: 'text',
    },
    brand: {
      name: 'brand',
      labelKey: 'app:cars.brand.label',
      placeholderKey: 'app:cars.brand.placeholder',
      type: 'text',
    },
    horsepower: {
      name: 'horsepower',
      labelKey: 'app:cars.horsepower.label',
      placeholderKey: 'app:cars.horsepower.placeholder',
      type: 'text',
    },
  },
} as const satisfies FormFieldsGroupConfig;
