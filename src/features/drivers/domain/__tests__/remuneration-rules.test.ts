import { describe, expect, it } from 'vitest';
import {
  isCreatableRemunerationModel,
  REMUNERATION_MODEL_RULES,
  validateRemunerationCombination,
} from '../remuneration-rules';
import { RemunerationModelType } from '../remuneration-types';

const {
  PERCENTAGE_SHARE,
  WEEKLY_FIXED_RATE,
  FIXED_PER_SHIFT,
  FLAT_RATE_PERCENTAGE,
  FLAT_RATE,
} = RemunerationModelType;

describe('remuneration rules', () => {
  it('has a rule for every remuneration model', () => {
    Object.values(RemunerationModelType).forEach((type) => {
      expect(REMUNERATION_MODEL_RULES[type]).toBeDefined();
    });
  });

  it('does not allow assigning the legacy flat rate model anymore', () => {
    expect(isCreatableRemunerationModel(FLAT_RATE)).toBe(false);
    expect(isCreatableRemunerationModel(FIXED_PER_SHIFT)).toBe(true);
  });

  describe('validateRemunerationCombination', () => {
    it.each([
      [[PERCENTAGE_SHARE]],
      [[WEEKLY_FIXED_RATE]],
      [[FIXED_PER_SHIFT]],
      [[PERCENTAGE_SHARE, FIXED_PER_SHIFT]],
      [[PERCENTAGE_SHARE, FLAT_RATE_PERCENTAGE]],
      [[WEEKLY_FIXED_RATE, FLAT_RATE_PERCENTAGE]],
      [[FIXED_PER_SHIFT, FLAT_RATE_PERCENTAGE]],
      [[PERCENTAGE_SHARE, FIXED_PER_SHIFT, FLAT_RATE_PERCENTAGE]],
    ])('accepts %j', (types) => {
      expect(validateRemunerationCombination(types)).toBeNull();
    });

    it.each([
      [[PERCENTAGE_SHARE, WEEKLY_FIXED_RATE]],
      [[FIXED_PER_SHIFT, WEEKLY_FIXED_RATE]],
      [[PERCENTAGE_SHARE, FIXED_PER_SHIFT, WEEKLY_FIXED_RATE]],
    ])('rejects incompatible %j', (types) => {
      expect(validateRemunerationCombination(types)).toBe('incompatible_remuneration_models');
    });

    it('requires a base model', () => {
      expect(validateRemunerationCombination([])).toBe('base_model_required');
      expect(validateRemunerationCombination([FLAT_RATE_PERCENTAGE])).toBe('base_model_required');
      expect(validateRemunerationCombination([undefined])).toBe('base_model_required');
    });
  });
});
