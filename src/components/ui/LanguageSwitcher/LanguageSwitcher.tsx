import { useTranslation } from 'react-i18next';
import { SegmentedControl, Text, Stack } from '@mantine/core';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/languages';

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <Stack gap="xs">
      <Text fw={500} size="sm">
        {t('common:language', 'Language')}
      </Text>
      <SegmentedControl
        value={i18n.resolvedLanguage}
        onChange={handleLanguageChange}
        data={SUPPORTED_LANGUAGES.map((lang) => ({
          label: lang.label,
          value: lang.code,
        }))}
      />
    </Stack>
  );
};
