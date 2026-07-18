import { TFunction } from 'i18next';
import { z } from 'zod';
import {RegisterBody} from "@/api/generated/zod/authentication/authentication";


export const getRegisterFormSchema = (t: TFunction) => {
  return (
    RegisterBody.extend({
      confirmPassword: z.string().min(1),
    })
      .refine((data) => data.password === data.confirmPassword, {
        message: t('errors:password_mismatch'),
        path: ['confirmPassword'],
      })
      // .superRefine((data, ctx) => {
      //   if (!data.email.includes('@')) {
      //     // Beispielhaft für E-Mail-Validierung
      //     ctx.addIssue({
      //       code: z.ZodIssueCode.custom,
      //       message: t('errors:validation.email_invalid'),
      //       path: ['email'],
      //     });
      //   }
      // })
  );
};