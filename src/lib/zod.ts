// i18n/zod-config.ts
import * as z from 'zod';
import i18next from 'i18next';

console.log('zod config wird geladen'); // Debug-Zeile

z.config({
  customError: (iss) => {
    console.log(iss, "iss");
    const path = iss.path?.join('.');

    const specificKey = `errors:${path}.${iss.code}`;
    if (i18next.exists(specificKey)) {
      return i18next.t(specificKey, { ...iss });
    }

    switch (iss.code) {
      case 'invalid_type':
        if (iss.received === 'undefined') {
          return i18next.t('errors:zod.errors.required');
        }
        return i18next.t('errors:zod.errors.invalid_type', {
          expected: iss.expected,
          received: iss.received,
        });

      case 'too_small':
        if (iss.type === 'string') {
          return i18next.t('errors:zod.errors.too_small.string', { minimum: iss.minimum });
        }
        if (iss.type === 'number') {
          return i18next.t('errors:zod.errors.too_small.number', { minimum: iss.minimum });
        }
        return i18next.t('errors:zod.errors.too_small.general', { minimum: iss.minimum });

      case 'too_big':
        if (iss.type === 'string') {
          return i18next.t('errors:zod.errors.too_big.string', { maximum: iss.maximum });
        }
        if (iss.type === 'number') {
          return i18next.t('errors:zod.errors.too_big.number', { maximum: iss.maximum });
        }
        return i18next.t('errors:zod.errors.too_big.general', { maximum: iss.maximum });

      case 'invalid_string':
        if (iss.validation === 'email') {
          return i18next.t('errors:zod.errors.invalid_string.email');
        }
        if (iss.validation === 'url') {
          return i18next.t('errors:zod.errors.invalid_string.url');
        }
        return i18next.t('errors:zod.errors.invalid_string.general');

      case 'custom':
        return iss.message;

      default:
        return undefined;
    }
  },
});