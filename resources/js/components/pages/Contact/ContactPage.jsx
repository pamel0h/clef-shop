import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import ContactForm from './ContactForm';
import sanitizeHtml from 'sanitize-html';
import '../../../../css/components/ContactPage.css';

const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState({
    mainTitle: '',
    phones: '',
    phoneNumbers: [],
    aviable: '',
    howTitle: '',
    howText: '',
    questionsTitle: '',
    questionsText: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/pages/contacts');

        if (response.data.success && response.data.data) {
          const pageContent = response.data.data.content?.[i18n.language] || {};
          // Обеспечиваем, что phoneNumbers всегда массив
          const phoneNumbers = Array.isArray(pageContent.phoneNumbers)
            ? pageContent.phoneNumbers
            : typeof pageContent.phoneNumbers === 'string'
              ? pageContent.phoneNumbers.split(',').filter(phone => phone.trim())
              : ['+1234566788', '+1234455567'];

          setContent({
            mainTitle: pageContent.mainTitle || t('contacts.mainTitle'),
            phones: pageContent.phones || t('contacts.phones'),
            phoneNumbers,
            aviable: pageContent.aviable || t('contacts.aviable'),
            howTitle: pageContent.howTitle || t('contacts.howTitle'),
            howText: pageContent.howText || t('contacts.howText'),
            questionsTitle: pageContent.questionsTitle || t('contacts.questionsTitle'),
            questionsText: pageContent.questionsText || t('contacts.questionsText'),
          });
        } else {
          // Fallback к переводам
          setContent({
            mainTitle: t('contacts.mainTitle'),
            phones: t('contacts.phones'),
            phoneNumbers: ['+1234566788', '+1234455567'],
            aviable: t('contacts.aviable'),
            howTitle: t('contacts.howTitle'),
            howText: t('contacts.howText'),
            questionsTitle: t('contacts.questionsTitle'),
            questionsText: t('contacts.questionsText'),
          });
        }
      } catch (error) {
        console.error('Error loading contacts page content:', error);
        // Fallback к переводам при ошибке
        setContent({
          mainTitle: t('contacts.mainTitle'),
          phones: t('contacts.phones'),
          phoneNumbers: ['+1234566788', '+1234455567'],
          aviable: t('contacts.aviable'),
          howTitle: t('contacts.howTitle'),
          howText: t('contacts.howText'),
          questionsTitle: t('contacts.questionsTitle'),
          questionsText: t('contacts.questionsText'),
        });
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [i18n.language, t]);

  // Функция для очистки HTML
  const sanitizeContent = (html) => {
    return sanitizeHtml(html, {
      allowedTags: ['p', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br', 'span', 'div'],
      allowedAttributes: {
        a: ['href', 'target'],
        span: ['style'],
      },
    });
  };

  if (loading) {
    return <div className="page-loading text-center">Загрузка...</div>;
  }

  return (
    <div className="page page--contact">
      <h1 className="titleContact">{content.mainTitle}</h1>
      <h2>{content.phones}</h2>
      <div className="numbers">
        <ul>
          {Array.isArray(content.phoneNumbers) && content.phoneNumbers.length > 0 ? (
            content.phoneNumbers.map((phone, index) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: sanitizeContent(phone) }}></li>
            ))
          ) : (
            <li>Нет номеров телефонов</li>
          )}
        </ul>
        <p>{content.aviable}</p>
      </div>
      <h2>{content.howTitle}</h2>
      <div className="cardShop"></div>
      <div dangerouslySetInnerHTML={{ __html: sanitizeContent(content.howText) }} />
      <h2>{content.questionsTitle}</h2>
      <div dangerouslySetInnerHTML={{ __html: sanitizeContent(content.questionsText) }} />
      <ContactForm />
    </div>
  );
};

export default ContactPage;