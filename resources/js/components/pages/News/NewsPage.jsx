import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Button from '../../UI/Button';
import News from './News';
import sanitizeHtml from 'sanitize-html';
import '../../../../css/components/NewsPage.css';

const NewsPage = () => {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState({
    mainTitle: '',
    description: '',
    archiveTitle: '',
    news: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/pages/news');

        if (response.data.success && response.data.data) {
          const pageContent = response.data.data.content?.[i18n.language] || {};
          setContent({
            mainTitle: pageContent.mainTitle || t('news.mainTitle'),
            description: pageContent.description || t('news.description'),
            archiveTitle: pageContent.archiveTitle || t('news.archiveTitle'),
            news: pageContent.news || [],
          });
        } else {
          // Fallback к переводам
          setContent({
            mainTitle: t('news.mainTitle'),
            description: t('news.description'),
            archiveTitle: t('news.archiveTitle'),
            news: [],
          });
        }
      } catch (error) {
        console.error('Error loading news page content:', error);
        // Fallback к переводам при ошибке
        setContent({
          mainTitle: t('news.mainTitle'),
            description: t('news.description'),
            archiveTitle: t('news.archiveTitle'),
            news: [],
        });
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [i18n.language, t]);

  // Функция для очистки HTML
  const sanitizeContent = (html) => {
    return sanitizeHtml(html || '', {
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
    <div className="page page--news">
      <h1 className="titleNews">{content.mainTitle}</h1>
      <div
        className="descNews"
        dangerouslySetInnerHTML={{ __html: sanitizeContent(content.description) }}
      />
      {content.news
        .filter(newsItem => newsItem.visible !== false)
        .slice(0, 6)
        .map((newsItem, index) => (
          <News
            key={newsItem.id || index}
            title={newsItem.title}
            to={newsItem.to || `/news/${newsItem.id}`}
            className={`news${index + 1}`}
            variant={index === 0 ? 'big' : undefined}
            backgroundImage={newsItem.image}
            description={newsItem.description}
          />
        ))}
      <h1 className="titleArchive">{content.archiveTitle}</h1>
      {content.news
        .filter(newsItem => newsItem.visible !== false)
        .slice(6)
        .map((newsItem, index) => (
          <News
            key={newsItem.id || index + 6}
            title={newsItem.title}
            to={newsItem.to || `/news/${newsItem.id}`}
            className={`news${index + 7}`}
            backgroundImage={newsItem.image}
            description={newsItem.description}
          />
        ))}
      <div className="listpages">
        <p>{t('news.page')}</p>
        <div className="buttons">
          <Button size="small">1</Button>
          <Button size="small">2</Button>
          <Button size="small">3</Button>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;