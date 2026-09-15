import { useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DriverRevenueOption, DriverRevenueOptionEntryCategory } from '@/api/generated/model';
import {
  calculateFlatRateTotal,
  checkWeeklySettlement,
  getRevenueOptionKey,
} from '@/features/shifts/domain/shift-calculations';

export const useShiftRevenueRow = (index: number, revenueOptions: DriverRevenueOption[]) => {
  const { t } = useTranslation(['app', 'common']);
  const { setValue, control } = useFormContext();
  const fieldPrefix = `revenues.${index}`;

  const rowValues = useWatch({ control, name: fieldPrefix }) || {};
  const optionKey = rowValues.optionKey;
  const shiftStart = useWatch({ control, name: 'shiftStart' });

  const comboboxData = revenueOptions.map((opt) => ({
    label: opt.label || '',
    value: getRevenueOptionKey(opt.entryCategory, opt.flatRateTypeId),
  }));

  if (rowValues.optionKey && !comboboxData.some((c) => c.value === rowValues.optionKey)) {
    const fallbackLabel = rowValues.flatRateTypeName
      ? `${rowValues.flatRateTypeName} (${t('app:reports.categories.FLAT_RATE', 'Pauschale')})`
      : rowValues.entryCategory === 'REGULAR'
        ? t('app:reports.categories.REGULAR', 'Regulär')
        : rowValues.entryCategory === 'WEEKLY'
          ? t('app:reports.categories.WEEKLY', 'Wöchentlich')
          : rowValues.entryCategory || t('app:shifts.table.revenue', 'Umsatz');

    comboboxData.push({
      label: fallbackLabel,
      value: rowValues.optionKey,
    });
  }

  const previousOptionKeyRef = useRef(optionKey);

  const { isWeeklyPaymentToday, weekdayName } = checkWeeklySettlement(shiftStart);

  useEffect(() => {
    if (optionKey === previousOptionKeyRef.current) {
      return;
    }
    previousOptionKeyRef.current = optionKey;

    if (!optionKey) {
      return;
    }
    const matched = revenueOptions.find(
      (opt) => getRevenueOptionKey(opt.entryCategory, opt.flatRateTypeId) === optionKey
    );
    if (!matched) {
      return;
    }

    setValue(`${fieldPrefix}.entryCategory`, matched.entryCategory);

    if (matched.entryCategory === DriverRevenueOptionEntryCategory.FLAT_RATE) {
      setValue(`${fieldPrefix}.flatRateTypeId`, matched.flatRateTypeId ?? null);
      setValue(`${fieldPrefix}.tripCount`, 1);
      setValue(`${fieldPrefix}.pricePerTrip`, matched.defaultPrice ?? 0);
      setValue(`${fieldPrefix}.revenue`, undefined);
      setValue(`${fieldPrefix}.weeklyDriverRent`, undefined);
    } else if (matched.entryCategory === DriverRevenueOptionEntryCategory.WEEKLY) {
      setValue(`${fieldPrefix}.flatRateTypeId`, null);
      setValue(`${fieldPrefix}.tripCount`, undefined);
      setValue(`${fieldPrefix}.pricePerTrip`, undefined);
      setValue(`${fieldPrefix}.revenue`, undefined);
      setValue(
        `${fieldPrefix}.weeklyDriverRent`,
        isWeeklyPaymentToday ? (matched.defaultPrice ?? 0) : 0
      );
    } else {
      setValue(`${fieldPrefix}.flatRateTypeId`, null);
      setValue(`${fieldPrefix}.tripCount`, undefined);
      setValue(`${fieldPrefix}.pricePerTrip`, undefined);
      setValue(`${fieldPrefix}.revenue`, 0);
      setValue(`${fieldPrefix}.weeklyDriverRent`, undefined);
    }
  }, [optionKey, revenueOptions, setValue, fieldPrefix, isWeeklyPaymentToday]);

  const tripCount = rowValues.tripCount || 0;
  const pricePerTrip = rowValues.pricePerTrip || 0;
  const calculatedTotal = calculateFlatRateTotal(tripCount, pricePerTrip);

  return {
    fieldPrefix,
    rowValues,
    comboboxData,
    calculatedTotal,
    isWeeklyPaymentToday,
    weekdayName,
  };
};
