import { TFunction } from 'i18next';
import { z } from 'zod';
import { RemunerationModelType } from './remuneration-types';

export const getRemunerationSchema = (t: TFunction) =>
  z.discriminatedUnion('remunerationModelType', [
    z.object({
      remunerationModelType: z.literal(RemunerationModelType.PERCENTAGE_SHARE),
      minDriverPayoutPerShift: z
        .number({ error: t('errors:driver.dailyMinPayout.invalid') })
        .min(0, t('errors:driver.dailyMinPayout.invalid'))
        .optional()
        .nullable(),
      driverRevenueSharePercentage: z
        .number({ error: t('errors:driver.driverRevenueSharePercentage.invalid') })
        .min(0, t('errors:driver.driverRevenueSharePercentage.invalid'))
        .max(100, t('errors:driver.driverRevenueSharePercentage.invalid'))
        .optional()
        .nullable(),
    }),
    z.object({
      remunerationModelType: z.literal(RemunerationModelType.WEEKLY_FIXED_RATE),
      weeklyFixedCompanySettlement: z
        .number({ error: t('errors:driver.weeklyFixedCompanySettlement.invalid') })
        .min(0, t('errors:driver.weeklyFixedCompanySettlement.invalid')),
      settlementDay: z
        .number({ error: t('errors:driver.settlementDay.invalid') })
        .min(1, t('errors:driver.settlementDay.invalid'))
        .max(7, t('errors:driver.settlementDay.invalid')),
    }),
    z.object({
      remunerationModelType: z.literal(RemunerationModelType.FLAT_RATE),
      driverFlatRatePayoutPerShift: z
        .number({ error: t('errors:driver.driverFlatRatePayoutPerShift.invalid') })
        .min(0, t('errors:driver.driverFlatRatePayoutPerShift.invalid')),
      flatRateTypeId: z.number().nullable().optional(),
    }),
  ]);
