import { RemunerationModelType } from '../domain/remuneration-types';

export const i18nDriverRemunerationConfigMap: Record<RemunerationModelType, string> = {
  [RemunerationModelType.PERCENTAGE_SHARE]: 'percentageShare',
  [RemunerationModelType.WEEKLY_FIXED_RATE]: 'weeklyFixedRate',
  [RemunerationModelType.FLAT_RATE]: 'flatRate',
  [RemunerationModelType.FLAT_RATE_PERCENTAGE]: 'flatRatePercentage',
  [RemunerationModelType.FIXED_PER_SHIFT]: 'fixedPerShift',
};

export type TranslateFn = (key: string) => string | unknown;

export const getRemunerationLabelText = (
  type: RemunerationModelType | null | undefined,
  t?: TranslateFn
): string => {
  if (!type) {
    return '';
  }
  const key = i18nDriverRemunerationConfigMap[type];
  if (!key) {
    return type;
  }
  if (typeof t === 'function') {
    const translated = t(`app:remuneration.type.${key}`);
    if (typeof translated === 'string') {
      return translated;
    }
  }
  return key;
};
