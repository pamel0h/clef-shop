import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '../icons/LanguageIcon'
import Button from './Button';
import '../../../css/components/LanguageSelector.css'; // Стили для выпадающего меню

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false); // Состояние для открытия/закрытия меню
  const dropdownRef = useRef(null); // Создаем ref для контейнера

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang); // Переключаем язык
    setIsOpen(false); // Закрываем меню после выбора
  };

  useEffect(() => {
  const handleClickOutside = (event) => {
    //console.log('Click target:', event.target); // логируем 
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  return (
    <div className="language-selector" ref={dropdownRef}>
      <Button
        variant="icon"
        size="medium"
        onClick={toggleDropdown}
        icon={<LanguageIcon />}
        className="language-selector__button"
      />
      {isOpen && (
        <ul className="language-selector__dropdown">
          {languages.map((lang) => (
            <li
              key={lang.code}
              className={`language-selector__item ${i18n.language === lang.code ? 'active' : ''}`}
              onClick={() => changeLanguage(lang.code)}
            >
              {lang.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;