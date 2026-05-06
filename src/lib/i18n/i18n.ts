import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(
    resourcesToBackend((language, namespace, callback) => {
      return import(`../../locales/${language}/${namespace}.json`)
        .then((resources) => {
          callback(null, resources.default);
        })
        .catch((error) => {
          callback(error, null);
        });
    })
  )
  .on('failedLoading', (_a, _b, msg) => console.error(msg));

i18n.init({
  debug: false,
  fallbackLng: 'en',
  supportedLngs: ['en'],
  defaultNS: 'common',
  ns: ['common', 'auth', 'dashboard', 'errors', 'form', 'notifications', 'remuneration', 'drivers', 'cars'],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
