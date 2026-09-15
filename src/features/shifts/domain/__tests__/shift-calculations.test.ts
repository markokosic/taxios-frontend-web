import {
  calculateFlatRateTotal,
  calculateKilometersDriven,
  calculateShiftDuration,
  calculateShiftTotals,
  formatShiftDate,
  formatShiftTime,
  getRevenueOptionKey,
  transformShiftFormPayload,
  transformUpdateShiftPayload,
} from '@/features/shifts/domain/shift-calculations';

describe('shift-calculations.utils', () => {
  describe('getRevenueOptionKey', () => {
    it('generates consistent keys for FLAT_RATE, REGULAR, and WEEKLY', () => {
      expect(getRevenueOptionKey('FLAT_RATE', 1)).toBe('FLAT_RATE_1');
      expect(getRevenueOptionKey('FLAT_RATE', null)).toBe('FLAT_RATE_none');
      expect(getRevenueOptionKey('REGULAR', null)).toBe('REGULAR');
      expect(getRevenueOptionKey('WEEKLY', null)).toBe('WEEKLY');
    });
  });
  describe('calculateKilometersDriven', () => {
    it('returns difference when odometerEnd >= odometerStart', () => {
      expect(calculateKilometersDriven(45000, 45312)).toBe(312);
      expect(calculateKilometersDriven(0, 100)).toBe(100);
    });

    it('returns null when invalid or end < start', () => {
      expect(calculateKilometersDriven(45000, 44000)).toBeNull();
      expect(calculateKilometersDriven(null, 45312)).toBeNull();
      expect(calculateKilometersDriven(45000, undefined)).toBeNull();
    });
  });

  describe('calculateShiftDuration', () => {
    it('calculates duration correctly between valid start and end dates', () => {
      const result = calculateShiftDuration('2026-08-13T06:00', '2026-08-13T14:30');
      expect(result).not.toBeNull();
      expect(result?.hours).toBe(8);
      expect(result?.minutes).toBe(30);
      expect(result?.decimalHours).toBe(8.5);
      expect(result?.text).toBe('8 Std. 30 Min. (8.5 h)');
    });

    it('returns null if start/end invalid or end <= start', () => {
      expect(calculateShiftDuration('2026-08-13T14:30', '2026-08-13T06:00')).toBeNull();
      expect(calculateShiftDuration('', '2026-08-13T14:30')).toBeNull();
    });
  });

  describe('calculateFlatRateTotal', () => {
    it('computes tripCount * pricePerTrip', () => {
      expect(calculateFlatRateTotal(2, 150)).toBe(300);
      expect(calculateFlatRateTotal(1, 42.5)).toBe(42.5);
      expect(calculateFlatRateTotal(undefined, 100)).toBe(0);
    });
  });

  describe('calculateShiftTotals', () => {
    it('sums revenues when only revenue entries are provided without settlement', () => {
      const revenues = [
        { revenue: 100 },
        { revenue: 200 },
      ];
      expect(calculateShiftTotals(revenues as any)).toEqual({
        totalRevenue: 300,
        totalDriverRemuneration: 0,
        totalCompanyRemuneration: 0,
      });
    });

    it('uses settlementOverride when provided', () => {
      const revenues = [{ revenue: 300 }];
      const settlement = {
        totalRevenue: 300,
        driverRemuneration: 180,
        companyRemuneration: 120,
      };
      expect(calculateShiftTotals(revenues as any, settlement as any)).toEqual({
        totalRevenue: 300,
        totalDriverRemuneration: 180,
        totalCompanyRemuneration: 120,
      });
    });

    it('prefers settlement snapshot if present on shift object', () => {
      const shift = {
        id: 1,
        settlement: {
          totalRevenue: 500,
          driverRemuneration: 225,
          companyRemuneration: 275,
        },
        revenues: [{ revenue: 100, driverRemuneration: 45, companyRemuneration: 55 }],
      };
      expect(calculateShiftTotals(shift as any)).toEqual({
        totalRevenue: 500,
        totalDriverRemuneration: 225,
        totalCompanyRemuneration: 275,
      });
    });

    it('returns zeros for empty or null array', () => {
      expect(calculateShiftTotals(null)).toEqual({
        totalRevenue: 0,
        totalDriverRemuneration: 0,
        totalCompanyRemuneration: 0,
      });
    });
  });

  describe('formatShiftDate & formatShiftTime', () => {
    it('formats date and time string', () => {
      const iso = '2026-08-13T14:30:00Z';
      expect(formatShiftDate(iso)).not.toBe('-');
      expect(formatShiftTime(iso)).not.toBe('-');
    });

    it('returns dash for invalid or null input', () => {
      expect(formatShiftDate(null)).toBe('-');
      expect(formatShiftTime(undefined)).toBe('-');
    });
  });

  describe('transformShiftFormPayload', () => {
    it('transforms form values into API request payload', () => {
      const values = {
        driverId: '10',
        carId: '5',
        odometerStart: 45000,
        odometerEnd: 45200,
        shiftStart: '2026-08-13T06:00',
        shiftEnd: '2026-08-13T14:00',
        status: 'APPROVED',
        singleRides: [120],
        flatRateCounts: { '3': 2 },
      };
      const flatRateTypes = [{ id: 3, name: 'Airport', defaultPrice: 150 }];

      const payload = transformShiftFormPayload(values, flatRateTypes);
      expect(payload.driverId).toBe(10);
      expect(payload.carId).toBe(5);
      expect(payload.revenues).toHaveLength(2);
      expect(payload.revenues[0]).toEqual({
        entryCategory: 'REGULAR',
        revenue: 120,
      });
      expect(payload.revenues[1]).toEqual({
        entryCategory: 'FLAT_RATE',
        flatRateTypeId: 3,
        tripCount: 2,
        pricePerTrip: 150,
      });
    });
  });

  describe('transformUpdateShiftPayload', () => {
    it('transforms form values keeping ID for existing rows and category for new rows', () => {
      const values = {
        driverId: 10,
        carId: 5,
        odometerStart: 45000,
        odometerEnd: 45200,
        shiftStart: '2026-08-13T06:00',
        shiftEnd: '2026-08-13T14:00',
        singleRides: [150, 80],
        flatRateCounts: { '1': 3, '2': 1 },
      };
      const flatRateTypes = [
        { id: 1, defaultPrice: 50 },
        { id: 2, defaultPrice: 100 },
      ];
      const existingRevenues = [
        { id: 99, entryCategory: 'REGULAR', revenue: 150 },
        { id: 100, entryCategory: 'FLAT_RATE', flatRateTypeId: 1, tripCount: 3, pricePerTrip: 50 },
      ] as any;

      const payload = transformUpdateShiftPayload(values, flatRateTypes, existingRevenues);
      expect(payload.odometerStart).toBe(45000);
      expect(payload.odometerEnd).toBe(45200);
      expect(payload.revenues).toHaveLength(4);
      
      // Existing regular: only id & amount
      expect(payload.revenues[0]).toEqual({ id: 99, revenue: 150 });
      // New regular: id: undefined, category & amount
      expect(payload.revenues[1]).toEqual({ id: undefined, entryCategory: 'REGULAR', revenue: 80 });
      
      // Existing flat rate: only id & tripCount/pricePerTrip
      expect(payload.revenues[2]).toEqual({ id: 100, tripCount: 3, pricePerTrip: 50 });
      // New flat rate: id: undefined, category, flatRateTypeId & tripCount/pricePerTrip
      expect(payload.revenues[3]).toEqual({
        id: undefined,
        entryCategory: 'FLAT_RATE',
        flatRateTypeId: 2,
        tripCount: 1,
        pricePerTrip: 100,
      });
    });

    it('only includes necessary fields and drops extra calculations for existing regular entries', () => {
      const values = {
        odometerStart: 1000,
        odometerEnd: 1100,
        shiftStart: '2026-08-13T06:00',
        shiftEnd: '2026-08-13T14:00',
        singleRides: [200],
      };
      
      const existingRevenues = [
        {
          id: 12,
          entryCategory: 'REGULAR',
          revenue: 200,
          driverRemuneration: 90,
          companyRemuneration: 110,
          remunerationModelType: 'PERCENTAGE_SHARE',
          isFlatRate: false,
          flatRateTypeName: 'Normal',
          optionKey: 'REGULAR',
        },
      ] as any;

      const payload = transformUpdateShiftPayload(values, [], existingRevenues);
      expect(payload.revenues[0]).toEqual({
        id: 12,
        revenue: 200,
      });
    });
  });
});
