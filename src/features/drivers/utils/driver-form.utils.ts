import { UpdateDriverMutationBody } from '@/api/generated/endpoints/drivers/drivers';
import { DriverResponse } from '@/api/generated/model';

export const normalizeRemunerationConfigForForm = (
  configs?: DriverResponse['currentRemunerationConfigs']
): UpdateDriverMutationBody['remunerationConfigs'] => {
  if (!configs) return [];
  return configs.map((c) => {
    if (c.remunerationModelType === 'PERCENTAGE_SHARE' && 'driverRevenueSharePercentage' in c) {
      const pct = (c as { driverRevenueSharePercentage?: number }).driverRevenueSharePercentage;
      return {
        ...c,
        driverRevenueSharePercentage:
          pct !== undefined && pct !== null
            ? Math.round(pct * 10000) / 100
            : pct,
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
  if (!data.remunerationConfigs) return data;
  return {
    ...data,
    remunerationConfigs: data.remunerationConfigs.map((c: any) => {
      if (
        c.remunerationModelType === 'PERCENTAGE_SHARE' &&
        c.driverRevenueSharePercentage !== undefined &&
        c.driverRevenueSharePercentage !== null
      ) {
        const pct = Number(c.driverRevenueSharePercentage);
        return {
          ...c,
          driverRevenueSharePercentage: Number((pct / 100).toFixed(4)),
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
  remunerationConfigs: normalizeRemunerationConfigForForm(driver.currentRemunerationConfigs),
});
