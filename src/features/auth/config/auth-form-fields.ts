export const AUTH_FORM_FIELDS = {
  email: {
    name: 'email',
    labelKey: 'form.email.label',
    placeholderKey: 'form.email.placeholder',
    type: 'email',
    autoComplete: 'email',
  },
  password: {
    name: 'password',
    labelKey: 'form.password.label',
    placeholderKey: 'form.password.placeholder',
    type: 'password',
    autoComplete: 'current-password',
  },
  confirmPassword: {
    name: 'confirmPassword',
    labelKey: 'form.confirmPassword.label',
    placeholderKey: 'form.confirmPassword.placeholder',
    type: 'password',
    autoComplete: 'new-password',
  },
  tenantName: {
    name: 'tenantName',
    labelKey: 'form.tenantName.label',
    placeholderKey: 'form.tenantName.placeholder',
    type: 'text',
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
} as const;
