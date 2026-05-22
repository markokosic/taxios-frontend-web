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