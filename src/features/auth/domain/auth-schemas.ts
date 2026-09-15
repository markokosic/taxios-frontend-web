import { TFunction } from 'i18next';
import { z } from 'zod';
import {
  ChangePasswordBody,
  RegisterBody,
} from '@/api/generated/zod/authentication/authentication';

export const getRegisterFormSchema = (t: TFunction) => {
  return RegisterBody.extend({
    password: z
      .string()
      .min(8, t('errors:password.min_length'))
      .max(72, t('errors:password.max_length')),
    confirmPassword: z.string().min(1, t('errors:required_field')),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('errors:password_mismatch'),
    path: ['confirmPassword'],
  });
};

export const getChangePasswordFormSchema = (t: TFunction) => {
  return ChangePasswordBody.extend({
    currentPassword: z.string().min(1, t('errors:required_field')),
    newPassword: z
      .string()
      .min(8, t('errors:password.min_length'))
      .max(72, t('errors:password.max_length')),
    confirmPassword: z.string().min(1, t('errors:required_field')),
  })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('errors:password_mismatch'),
      path: ['confirmPassword'],
    })
    .refine((data) => data.newPassword !== data.currentPassword, {
      message: t('errors:password.same_as_current'),
      path: ['newPassword'],
    });
};