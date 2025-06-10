// src/components/pages/About/AboutPage.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import '../../../../css/components/AboutPage.css';
import TelegramIcon from '../../icons/TelegramIcon';
import VkIcon from '../../icons/VkIcon';
import TikTokIcon from '../../icons/TikTokIcon';
import '../../../../css/components/Loading.css';

const AboutPage = () => {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState({
    mainTitle: '',
    title1: '',
    text1: '',
    text2: '',
    title2: '',
    text3: '',
    title3: '',
    image: '/images/mainphoto.jpg',
    sign: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/pages/about');
        
        if (response.data.success && response.data.data) {
          const pageContent = response.data.data.content?.[i18n.language] || {};
          setContent({
            mainTitle: pageContent.mainTitle || t('about.mainTitle'),
            title1: pageContent.title1 || t('about.title1'),
            text1: pageContent.text1 || t('about.text1'),
            text2: pageContent.text2 || t('about.text2'),
            title2: pageContent.title2 || t('about.title2'),
            text3: pageContent.text3 || t('about.text3'),
            title3: pageContent.title3 || t('about.title3'),
            image: pageContent.image || '/images/mainphoto.jpg',
            sign: pageContent.sign || t('about.sign'),
          });
        } else {
          // Если данных в БД нет, используем переводы по умолчанию
          setContent({
            mainTitle: t('about.mainTitle'),
            title1: t('about.title1'),
            text1: t('about.text1'),
            text2: t('about.text2'),
            title2: t('about.title2'),
            text3: t('about.text3'),
            title3: t('about.title3'),
            image: '/images/mainphoto.jpg',
            sign: t('about.sign'),
          });
        }
      } catch (error) {
        console.error('Error loading about page content:', error);
        // В случае ошибки используем переводы по умолчанию
        setContent({
          mainTitle: t('about.mainTitle'),
          title1: t('about.title1'),
          text1: t('about.text1'),
          text2: t('about.text2'),
          title2: t('about.title2'),
          text3: t('about.text3'),
          title3: t('about.title3'),
          image: '/images/mainphoto.jpg',
          sign: t('about.sign'),
        });
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [i18n.language, t]);

  if (loading) {
   return <div className="loading"></div>;
  }

  return (
    <div className="page page--about">
     <div className='lines lines-top'>
                <div className='lineItem'></div>
                <div className='lineItem'></div>
                <div className='lineItem'></div>
                <div className='lineItem'></div>
                <div className='lineItem'></div>
                <div className='lineItem'></div>
                <div className='lineItem'></div>
            </div>
      <h1 className="titleAbout">{content.mainTitle}</h1>
      <div className="imageAbout">
        <img src={content.image} alt="Main" />
      </div>
      <h1 className="titleAbout1">{content.title1}</h1>
      <div className="text1" dangerouslySetInnerHTML={{ __html: content.text1 }} />
      <div className="text2" dangerouslySetInnerHTML={{ __html: content.text2 }} />
      <h1 className="titleAbout2">{content.title2}</h1>
      <div className="imageAbout1"></div>
      <div className="imageAbout2" dangerouslySetInnerHTML={{ __html: content.text3 }} />
      <h1 className="titleAbout3">{content.title3}</h1>
      <div className="media1 media"> 
        <TelegramIcon/>
        <p>@clef_shop</p>
      </div>
      <div className="media2 media">
        <VkIcon/>
        <p>@clef_mus</p>
      </div>
      <div className="media3 media">
        <TikTokIcon />
        <p>@clef</p>
      </div>
      <p className="sign">{content.sign}</p>
    </div>
  );
};

export default AboutPage;