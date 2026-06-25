import { TFunction } from 'i18next';
import { z } from 'zod';
import { getEmailSchema, getNameSchema, getPhoneSchema } from '@/common/schemas/common-schemas';
import { getRemunerationSchema } from '@/features/remuneration/remuneration-schemas';

export const getCreateDriverSchema = (t: TFunction) =>
  z.object({
    firstName: getNameSchema(t).max(50, t('errors:driver.firstName.size')),
    lastName: getNameSchema(t).max(50, t('errors:driver.lastName.size')),
    email: getEmailSchema(t),
    phone: getPhoneSchema(t),
    remunerationConfigs: z.array(getRemunerationSchema(t)),
  });

export const getUpdateDriverSchema = (t: TFunction) => getCreateDriverSchema(t).partial();

export type CreateDriverRequest = z.infer<ReturnType<typeof getCreateDriverSchema>>;
export type UpdateDriverRequest = z.infer<ReturnType<typeof getUpdateDriverSchema>>;
