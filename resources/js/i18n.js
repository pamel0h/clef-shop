import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from '../locales/en/translation.json';
import ruTranslation from '../locales/ru/translation.json';

i18n
  .use(LanguageDetector) // Автоопределение языка браузера
  .use(initReactI18next) // Интеграция с React
  .init({
    resources: {
      en: { translation: enTranslation },
      ru: { translation: ruTranslation },
    },
    fallbackLng: 'en', // Язык по умолчанию
    detection: {
      order: ['localStorage', 'navigator'], // Сначала проверяем localStorage, затем язык браузера
      caches: ['localStorage'], // Сохраняем выбор языка в localStorage
    },
    interpolation: {
      escapeValue: false, // React уже экранирует значения
    },
  });

export default i18n;