import { describe, expect, it } from 'vitest';
import {
  getDriverUpdateFormDefaultValues,
  normalizeRemunerationConfigForForm,
  normalizeRemunerationConfigForPayload,
} from '../driver-form.utils';

describe('driver-form.utils', () => {
  it('getDriverUpdateFormDefaultValues should map driver response to form default values', () => {
    const driver = {
      id: 1,
      firstName: 'Max',
      lastName: 'Mustermann',
      phone: '12345678',
      email: 'max@example.com',
      currentRemunerationConfigs: [
        {
          remunerationModelType: 'FLAT_RATE' as const,
          driverFlatRatePayoutPerShift: 50,
        },
      ],
    };

    expect(getDriverUpdateFormDefaultValues(driver as never)).toEqual({
      firstName: 'Max',
      lastName: 'Mustermann',
      phone: '12345678',
      email: 'max@example.com',
      remunerationConfigs: [
        {
          remunerationModelType: 'FLAT_RATE',
          driverFlatRatePayoutPerShift: 50,
        },
      ],
    });
  });

  it('normalizeRemunerationConfigForForm converts decimal factor 0.4500 to 45 % for UI input', () => {
    const configs = [
      {
        remunerationModelType: 'PERCENTAGE_SHARE' as const,
        driverRevenueSharePercentage: 0.45,
        minDriverPayoutPerShift: 50,
      },
    ];

    const result = normalizeRemunerationConfigForForm(configs as never);
    const firstConfig = result?.[0] as { driverRevenueSharePercentage?: number } | undefined;
    expect(firstConfig?.driverRevenueSharePercentage).toBe(45);
  });

  it('normalizeRemunerationConfigForPayload converts 45 % to decimal factor 0.4500 for API', () => {
    const payload = {
      firstName: 'Max',
      remunerationConfigs: [
        {
          remunerationModelType: 'PERCENTAGE_SHARE' as const,
          driverRevenueSharePercentage: 45,
          minDriverPayoutPerShift: 50,
        },
      ],
    };

    const result = normalizeRemunerationConfigForPayload(payload);
    const firstConfig = result.remunerationConfigs?.[0] as { driverRevenueSharePercentage?: number } | undefined;
    expect(firstConfig?.driverRevenueSharePercentage).toBe(0.45);
  });

  it('getDriverUpdateFormDefaultValues should fallback to empty values when fields are null or undefined', () => {
    const driver = { id: 1 };
    expect(getDriverUpdateFormDefaultValues(driver as never)).toEqual({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      remunerationConfigs: [],
    });
  });
});
