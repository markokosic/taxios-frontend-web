import { UpdateDriverMutationBody } from '@/api/generated/endpoints/drivers/drivers';
import { DriverResponse } from '@/api/generated/model';
import { isCreatableRemunerationModel } from '../domain/remuneration-rules';
import { RemunerationModelType } from '../domain/remuneration-types';

const toPercent = (fraction?: number | null) =>
  fraction !== undefined && fraction !== null ? Math.round(fraction * 10000) / 100 : fraction;

const PERCENT_FIELD_BY_TYPE: Partial<Record<RemunerationModelType, string>> = {
  [RemunerationModelType.PERCENTAGE_SHARE]: 'driverRevenueSharePercentage',
  [RemunerationModelType.FLAT_RATE_PERCENTAGE]: 'driverSharePercentage',
};

export const normalizeRemunerationConfigForForm = (
  configs?: DriverResponse['currentRemunerationConfigs'],
  allowedFlatRateTypes: DriverResponse['allowedFlatRateTypes'] = []
): UpdateDriverMutationBody['remunerationConfigs'] => {
  if (!configs) {return [];}
  // a flat ride gets a new id with every price change, the code stays the same
  const currentIdByCode = new Map(
    (allowedFlatRateTypes ?? []).map((type) => [type.flatRateCode, type.id])
  );
  return configs
    .filter((c) => isCreatableRemunerationModel(c.remunerationModelType as RemunerationModelType))
    .map((c) => {
      if (c.remunerationModelType === 'PERCENTAGE_SHARE' && 'driverRevenueSharePercentage' in c) {
        const pct = (c as { driverRevenueSharePercentage?: number }).driverRevenueSharePercentage;
        return {
          ...c,
          driverRevenueSharePercentage: toPercent(pct),
        };
      }
      if (c.remunerationModelType === 'FLAT_RATE_PERCENTAGE' && 'driverSharePercentage' in c) {
        const pct = (c as { driverSharePercentage?: number }).driverSharePercentage;
        return {
          ...c,
          driverSharePercentage: toPercent(pct),
          flatRateTypeId:
            currentIdByCode.get((c as { flatRateCode?: string }).flatRateCode) ??
            (c as { flatRateTypeId?: number | null }).flatRateTypeId,
        };
      }
      return c;
    }) as UpdateDriverMutationBody['remunerationConfigs'];
};

export const normalizeRemunerationConfigForPayload = <
  T extends { remunerationConfigs?: unknown[] },
>(
  data: T
): T => {
  if (!data.remunerationConfigs) {return data;}
  return {
    ...data,
    remunerationConfigs: data.remunerationConfigs.map((c: any) => {
      const field = PERCENT_FIELD_BY_TYPE[c.remunerationModelType as RemunerationModelType];
      if (field && c[field] !== undefined && c[field] !== null) {
        return {
          ...c,
          [field]: Number((Number(c[field]) / 100).toFixed(4)),
        };
      }
      return c;
    }),
  };
};

export const getDriverUpdateFormDefaultValues = (
  driver: DriverResponse
): UpdateDriverMutationBody => ({
  firstName: driver.firstName ?? '',
  lastName: driver.lastName ?? '',
  phone: driver.phone ?? '',
  email: driver.email ?? '',
  remunerationConfigs: normalizeRemunerationConfigForForm(
    driver.currentRemunerationConfigs,
    driver.allowedFlatRateTypes
  ),
  allowedFlatRateTypeIds: (driver.allowedFlatRateTypes ?? [])
    .map((type) => type.id)
    .filter((id): id is number => id !== undefined),
});
