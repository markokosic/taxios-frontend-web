import { FormFieldsGroupConfig } from '@/common/types/common-types';

export const DRIVERS_FORM_FIELDS = {
  common: {
    email: {
      name: 'email',
      labelKey: 'form.email.label',
      placeholderKey: 'form.email.placeholder',
      type: 'email',
      autoComplete: 'email',
    },
    phone: {
      name: 'phone',
      labelKey: 'form.phone.label',
      placeholderKey: 'form.phone.placeholder',
      type: 'tel',
      autoComplete: 'tel',
    },
    firstName: {
      name: 'firstName',
      labelKey: 'form.firstName.label',
      placeholderKey: 'form.firstName.placeholder',
      type: 'text',
      autoComplete: 'given-name',
    },
    lastName: {
      name: 'lastName',
      labelKey: 'form.lastName.label',
      placeholderKey: 'form.lastName.placeholder',
      type: 'text',
      autoComplete: 'family-name',
    },
  },
} as const satisfies FormFieldsGroupConfig;
