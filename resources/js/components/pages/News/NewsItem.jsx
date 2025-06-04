import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import sanitizeHtml from 'sanitize-html';
import '../../../../css/components/NewsItem.css';

const NewsItem = () => {
  const { newsId } = useParams();
  const { t, i18n } = useTranslation();
  const [newsItem, setNewsItem] = useState({
    title: '',
    image: '',
    description: '',
    content: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Функция для очистки HTML
  const sanitizeContent = (html) => {
    return sanitizeHtml(html || '', {
      allowedTags: ['p', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br', 'span', 'div', 'img'],
      allowedAttributes: {
        a: ['href', 'target'],
        span: ['style'],
        img: ['src', 'alt'],
      },
    });
  };

  useEffect(() => {
    const loadNewsItem = async () => {
      try {
        setLoading(true);
        // Запрашиваем данные страницы новостей
        const response = await axios.get('/api/pages/news');

        if (response.data.success && response.data.data) {
          const pageContent = response.data.data.content?.[i18n.language] || {};
          const newsList = pageContent.news || [];
          
          // Находим новость по newsId
          const news = newsList.find(item => item.id === newsId);

          if (news) {
            setNewsItem({
              title: news.title || t('newsItem.defaultTitle'),
              image: news.image || '/images/mainphoto.jpg',
              description: news.description || t('newsItem.defaultDescription'),
              content: news.content || t('newsItem.defaultContent'),
            });
          } else {
            // Если новость не найдена
            setError(t('newsItem.notFound'));
            setNewsItem({
              title: t('newsItem.defaultTitle'),
              image: '/images/mainphoto.jpg',
              description: t('newsItem.defaultDescription'),
              content: t('newsItem.defaultContent'),
            });
          }
        } else {
          // Fallback при отсутствии данных
          setError(t('newsItem.errorLoading'));
          setNewsItem({
            title: t('newsItem.defaultTitle'),
            image: '/images/mainphoto.jpg',
            description: t('newsItem.defaultDescription'),
            content: t('newsItem.defaultContent'),
          });
        }
      } catch (error) {
        console.error('Error loading news item:', error);
        setError(t('newsItem.errorLoading'));
        setNewsItem({
          title: t('newsItem.defaultTitle'),
          image: '/images/mainphoto.jpg',
          description: t('newsItem.defaultDescription'),
          content: t('newsItem.defaultContent'),
        });
      } finally {
        setLoading(false);
      }
    };

    loadNewsItem();
  }, [newsId, i18n.language, t]);

  if (loading) {
    return <div className="page-loading text-center">{t('newsItem.loading')}</div>;
  }

  if (error) {
    return (
      <div className="page page--news-item">
        <h2>{t('newsItem.error')}</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page page--news-item">
      <h2>{newsItem.title}</h2>
      <div className="blocknews">
        <img src={newsItem.image} alt={newsItem.title} />
      </div>
      <div
        className="news-description"
        dangerouslySetInnerHTML={{ __html: sanitizeContent(newsItem.description) }}
      />
      <div
        className="news-content"
        dangerouslySetInnerHTML={{ __html: sanitizeContent(newsItem.content) }}
      />
    </div>
  );
};

export default NewsItem;