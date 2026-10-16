import { TFunction } from 'i18next';
import { z } from 'zod';
import { validateRemunerationCombination } from './remuneration-rules';
import { getRemunerationSchema } from './remuneration-schemas';

type ConfigWithType = { remunerationModelType?: unknown };

const refineRemunerationCombination =
  (t: TFunction, optional = false) =>
  (configs: ConfigWithType[] | undefined, ctx: z.RefinementCtx) => {
    if (optional && (!configs || configs.length === 0)) {return;}
    const error = validateRemunerationCombination((configs ?? []).map((c) => c.remunerationModelType));
    if (error) {
      ctx.addIssue({ code: 'custom', message: t(`errors:driver.${error}`) });
    }
  };

export const getCreateDriverSchema = (t: TFunction) =>
  z.object({
    firstName: z
      .string({ error: t('errors:required_field') })
      .min(1, t('errors:required_field'))
      .max(50, t('errors:driver.firstName.size')),
    lastName: z
      .string({ error: t('errors:required_field') })
      .min(1, t('errors:required_field'))
      .max(50, t('errors:driver.lastName.size')),
    email: z
      .string({ error: t('errors:email.required') })
      .email(t('errors:email.invalid')),
    phone: z
      .string({ error: t('errors:phone.required') })
      .regex(/^\+?[0-9\s-]{7,20}$/, t('errors:phone.invalid_format')),
    remunerationConfigs: z
      .array(getRemunerationSchema(t))
      .min(1, t('errors:required_field'))
      .superRefine(refineRemunerationCombination(t)),
    allowedFlatRateTypeIds: z.array(z.number()).optional(),
  });

export const getUpdateDriverSchema = (t: TFunction) =>
  z.object({
    firstName: z
      .string()
      .max(50, t('errors:driver.firstName.size'))
      .optional(),
    lastName: z
      .string()
      .max(50, t('errors:driver.lastName.size'))
      .optional(),
    email: z
      .string()
      .email(t('errors:email.invalid'))
      .optional()
      .or(z.literal('')),
    phone: z
      .string()
      .regex(/^\+?[0-9\s-]{7,20}$/, t('errors:phone.invalid_format'))
      .optional()
      .or(z.literal('')),
    remunerationConfigs: z
      .array(getRemunerationSchema(t))
      .optional()
      .superRefine(refineRemunerationCombination(t, true)),
    allowedFlatRateTypeIds: z.array(z.number()).optional(),
  });
