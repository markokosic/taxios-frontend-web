import { TFunction } from 'i18next';
import { z } from 'zod';
import { getRemunerationSchema } from './remuneration-schemas';

import { RemunerationModelType } from './remuneration-types';

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
      .refine(
        (configs) => {
          const hasPercentage = configs.some(
            (c) => c.remunerationModelType === RemunerationModelType.PERCENTAGE_SHARE
          );
          const hasWeekly = configs.some(
            (c) => c.remunerationModelType === RemunerationModelType.WEEKLY_FIXED_RATE
          );
          return !(hasPercentage && hasWeekly);
        },
        {
          message: t(
            'errors:driver.cannot_have_both_percentage_and_weekly',
            'Ein Fahrer kann nicht gleichzeitig prozentual und mit Wochenmiete abgerechnet werden'
          ),
        }
      ),
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
      .refine(
        (configs) => {
          if (!configs || configs.length === 0) {return true;}
          const hasPercentage = configs.some(
            (c) => c.remunerationModelType === RemunerationModelType.PERCENTAGE_SHARE
          );
          const hasWeekly = configs.some(
            (c) => c.remunerationModelType === RemunerationModelType.WEEKLY_FIXED_RATE
          );
          return !(hasPercentage && hasWeekly);
        },
        {
          message: t(
            'errors:driver.cannot_have_both_percentage_and_weekly',
            'Ein Fahrer kann nicht gleichzeitig prozentual und mit Wochenmiete abgerechnet werden'
          ),
        }
      ),
  });
