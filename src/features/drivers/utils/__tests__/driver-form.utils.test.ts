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
          remunerationModelType: 'FIXED_PER_SHIFT' as const,
          driverPayoutPerShift: 50,
        },
      ],
      allowedFlatRateTypes: [{ id: 3, name: 'Wien -> Graz' }, { id: 4, name: 'Flughafen' }],
    };

    expect(getDriverUpdateFormDefaultValues(driver as never)).toEqual({
      firstName: 'Max',
      lastName: 'Mustermann',
      phone: '12345678',
      email: 'max@example.com',
      remunerationConfigs: [
        {
          remunerationModelType: 'FIXED_PER_SHIFT',
          driverPayoutPerShift: 50,
        },
      ],
      allowedFlatRateTypeIds: [3, 4],
    });
  });

  it('normalizeRemunerationConfigForForm drops legacy flat rate configs which can not be assigned anymore', () => {
    const configs = [
      { remunerationModelType: 'FLAT_RATE' as const, driverFlatRatePayoutPerShift: 50 },
      { remunerationModelType: 'FIXED_PER_SHIFT' as const, driverPayoutPerShift: 80 },
    ];

    expect(normalizeRemunerationConfigForForm(configs as never)).toEqual([
      { remunerationModelType: 'FIXED_PER_SHIFT', driverPayoutPerShift: 80 },
    ]);
  });

  it('normalizeRemunerationConfigForForm converts the flat ride share 0.15 to 15 %', () => {
    const configs = [{ remunerationModelType: 'FLAT_RATE_PERCENTAGE' as const, driverSharePercentage: 0.15 }];

    const result = normalizeRemunerationConfigForForm(configs as never);
    expect((result?.[0] as { driverSharePercentage?: number }).driverSharePercentage).toBe(15);
  });

  it('normalizeRemunerationConfigForPayload converts the flat ride share 15 % to 0.15', () => {
    const result = normalizeRemunerationConfigForPayload({
      remunerationConfigs: [{ remunerationModelType: 'FLAT_RATE_PERCENTAGE', driverSharePercentage: 15 }],
    });

    expect((result.remunerationConfigs?.[0] as { driverSharePercentage?: number }).driverSharePercentage).toBe(0.15);
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
      allowedFlatRateTypeIds: [],
    });
  });
});
