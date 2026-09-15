import { RemunerationModelType } from '../domain/remuneration-types';

export const i18nDriverRemunerationConfigMap: Record<RemunerationModelType, string> = {
  [RemunerationModelType.PERCENTAGE_SHARE]: 'percentageShare',
  [RemunerationModelType.WEEKLY_FIXED_RATE]: 'weeklyFixedRate',
  [RemunerationModelType.FLAT_RATE]: 'flatRate',
};

export interface RemunerationTypeOption {
  label: string;
  value: RemunerationModelType;
}

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

export const buildRemunerationTypeOptions = (t: TranslateFn): RemunerationTypeOption[] => {
  return [
    {
      label: getRemunerationLabelText(RemunerationModelType.PERCENTAGE_SHARE, t),
      value: RemunerationModelType.PERCENTAGE_SHARE,
    },
    {
      label: getRemunerationLabelText(RemunerationModelType.WEEKLY_FIXED_RATE, t),
      value: RemunerationModelType.WEEKLY_FIXED_RATE,
    },
    {
      label: getRemunerationLabelText(RemunerationModelType.FLAT_RATE, t),
      value: RemunerationModelType.FLAT_RATE,
    },
  ];
};
