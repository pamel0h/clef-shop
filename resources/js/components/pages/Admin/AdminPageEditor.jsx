import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import BannerEditor from './BannerEditor';
import NewsEditor from './NewsEditor';
import '../../../../css/components/AdminPageEditor.css';

const AdminPageEditor = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({});
  const [pageData, setPageData] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [expandedSections, setExpandedSections] = useState({
    banners: false,
    news: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Определяем поля для каждой страницы
  const getPageFields = (pageId) => {
    switch (pageId) {
      case 'about':
        return {
          mainTitle: { type: 'text', label: 'Главный заголовок' },
          title1: { type: 'text', label: 'Заголовок 1' },
          text1: { type: 'editor', label: 'Текст 1' },
          text2: { type: 'editor', label: 'Текст 2' },
          title2: { type: 'text', label: 'Заголовок 2' },
          text3: { type: 'editor', label: 'Текст 3' },
          title3: { type: 'text', label: 'Заголовок 3' },
          image: { type: 'image', label: 'Главное изображение' },
          sign: { type: 'text', label: 'Подпись' },
        };
      case 'home':
        return {
          mainTitle: { type: 'text', label: 'Главный заголовок' },
          image: { type: 'image', label: 'Главное изображение' },
          mainButton: { type: 'text', label: 'Текст кнопки' },
          brandsTitle: { type: 'text', label: 'Заголовок брендов' },
          whyTitle: { type: 'text', label: 'Заголовок "Почему мы"' },
          qualityTitle: { type: 'text', label: 'Заголовок качества' },
          qualityText: { type: 'editor', label: 'Текст о качестве' },
          serviceTitle: { type: 'text', label: 'Заголовок сервиса' },
          serviceText: { type: 'editor', label: 'Текст о сервисе' },
          deliveryTitle: { type: 'text', label: 'Заголовок доставки' },
          deliveryText: { type: 'editor', label: 'Текст о доставке' },
          banners: { type: 'banners', label: 'Баннеры' },
        };
      case 'contacts':
        return {
          mainTitle: { type: 'text', label: 'Главный заголовок' },
          phones: { type: 'text', label: 'Заголовок телефонов' },
          phoneNumbers: { type: 'editor', label: 'Номера телефонов (по одному на строку)' },
          aviable: { type: 'editor', label: 'Текст доступности' },
          howTitle: { type: 'text', label: 'Заголовок "Как добраться"' },
          howText: { type: 'editor', label: 'Текст "Как добраться"' },
          questionsTitle: { type: 'text', label: 'Заголовок вопросов' },
          questionsText: { type: 'editor', label: 'Текст вопросов' },
        };
      case 'news':
        return {
          mainTitle: { type: 'text', label: 'Главный заголовок' },
          description: { type: 'editor', label: 'Описание' },
          archiveTitle: { type: 'text', label: 'Заголовок архива' },
          news: { type: 'news', label: 'Новости' },
        };
      default:
        return {};
    }
  };

  // Загрузка изображения
  const handleImageUpload = async (fieldKey, file) => {
    if (!file) return;

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите файл изображения');
      return;
    }

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB');
      return;
    }

    try {
      setUploading(prev => ({ ...prev, [fieldKey]: true }));

      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', pageId); // папка для организации файлов

      const token = localStorage.getItem('auth_token');
      const response = await axios.post('/api/admin/upload-image', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        // Обновляем путь к изображению в форме
        handleFieldChange(fieldKey, response.data.path);
      } else {
        alert('Ошибка загрузки изображения');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Ошибка загрузки изображения');
    } finally {
      setUploading(prev => ({ ...prev, [fieldKey]: false }));
    }
  };

  // Загружаем данные страницы
  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/pages/${pageId}`);
        
        if (response.data.success) {
          setPageData(response.data.data);
          const content = response.data.data?.content || {};
          const fields = getPageFields(pageId);
          const initialFormData = {};
          
          ['ru', 'en'].forEach(lang => {
            initialFormData[lang] = {};
            Object.keys(fields).forEach(fieldKey => {
              if (fieldKey === 'phoneNumbers') {
                const phoneNumbers = content[lang]?.[fieldKey];
                initialFormData[lang][fieldKey] = Array.isArray(phoneNumbers)
                  ? phoneNumbers.join('\n')
                  : typeof phoneNumbers === 'string'
                    ? phoneNumbers
                    : '';
              } else if (fieldKey === 'news' || fieldKey === 'banners') {
                initialFormData[lang][fieldKey] = content[lang]?.[fieldKey] || [];
              } else {
                initialFormData[lang][fieldKey] = content[lang]?.[fieldKey] || '';
              }
            });
          });
          
          setFormData(initialFormData);
        }
      } catch (error) {
        console.error('Error loading page data:', error);
        alert('Ошибка загрузки данных страницы');
      } finally {
        setLoading(false);
      }
    };

    if (pageId) {
      loadPageData();
    }
  }, [pageId]);

  // Обработчик изменения полей
  const handleFieldChange = (fieldKey, value) => {
    setFormData(prev => {
      const newFormData = { ...prev };
      if (fieldKey === 'phoneNumbers') {
        newFormData[currentLanguage] = {
          ...newFormData[currentLanguage],
          [fieldKey]: value.split('\n').filter(phone => phone.trim()),
        };
      } else {
        newFormData[currentLanguage] = {
          ...newFormData[currentLanguage],
          [fieldKey]: value,
        };
      }
      return newFormData;
    });
  };

  // Обработчик изменения TinyMCE
  const handleEditorChange = (content, fieldKey) => {
    handleFieldChange(fieldKey, content);
  };

  // Сохранение данных
  const handleSave = async () => {
    try {
      setSaving(true);
      
      const token = localStorage.getItem('auth_token');
      const response = await axios.put(`/api/admin/pages/${pageId}`, {
        content: formData
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        alert('Страница успешно сохранена!');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Ошибка сохранения страницы');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Загрузка...</div>;
  }

  const fields = getPageFields(pageId);
  const currentFormData = formData[currentLanguage] || {};

  return (
    <div className="admin-page-editor">
      <div className="editor-header">
        <h1>Редактирование страницы: {pageId}</h1>
        
        <div className="language-switcher">
          <label>Язык:</label>
          <select 
            value={currentLanguage} 
            onChange={(e) => setCurrentLanguage(e.target.value)}
          >
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <div className="editor-form">
        {Object.entries(fields).map(([fieldKey, fieldConfig]) => (
          <div key={fieldKey} className="form-group">
            {(fieldConfig.type === 'banners' || fieldConfig.type === 'news') ? (
              <div className="collapsible-section">
                <button 
                  className="section-toggle"
                  onClick={() => toggleSection(fieldKey)}
                >
                  {fieldConfig.label}
                  <span className={`toggle-icon ${expandedSections[fieldKey] ? 'open' : ''}`}>
                    ▼
                  </span>
                </button>
                
                {expandedSections[fieldKey] && (
                  <div className="section-content">
                    {fieldConfig.type === 'banners' && (
                      <BannerEditor
                        banners={currentFormData[fieldKey] || []}
                        onChange={(banners) => handleFieldChange(fieldKey, banners)}
                        currentLanguage={currentLanguage}
                      />
                    )}
                    
                    {fieldConfig.type === 'news' && (
                      <NewsEditor
                        news={currentFormData[fieldKey] || []}
                        onChange={(news) => handleFieldChange(fieldKey, news)}
                        currentLanguage={currentLanguage}
                      />
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                <label>{fieldConfig.label}:</label>
                
                {fieldConfig.type === 'text' && (
                  <input
                    type="text"
                    value={currentFormData[fieldKey] || ''}
                    onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                    className="form-input"
                  />
                )}
                
                {fieldConfig.type === 'textarea' && (
                  <textarea
                    value={currentFormData[fieldKey] || ''}
                    onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                    className="form-textarea"
                    rows={5}
                  />
                )}

                {fieldConfig.type === 'image' && (
                  <div className="image-field">
                    <div className="image-input-group">
                      <input
                        type="text"
                        value={currentFormData[fieldKey] || ''}
                        onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                        className="form-input"
                        placeholder="Путь к изображению или загрузите файл"
                      />
                      <div className="image-upload-section">
                        <input
                          type="file"
                          id={`image-upload-${fieldKey}`}
                          accept="image/*"
                          onChange={(e) => handleImageUpload(fieldKey, e.target.files[0])}
                          className="file-input"
                          disabled={uploading[fieldKey]}
                        />
                        <label 
                          htmlFor={`image-upload-${fieldKey}`} 
                          className={`file-input-label ${uploading[fieldKey] ? 'uploading' : ''}`}
                        >
                          {uploading[fieldKey] ? 'Загружается...' : 'Выбрать файл'}
                        </label>
                      </div>
                    </div>
                    
                    {/* Превью изображения */}
                    {currentFormData[fieldKey] && (
                      <div className="image-preview">
                        <img 
                          src={currentFormData[fieldKey]} 
                          alt="Preview" 
                          className="preview-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleFieldChange(fieldKey, '')}
                          className="remove-image-btn"
                        >
                          ✕ 
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {fieldConfig.type === 'editor' && (
                  <Editor
                    apiKey="vkcmcx49iuev9aqstqk1ab9q30dlj8x8je5ak45gx8tqid1s"
                    value={currentFormData[fieldKey] || ''}
                    onEditorChange={(content) => handleEditorChange(content, fieldKey)}
                    init={{
                      height: 400,
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | link',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                      language: currentLanguage === 'ru' ? 'ru' : 'en'
                    }}
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="editor-actions">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
        
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="btn btn-secondary"
        >
          Отмена
        </button>
      </div>
    </div>
  );
};

export default AdminPageEditor;