import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Group, Menu, UnstyledButton } from '@mantine/core';
import { DEFAULT_LANGUAGE, Language, SUPPORTED_LANGUAGES } from '@/lib/i18n/languages';
import classes from './LanguagePicker.module.css';

export const LanguagePicker = () => {
  const { i18n } = useTranslation();
  const [opened, setOpened] = useState(false);

  const selectedLanguage =
    SUPPORTED_LANGUAGES.find((language) => language.code === i18n.resolvedLanguage) ||
    DEFAULT_LANGUAGE;

  function changeLanguage(language: Language) {
    if (i18n.resolvedLanguage === language.code) {
      return;
    }
    i18n.changeLanguage(language.code);
  }

  const items = SUPPORTED_LANGUAGES.map((language) => (
    <Menu.Item
      onClick={() => changeLanguage(language)}
      key={language.label}
    >
      {language.label}
    </Menu.Item>
  ));

  return (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      width="target"
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton
          className={classes.control}
          data-expanded={opened || undefined}
        >
          <Group gap="xs">
            <span className="">{selectedLanguage.label}</span>
          </Group>
          <ChevronDown
            size={16}
            className={classes.icon}
          />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
};
