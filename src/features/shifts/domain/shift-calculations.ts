import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import {
  CreateShiftRequest,
  CreateShiftRevenueEntryRequest,
  ShiftResponse,
  ShiftRevenueEntryResponse,
  ShiftRevenueEntryResponseEntryCategory,
  ShiftSettlementResponse,
  UpdateShiftRequest,
  UpdateShiftRevenueEntryRequest,
} from '@/api/generated/model';

dayjs.extend(isoWeek);

export interface ShiftDurationResult {
  hours: number;
  minutes: number;
  decimalHours: number;
  text: string;
}

export interface ShiftTotalsResult {
  totalRevenue: number;
  totalDriverRemuneration: number;
  totalCompanyRemuneration: number;
}

export interface WeeklySettlementResult {
  isWeeklyPaymentToday: boolean;
  weekdayName: string;
}

/**
 * Builds a consistent option key for driver revenue options and form rows.
 */
export const getRevenueOptionKey = (
  entryCategory?: string | null,
  flatRateTypeId?: number | null
): string => {
  if (entryCategory === ShiftRevenueEntryResponseEntryCategory.FLAT_RATE) {
    return `FLAT_RATE_${flatRateTypeId ?? 'none'}`;
  }
  return entryCategory || ShiftRevenueEntryResponseEntryCategory.REGULAR;
};

/**
 * Calculates driven kilometers from start and end odometer values.
 */
export const calculateKilometersDriven = (
  odometerStart?: number | null,
  odometerEnd?: number | null
): number | null => {
  if (
    typeof odometerStart === 'number' &&
    typeof odometerEnd === 'number' &&
    odometerEnd >= odometerStart
  ) {
    return odometerEnd - odometerStart;
  }
  return null;
};

/**
 * Calculates shift duration in hours and minutes between start and end date strings.
 */
export const calculateShiftDuration = (
  shiftStart?: string | null,
  shiftEnd?: string | null
): ShiftDurationResult | null => {
  if (!shiftStart || !shiftEnd) {return null;}
  const start = dayjs(shiftStart);
  const end = dayjs(shiftEnd);
  if (!start.isValid() || !end.isValid() || !end.isAfter(start)) {return null;}

  const diffMinutes = end.diff(start, 'minute');
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  const decimalHours = Math.round((diffMinutes / 60) * 100) / 100;

  return {
    hours,
    minutes,
    decimalHours,
    text: `${hours} Std. ${minutes > 0 ? `${minutes} Min.` : ''} (${decimalHours} h)`,
  };
};

/**
 * Checks if target shift date (or today) matches the weekly settlement day.
 */
export const checkWeeklySettlement = (
  targetDate?: string | null,
  settlementDay: number = 7
): WeeklySettlementResult => {
  const date = targetDate && dayjs(targetDate).isValid() ? dayjs(targetDate) : dayjs();
  const currentIsoWeekday = date.isoWeekday();
  const isWeeklyPaymentToday = currentIsoWeekday === settlementDay;
  const weekdayName = date.isoWeekday(settlementDay).format('dddd');

  return { isWeeklyPaymentToday, weekdayName };
};

/**
 * Calculates total for flat rate trips: N * pricePerTrip.
 */
export const calculateFlatRateTotal = (
  tripCount?: number | null,
  pricePerTrip?: number | null
): number => {
  return (Number(tripCount) || 0) * (Number(pricePerTrip) || 0);
};

/**
 * Computes aggregated revenue, driver remuneration, and company share for a shift.
 * Uses the backend settlement snapshot if available, otherwise aggregates entries.
 */
export const calculateShiftTotals = (
  revenuesOrShift?: ShiftRevenueEntryResponse[] | ShiftResponse | null,
  settlementOverride?: ShiftSettlementResponse | null
): ShiftTotalsResult => {
  if (!revenuesOrShift) {
    return {
      totalRevenue: 0,
      totalDriverRemuneration: 0,
      totalCompanyRemuneration: 0,
    };
  }

  // If a full ShiftResponse object is passed
  if (
    typeof revenuesOrShift === 'object' &&
    !Array.isArray(revenuesOrShift) &&
    ('settlement' in revenuesOrShift || 'revenues' in revenuesOrShift)
  ) {
    const shift = revenuesOrShift as ShiftResponse;
    if (shift.settlement) {
      return {
        totalRevenue: shift.settlement.totalRevenue ?? 0,
        totalDriverRemuneration: shift.settlement.driverRemuneration ?? 0,
        totalCompanyRemuneration: shift.settlement.companyRemuneration ?? 0,
      };
    }
    return calculateShiftTotals(shift.revenues);
  }

  if (settlementOverride) {
    return {
      totalRevenue: settlementOverride.totalRevenue ?? 0,
      totalDriverRemuneration: settlementOverride.driverRemuneration ?? 0,
      totalCompanyRemuneration: settlementOverride.companyRemuneration ?? 0,
    };
  }

  const revenues = revenuesOrShift as ShiftRevenueEntryResponse[];
  if (!Array.isArray(revenues) || revenues.length === 0) {
    return {
      totalRevenue: 0,
      totalDriverRemuneration: 0,
      totalCompanyRemuneration: 0,
    };
  }

  return revenues.reduce(
    (acc, r) => ({
      totalRevenue: acc.totalRevenue + (r.revenue || 0),
      totalDriverRemuneration: 0,
      totalCompanyRemuneration: 0,
    }),
    { totalRevenue: 0, totalDriverRemuneration: 0, totalCompanyRemuneration: 0 }
  );
};

/**
 * Formats date string to DD.MM.YYYY.
 */
export const formatShiftDate = (dateString?: string | null, locale = 'de-DE'): string => {
  if (!dateString) {return '-';}
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? '-'
    : date.toLocaleDateString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
};

/**
 * Formats time portion of date string to HH:mm.
 */
export const formatShiftTime = (dateString?: string | null, locale = 'de-DE'): string => {
  if (!dateString) {return '-';}
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? '-'
    : date.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
      });
};

export interface DriverShiftFlatRateOption {
  id?: number;
  name?: string;
  defaultPrice?: number;
}


const extractWeeklyRent = (weeklyRentPaid?: number | null): number | undefined => {
  if (weeklyRentPaid !== undefined && weeklyRentPaid !== null && !isNaN(Number(weeklyRentPaid))) {
    return Number(weeklyRentPaid);
  }
  return undefined;
};

/**
 * Extracts QuickForm values (singleRides, flatRateCounts, etc.) from a ShiftResponse
 */
export const extractFormValuesFromShift = (shift: ShiftResponse) => {
  const regularRevenues = shift.revenues?.filter((r) => r.entryCategory === ShiftRevenueEntryResponseEntryCategory.REGULAR) || [];
  const singleRides = regularRevenues.map((r) => r.revenue ?? 0).filter((v) => v > 0);

  const flatRateCounts: Record<string, number> = {};
  const flatRatePrices: Record<string, number> = {};
  
  shift.revenues
    ?.filter((r) => r.entryCategory === ShiftRevenueEntryResponseEntryCategory.FLAT_RATE)
    .forEach((r, idx) => {
      const key = r.flatRateTypeId ? String(r.flatRateTypeId) : `custom_${idx}`;
      if (r.tripCount) {
        flatRateCounts[key] = r.tripCount;
      }
      if (r.pricePerTrip) {
        flatRatePrices[key] = r.pricePerTrip;
      }
    });

  const weeklyRentPaid =
    shift.weeklyDriverRent ??
    shift.revenues?.find((r) => r.entryCategory === ShiftRevenueEntryResponseEntryCategory.WEEKLY)?.revenue ??
    undefined;

  return {
    singleRides,
    flatRateCounts,
    flatRatePrices,
    weeklyRentPaid,
  };
};

/**
 * Transforms form values into API request payload.
 * Used for both Admin (CreateShiftRequest) and Driver (CreateMyShiftRequest).
 */
export const transformShiftFormPayload = (
  values: any,
  flatRateTypes: DriverShiftFlatRateOption[] = []
): any => {
  const weeklyDriverRent = extractWeeklyRent(values.weeklyRentPaid);
  const revenues: CreateShiftRevenueEntryRequest[] = [];

  // 1. Regular Revenues
  const singleRides: number[] = values.singleRides || [];
  singleRides
    .map(Number)
    .filter((num) => !isNaN(num) && num > 0)
    .forEach((num) => {
      revenues.push({
        entryCategory: ShiftRevenueEntryResponseEntryCategory.REGULAR,
        revenue: Math.round(num * 100) / 100,
      });
    });

  // 2. Flat Rate Revenues
  const flatRateCounts: Record<string, number> = values.flatRateCounts || {};
  const flatRatePrices: Record<string, number> = values.flatRatePrices || {};
  
  for (const [key, count] of Object.entries(flatRateCounts)) {
    if (!count || count <= 0) {
      continue;
    }
    const typeId = isNaN(Number(key)) ? undefined : Number(key);
    const flatType = flatRateTypes.find(
      (f, idx) =>
        (f.id !== undefined && f.id === typeId) || (f.id === undefined && `custom_${idx}` === key)
    );
    const price =
      flatType?.defaultPrice !== undefined && flatType?.defaultPrice !== null
        ? flatType.defaultPrice
        : flatRatePrices[key] ?? 0;

    if (price > 0) {
      revenues.push({
        entryCategory: ShiftRevenueEntryResponseEntryCategory.FLAT_RATE,
        flatRateTypeId: flatType?.id,
        tripCount: count,
        pricePerTrip: price,
      });
    }
  }

  // 3. Fallback for Weekly Rent only
  if (revenues.length === 0 && weeklyDriverRent !== undefined) {
    revenues.push({
      entryCategory: ShiftRevenueEntryResponseEntryCategory.REGULAR,
      revenue: 0,
    });
  }

  const payload: any = {
    carId: Number(values.carId),
    odometerStart: Number(values.odometerStart),
    odometerEnd: Number(values.odometerEnd),
    shiftStart: dayjs(values.shiftStart).format('YYYY-MM-DDTHH:mm:ss'),
    shiftEnd: dayjs(values.shiftEnd).format('YYYY-MM-DDTHH:mm:ss'),
    weeklyDriverRent,
    revenues,
  };

  if (values.driverId) {
    payload.driverId = Number(values.driverId);
  }

  return payload;
};

/**
 * Transforms form values into UpdateShiftRequest payload for PUT /api/shifts/{id}.
 * Also reusable for Driver update (UpdateMyShift).
 */
export const transformUpdateShiftPayload = (
  values: any,
  flatRateTypes: DriverShiftFlatRateOption[] = [],
  existingRevenues: ShiftRevenueEntryResponse[] = []
): any => {
  const weeklyDriverRent = extractWeeklyRent(values.weeklyRentPaid);
  const revenues: UpdateShiftRevenueEntryRequest[] = [];
  
  const existingRegulars = existingRevenues.filter(
    (r) => r.entryCategory === ShiftRevenueEntryResponseEntryCategory.REGULAR
  );

  // 1. Regular Revenues
  const singleRides: number[] = values.singleRides || [];
  singleRides
    .map(Number)
    .filter((num) => !isNaN(num) && num > 0)
    .forEach((num, index) => {
      const rounded = Math.round(num * 100) / 100;
      if (index < existingRegulars.length && existingRegulars[index].id) {
        revenues.push({
          id: existingRegulars[index].id,
          revenue: rounded,
        });
      } else {
        revenues.push({
          id: undefined,
          entryCategory: ShiftRevenueEntryResponseEntryCategory.REGULAR,
          revenue: rounded,
        });
      }
    });

  // 2. Flat Rate Revenues
  const flatRateCounts: Record<string, number> = values.flatRateCounts || {};
  const flatRatePrices: Record<string, number> = values.flatRatePrices || {};

  for (const [key, count] of Object.entries(flatRateCounts)) {
    if (!count || count <= 0) {
      continue;
    }
    const typeId = isNaN(Number(key)) ? undefined : Number(key);
    const flatType = flatRateTypes.find(
      (f, idx) =>
        (f.id !== undefined && f.id === typeId) || (f.id === undefined && `custom_${idx}` === key)
    );
    const price =
      flatType?.defaultPrice !== undefined && flatType?.defaultPrice !== null
        ? flatType.defaultPrice
        : flatRatePrices[key] ?? 0;

    if (price > 0) {
      const existingFlat = existingRevenues.find(
        (r) =>
          r.entryCategory === ShiftRevenueEntryResponseEntryCategory.FLAT_RATE &&
          ((typeId !== undefined && r.flatRateTypeId === typeId) || (!typeId && !r.flatRateTypeId))
      );

      if (existingFlat?.id) {
        revenues.push({
          id: existingFlat.id,
          tripCount: count,
          pricePerTrip: price,
        });
      } else {
        revenues.push({
          id: undefined,
          entryCategory: ShiftRevenueEntryResponseEntryCategory.FLAT_RATE,
          flatRateTypeId: flatType?.id,
          tripCount: count,
          pricePerTrip: price,
        });
      }
    }
  }

  // 3. Fallback for Weekly Rent only
  if (revenues.length === 0 && weeklyDriverRent !== undefined) {
    revenues.push({
      id: undefined,
      entryCategory: ShiftRevenueEntryResponseEntryCategory.REGULAR,
      revenue: 0,
    });
  }

  const payload: any = {
    carId: values.carId ? Number(values.carId) : undefined,
    odometerStart: Number(values.odometerStart),
    odometerEnd: Number(values.odometerEnd),
    shiftStart: dayjs(values.shiftStart).format('YYYY-MM-DDTHH:mm:ss'),
    shiftEnd: dayjs(values.shiftEnd).format('YYYY-MM-DDTHH:mm:ss'),
    weeklyDriverRent,
    revenues,
  };

  return payload;
};
