import { RemunerationModelType } from './remuneration-types';

/**
 * Mirror of the backend RemunerationModelRules. The single place that knows which models exist,
 * which can still be assigned and which can be combined. A new model needs one new entry here.
 *
 * BASE   - defines how regular revenue is split, a driver needs at least one
 * ADDON  - optional on top of a base model
 * LEGACY - only kept for historical shifts, can not be assigned anymore
 */
export type RemunerationCategory = 'BASE' | 'ADDON' | 'LEGACY';

interface RemunerationModelRule {
  category: RemunerationCategory;
  incompatibleWith: RemunerationModelType[];
}

export const REMUNERATION_MODEL_RULES: Record<RemunerationModelType, RemunerationModelRule> = {
  [RemunerationModelType.PERCENTAGE_SHARE]: {
    category: 'BASE',
    incompatibleWith: [RemunerationModelType.WEEKLY_FIXED_RATE],
  },
  [RemunerationModelType.FIXED_PER_SHIFT]: {
    category: 'BASE',
    incompatibleWith: [RemunerationModelType.WEEKLY_FIXED_RATE],
  },
  [RemunerationModelType.WEEKLY_FIXED_RATE]: {
    category: 'BASE',
    incompatibleWith: [RemunerationModelType.PERCENTAGE_SHARE, RemunerationModelType.FIXED_PER_SHIFT],
  },
  [RemunerationModelType.FLAT_RATE_PERCENTAGE]: {
    category: 'ADDON',
    incompatibleWith: [],
  },
  [RemunerationModelType.FLAT_RATE]: {
    category: 'LEGACY',
    incompatibleWith: [],
  },
};

export type RemunerationCombinationError =
  | 'base_model_required'
  | 'incompatible_remuneration_models';

const isRemunerationModelType = (value: unknown): value is RemunerationModelType =>
  typeof value === 'string' && value in REMUNERATION_MODEL_RULES;

export const isCreatableRemunerationModel = (type: RemunerationModelType): boolean =>
  REMUNERATION_MODEL_RULES[type].category !== 'LEGACY';

export const isBaseRemunerationModel = (type: RemunerationModelType): boolean =>
  REMUNERATION_MODEL_RULES[type].category === 'BASE';

export const areRemunerationModelsCompatible = (
  a: RemunerationModelType,
  b: RemunerationModelType
): boolean =>
  !REMUNERATION_MODEL_RULES[a].incompatibleWith.includes(b) &&
  !REMUNERATION_MODEL_RULES[b].incompatibleWith.includes(a);

/** Returns the reason why the selected models are invalid, or null if the combination is fine. */
export const validateRemunerationCombination = (
  selectedTypes: unknown[]
): RemunerationCombinationError | null => {
  const types = selectedTypes.filter(isRemunerationModelType);

  if (!types.some(isBaseRemunerationModel)) {
    return 'base_model_required';
  }

  const hasIncompatiblePair = types.some((a, i) =>
    types.slice(i + 1).some((b) => !areRemunerationModelsCompatible(a, b))
  );
  return hasIncompatiblePair ? 'incompatible_remuneration_models' : null;
};
