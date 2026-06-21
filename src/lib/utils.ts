//TODO uninstall packages and remove file

import { clsx, type ClassValue } from 'clsx';
import { TFunction } from 'i18next';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mapFieldConfig(field: any, t: TFunction) {
  return {
    name: field.name,
    type: field.type,
    label: t(field.labelKey),
    placeholder: t(field.placeholderKey),
  };
}

export const getNumberSeparators = (locale: string) => {
  const parts = new Intl.NumberFormat(locale).formatToParts(1234.5);

  return {
    thousandSeparator: parts.find((p) => p.type === 'group')?.value ?? ',',

    decimalSeparator: parts.find((p) => p.type === 'decimal')?.value ?? '.',
  };
};

export const createFormatters = (locale: string) => {
  const number = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const numberInt = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  });

  return {
    number: (v: number) => number.format(v),
    integer: (v: number) => numberInt.format(v),
  };
};

export const getTimeDuration = (startTime: string, endTime: string): string => {
  if (!startTime || !endTime) return '-';

  const formatTime = (t: string) => (t.includes('T') ? t : `1970-01-01T${t.substring(0, 5)}:00`);

  const start = new Date(formatTime(startTime));
  let end = new Date(formatTime(endTime));

  let diffMs = end.getTime() - start.getTime();

  if (diffMs < 0) {
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    diffMs += ONE_DAY_MS;
  }

  const totalMinutes = Math.floor(diffMs / (1000 * 60));

  if (totalMinutes <= 0) return '0h 0m';

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
};
