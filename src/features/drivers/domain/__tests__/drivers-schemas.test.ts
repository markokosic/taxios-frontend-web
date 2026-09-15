import { describe, expect, it } from 'vitest';
import { getCreateDriverSchema, getUpdateDriverSchema } from '../drivers-schemas';
import { RemunerationModelType } from '../remuneration-types';

const mockT = (key: string) => key;

describe('drivers-schemas validation', () => {
  const validPercentageConfig = {
    remunerationModelType: RemunerationModelType.PERCENTAGE_SHARE,
    driverRevenueSharePercentage: 45,
    minDriverPayoutPerShift: 50,
  };

  const validWeeklyConfig = {
    remunerationModelType: RemunerationModelType.WEEKLY_FIXED_RATE,
    weeklyFixedCompanySettlement: 400,
    settlementDay: 7,
  };

  const validFlatRateConfig = {
    remunerationModelType: RemunerationModelType.FLAT_RATE,
    driverFlatRatePayoutPerShift: 25,
    flatRateTypeId: 1,
  };

  it('allows percentage share alone', () => {
    const schema = getCreateDriverSchema(mockT as any);
    const result = schema.safeParse({
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@example.com',
      phone: '+436601234567',
      remunerationConfigs: [validPercentageConfig],
    });
    expect(result.success).toBe(true);
  });

  it('allows weekly fixed rate alone', () => {
    const schema = getCreateDriverSchema(mockT as any);
    const result = schema.safeParse({
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@example.com',
      phone: '+436601234567',
      remunerationConfigs: [validWeeklyConfig],
    });
    expect(result.success).toBe(true);
  });

  it('allows percentage share with flat rate', () => {
    const schema = getCreateDriverSchema(mockT as any);
    const result = schema.safeParse({
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@example.com',
      phone: '+436601234567',
      remunerationConfigs: [validPercentageConfig, validFlatRateConfig],
    });
    expect(result.success).toBe(true);
  });

  it('allows weekly fixed rate with flat rate', () => {
    const schema = getCreateDriverSchema(mockT as any);
    const result = schema.safeParse({
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@example.com',
      phone: '+436601234567',
      remunerationConfigs: [validWeeklyConfig, validFlatRateConfig],
    });
    expect(result.success).toBe(true);
  });

  it('fails when both percentage share and weekly fixed rate are supplied', () => {
    const schema = getCreateDriverSchema(mockT as any);
    const result = schema.safeParse({
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@example.com',
      phone: '+436601234567',
      remunerationConfigs: [validPercentageConfig, validWeeklyConfig],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('cannot_have_both_percentage_and_weekly');
    }
  });

  it('fails update schema when both percentage and weekly are supplied', () => {
    const schema = getUpdateDriverSchema(mockT as any);
    const result = schema.safeParse({
      remunerationConfigs: [validPercentageConfig, validWeeklyConfig],
    });
    expect(result.success).toBe(false);
  });
});
