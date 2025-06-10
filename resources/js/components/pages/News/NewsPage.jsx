import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Button from '../../UI/Button';
import News from './News';
import sanitizeHtml from 'sanitize-html';
import '../../../../css/components/NewsPage.css';
import '../../../../css/components/Loading.css';

const NewsPage = () => {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState({
    mainTitle: '',
    description: '',
    archiveTitle: '',
    news: [],
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

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
          setContent({
            mainTitle: t('news.mainTitle'),
            description: t('news.description'),
            archiveTitle: t('news.archiveTitle'),
            news: [],
          });
        }
      } catch (error) {
        console.error('Error loading news page content:', error);
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
    return <div className="loading"></div>;
  }

  const visibleNews = content.news.filter(newsItem => newsItem.visible !== false);
  const totalPages = Math.ceil(visibleNews.length / itemsPerPage);
  
  // Получаем новости для текущей страницы
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = visibleNews.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={`page page--news ${currentPage === 1 ? 'first-page' : ''}`}>
      <h1 className="titleNews">{content.mainTitle}</h1>
      <div
        className="descNews"
        dangerouslySetInnerHTML={{ __html: sanitizeContent(content.description) }}
      />
      
      {currentItems.map((newsItem, index) => (
        <News
          key={newsItem.id || index}
          title={newsItem.title}
          to={newsItem.to || `/news/${newsItem.id}`}
          className={currentPage === 1 && index === 0 ? 'news1' : 'news-item'}
          variant={currentPage === 1 && index === 0 ? 'big' : undefined}
          backgroundImage={newsItem.image}
          description={newsItem.description}
        />
      ))}
      
      <div className="listpages">
        <p>{t('news.page')} {currentPage} из {totalPages}</p>
        <div className="buttons">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <Button
              key={number}
              size="small"
              className={currentPage === number ? 'active' : ''}
              onClick={() => paginate(number)}
            >
              {number}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;