import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
// import enTranslation from '../locales/en/translation.json';
// import ruTranslation from '../locales/ru/translation.json';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend) // Подключаем backend для загрузки переводов
  .use(LanguageDetector) // Автоопределение языка браузера
  .use(initReactI18next) // Интеграция с React
  .init({

    fallbackLng: 'en', // Язык по умолчанию
    detection: {
      order: ['localStorage', 'navigator'], // Сначала проверяем localStorage, затем язык браузера
      caches: ['localStorage'], // Сохраняем выбор языка в localStorage
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Путь к файлам переводов на сервере
    },
    interpolation: {
      escapeValue: false, // React уже экранирует значения
    },
    
  });

export default i18n;