import { useTranslation } from 'react-i18next';
import { RemunerationModelType } from '../domain/remuneration-types';
import {
  getRemunerationLabelText,
  i18nDriverRemunerationConfigMap,
} from '../utils/remuneration-labels.utils';

export { i18nDriverRemunerationConfigMap };

export const useRemunerationLabels = () => {
  const { t } = useTranslation(['app'], { useSuspense: false });

  const getRemunerationLabel = (type?: RemunerationModelType | null) => {
    return getRemunerationLabelText(type, t);
  };

  return {
    getRemunerationLabel,
  };
};
