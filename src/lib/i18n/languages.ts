export interface Language {
  label: string;
  code: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { label: 'Deutsch', code: 'de' },
  { label: 'English', code: 'en' },
];

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES[1];
