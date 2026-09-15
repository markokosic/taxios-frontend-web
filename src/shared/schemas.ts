import { TFunction } from 'i18next';
import { z } from 'zod';

export const getNameSchema = (t: TFunction) => {
  return z.string().min(1, t('errors:name.required')).max(100, t('errors:name.too_long'));
};

export const getEmailSchema = (t: TFunction) => {
  return z
    .email(t('errors:email.invalid'))
    .min(1, t('errors:email.required'))
    .max(254, t('errors:email.too_long'));
};

export const getPasswordSchema = (t: TFunction) => {
  return z
    .string()
    .min(8, t('errors:password.min_length'))
    .max(72, t('errors:password.max_length'));
};

export const getPhoneSchema = (t: TFunction) => {
  return z
    .string()
    .min(7, t('errors:phone.invalid_format'))
    .max(20, t('errors:phone.too_long'))
    .regex(/^\+?[0-9\s\-()]+$/, t('errors:phone.invalid_format'));
};

export const getVatSchema = (t: TFunction) => {
  return z
    .string()
    .min(1, t('errors:vat.required'))
    .max(20, t('errors:vat.too_long'))
    .regex(/^[A-Z0-9]+$/, t('errors:vat.invalid_format'));
};
