import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

const NewsEditor = ({ news, onChange, currentLanguage }) => {
  const [uploading, setUploading] = useState({});

  const handleNewsChange = (index, field, value) => {
    const updatedNews = [...news];
    updatedNews[index] = {
      ...updatedNews[index],
      [field]: value,
    };
    onChange(updatedNews);
  };

  const addNews = () => {
    const newNews = {
      id: Date.now(),
      title: '',
      description: '',
      image: '',
      to: `/news/${news.length ? Math.max(...news.map(n => n.id)) + 1 : 1}`,
      variant: 'small',
      visible: true,
    };
    onChange([...news, newNews]);
  };

  const removeNews = (index) => {
    const updatedNews = news.filter((_, i) => i !== index);
    onChange(updatedNews);
  };

  const toggleNewsVisibility = (index) => {
    const updatedNews = [...news];
    updatedNews[index] = {
      ...updatedNews[index],
      visible: !updatedNews[index].visible,
    };
    onChange(updatedNews);
  };

  const handleImageUpload = async (index, file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите файл изображения');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB');
      return;
    }

    try {
      setUploading((prev) => ({ ...prev, [index]: true }));

      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'news');

      const token = localStorage.getItem('auth_token');
      const response = await axios.post('/api/admin/upload-image', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        handleNewsChange(index, 'image', response.data.path);
      } else {
        alert('Ошибка загрузки изображения');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Ошибка загрузки изображения');
    } finally {
      setUploading((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className="news-editor">
      <div className="news-editor-header">
        <h3>Управление новостями</h3>
        <button type="button" onClick={addNews} className="btn btn-primary btn-small">
          + Добавить новость
        </button>
      </div>

      {news.map((newsItem, index) => (
        <div key={newsItem.id} className="news-item">
          <div className="news-item-header">
            <h4>Новость #{index + 1}</h4>
            <div className="news-controls">
              <button
                type="button"
                onClick={() => toggleNewsVisibility(index)}
                className={`btn btn-small ${newsItem.visible ? 'btn-secondary' : 'btn-success'}`}
              >
                {newsItem.visible ? 'Скрыть' : 'Показать'}
              </button>
              <button
                type="button"
                onClick={() => removeNews(index)}
                className="btn btn-danger btn-small"
              >
                Удалить
              </button>
            </div>
          </div>

          <div className="news-fields">
            <div className="form-group">
              <label>Тип новости:</label>
              <select
                value={newsItem.variant || 'small'}
                onChange={(e) => handleNewsChange(index, 'variant', e.target.value)}
                className="form-input"
              >
                <option value="big">Большая</option>
                <option value="small">Маленькая</option>
              </select>
            </div>

            <div className="form-group">
              <label>Заголовок:</label>
              <input
                type="text"
                value={newsItem.title || ''}
                onChange={(e) => handleNewsChange(index, 'title', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Ссылка (URL):</label>
              <input
                type="text"
                value={newsItem.to || ''}
                onChange={(e) => handleNewsChange(index, 'to', e.target.value)}
                className="form-input"
                placeholder="/news/123"
              />
            </div>

            <div className="form-group">
              <label>Краткое описание:</label>
              <textarea
                value={newsItem.description || ''}
                onChange={(e) => handleNewsChange(index, 'description', e.target.value)}
                className="form-textarea"
                rows={3}
                placeholder="Краткое описание новости"
              />
            </div>

            <div className="form-group">
              <label>Изображение:</label>
              <div className="image-input-group">
                <input
                  type="text"
                  value={newsItem.image || ''}
                  onChange={(e) => handleNewsChange(index, 'image', e.target.value)}
                  className="form-input"
                  placeholder="Путь к изображению или загрузите файл"
                />
                <div className="image-upload-section">
                  <input
                    type="file"
                    id={`news-image-${index}`}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, e.target.files[0])}
                    className="file-input"
                    disabled={uploading[index]}
                  />
                  <label
                    htmlFor={`news-image-${index}`}
                    className={`file-input-label ${uploading[index] ? 'uploading' : ''}`}
                  >
                    {uploading[index] ? 'Загружается...' : 'Выбрать файл'}
                  </label>
                </div>
              </div>
              {newsItem.image && (
                <div className="image-preview">
                  <img
                    src={newsItem.image}
                    alt="Preview"
                    className="preview-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleNewsChange(index, 'image', '')}
                    className="remove-image-btn"
                  >
                    ✕ 
                  </button>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Описание:</label>
              <Editor
                apiKey="vkcmcx49iuev9aqstqk1ab9q30dlj8x8je5ak45gx8tqid1s"
                value={newsItem.description || ''}
                onEditorChange={(content) => handleNewsChange(index, 'description', content)}
                init={{
                  height: 200,
                  menubar: false,
                  plugins: [
                    'lists', 'link', 'charmap', 'anchor', 'searchreplace',
                    'visualblocks', 'code', 'insertdatetime', 'preview', 'help'
                  ],
                  toolbar: 'undo redo | bold italic forecolor | ' +
                    'alignleft aligncenter alignright | bullist numlist | link',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                  language: currentLanguage === 'ru' ? 'ru' : 'en'
                }}
              />
            </div>
          </div>
        </div>
      ))}

      {news.length === 0 && (
        <div className="no-news">
          <p>Новости не добавлены</p>
          <button type="button" onClick={addNews} className="btn btn-primary">
            Добавить первую новость
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsEditor;