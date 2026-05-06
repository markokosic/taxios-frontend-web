import { TFunction } from 'i18next';
import { z } from 'zod';

export const getCreateCarSchema = (t: TFunction) =>
  z.object({
    licensePlate: z.string().min(1, t('errors:car.licensePlate.required')),
    model: z.string().min(1, t('errors:car.model.required')),
    brand: z.string().min(1, t('errors:car.brand.required')),
    horsepower: z.string().min(1, t('errors:car.horsepower.required')),
  });

export const getUpdateCarSchema = (t: TFunction) => getCreateCarSchema(t).partial();

export type CreateCarRequest = z.infer<ReturnType<typeof getCreateCarSchema>>;
export type UpdateCarRequest = z.infer<ReturnType<typeof getUpdateCarSchema>>;
