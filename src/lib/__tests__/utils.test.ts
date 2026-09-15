import type { TFunction } from 'i18next';
import { describe, expect, it, vi } from 'vitest';
import {
  createFormatters,
  getNumberSeparators,
  getTimeDuration,
  mapFieldConfig,
} from '../../shared/utils';

describe('utils', () => {
  describe('mapFieldConfig', () => {
    it('should map field config using translation function', () => {
      const mockT = vi.fn((key: string) => `translated_${key}`);
      const field = {
        name: 'testName',
        type: 'text',
        labelKey: 'labels.test',
        placeholderKey: 'placeholders.test',
      };

      const result = mapFieldConfig(field, mockT as unknown as TFunction);

      expect(result).toEqual({
        name: 'testName',
        type: 'text',
        label: 'translated_labels.test',
        placeholder: 'translated_placeholders.test',
      });
    });
  });

  describe('getNumberSeparators', () => {
    it('should return correct separators for de-DE', () => {
      const { thousandSeparator, decimalSeparator } = getNumberSeparators('de-DE');
      expect(thousandSeparator).toBe('.');
      expect(decimalSeparator).toBe(',');
    });

    it('should return correct separators for en-US', () => {
      const { thousandSeparator, decimalSeparator } = getNumberSeparators('en-US');
      expect(thousandSeparator).toBe(',');
      expect(decimalSeparator).toBe('.');
    });
  });

  describe('createFormatters', () => {
    it('should format numbers according to locale', () => {
      const formatters = createFormatters('de-DE');
      expect(formatters.number(1234.5)).toBe('1.234,50');
      expect(formatters.integer(1234.56)).toBe('1.235');
    });
  });

  describe('getTimeDuration', () => {
    it('should return "-" if startTime or endTime is missing', () => {
      expect(getTimeDuration('', '10:00')).toBe('-');
      expect(getTimeDuration('08:00', '')).toBe('-');
    });

    it('should calculate time duration correctly within the same day', () => {
      expect(getTimeDuration('08:00', '10:30')).toBe('2h 30m');
      expect(getTimeDuration('09:15', '09:45')).toBe('0h 30m');
    });

    it('should calculate time duration correctly spanning overnight', () => {
      expect(getTimeDuration('22:00', '02:00')).toBe('4h 0m');
    });

    it('should return "0h 0m" for identical or zero diff times', () => {
      expect(getTimeDuration('10:00', '10:00')).toBe('0h 0m');
    });
  });
});
