import { FormFieldsGroupConfig } from '@/common/types/common-types';

export const CARS_FORM_FIELDS = {
  common: {
    licensePlate: {
      name: 'licensePlate',
      labelKey: 'cars:licensePlate.label',
      placeholderKey: 'cars:licensePlate.placeholder',
      type: 'text',
    },
    model: {
      name: 'model',
      labelKey: 'cars:model.label',
      placeholderKey: 'cars:model.placeholder',
      type: 'text',
    },
    brand: {
      name: 'brand',
      labelKey: 'cars:brand.label',
      placeholderKey: 'cars:brand.placeholder',
      type: 'text',
    },
    horsepower: {
      name: 'horsepower',
      labelKey: 'cars:horsepower.label',
      placeholderKey: 'cars:horsepower.placeholder',
      type: 'text',
    },
  },
} as const satisfies FormFieldsGroupConfig;
