import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

const BannerEditor = ({ banners, onChange, currentLanguage }) => {
  const [uploading, setUploading] = useState({});

  const handleBannerChange = (index, field, value) => {
    const updatedBanners = [...banners];
    updatedBanners[index] = {
      ...updatedBanners[index],
      [field]: value,
    };
    onChange(updatedBanners);
  };

  const addBanner = () => {
    if (banners.length >= 4) {
      alert('Нельзя добавить больше 4 баннеров');
      return;
    }
    const newBanner = {
      id: Date.now(),
      variant: 'line',
      title: '',
      content: '',
      image: '',
      visible: true,
    };
    onChange([...banners, newBanner]);
  };

  const removeBanner = (index) => {
    const updatedBanners = banners.filter((_, i) => i !== index);
    onChange(updatedBanners);
  };

  const toggleBannerVisibility = (index) => {
    const updatedBanners = [...banners];
    updatedBanners[index] = {
      ...updatedBanners[index],
      visible: !updatedBanners[index].visible,
    };
    onChange(updatedBanners);
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
      formData.append('folder', 'banners');

      const token = localStorage.getItem('auth_token');
      const response = await axios.post('/api/admin/upload-image', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        handleBannerChange(index, 'image', response.data.path);
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
    <div className="banner-editor">
      <div className="banner-editor-header">
        <h3>Управление баннерами ({banners.length}/4)</h3>
        <button type="button" onClick={addBanner} className="btn btn-small" disabled={banners.length >= 4}>
          + Добавить баннер
        </button>
      </div>
      {banners.map((banner, index) => (
        <div key={banner.id} className="banner-item">
          <div className="banner-item-header">
            <h4>Баннер #{index + 1}</h4>
            <div className="banner-controls">
              <button
                type="button"
                onClick={() => toggleBannerVisibility(index)}
                className={`btn btn-small ${banner.visible ? 'btn-secondary' : 'btn-success'}`}
              >
                {banner.visible ? 'Скрыть' : 'Показать'}
              </button>
              <button
                type="button"
                onClick={() => removeBanner(index)}
                className="btn btn-danger btn-small"
              >
                Удалить
              </button>
            </div>
          </div>

          <div className="banner-fields">
            <div className="form-group">
              <label>Тип баннера:</label>
              <select
                value={banner.variant || 'line'}
                onChange={(e) => handleBannerChange(index, 'variant', e.target.value)}
                className="form-input"
              >
                <option value="line">Линейный (с кнопкой)</option>
                <option value="main">Главный</option>
                <option value="mini">Мини</option>
              </select>
            </div>

            <div className="form-group">
              <label>Заголовок:</label>
              <input
                type="text"
                value={banner.title || ''}
                onChange={(e) => handleBannerChange(index, 'title', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Изображение:</label>
              <div className="image-input-group">
                <input
                  type="text"
                  value={banner.image || ''}
                  onChange={(e) => handleBannerChange(index, 'image', e.target.value)}
                  className="form-input"
                  placeholder="Путь к изображению или загрузите файл"
                />
                <div className="image-upload-section">
                  <input
                    type="file"
                    id={`banner-image-${index}`}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, e.target.files[0])}
                    className="file-input"
                    disabled={uploading[index]}
                  />
                  <label
                    htmlFor={`banner-image-${index}`}
                    className={`file-input-label ${uploading[index] ? 'uploading' : ''}`}
                  >
                    {uploading[index] ? 'Загружается...' : 'Выбрать файл'}
                  </label>
                </div>
              </div>
              {banner.image && (
                <div className="image-preview">
                  <img
                    src={banner.image}
                    alt="Preview"
                    className="preview-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleBannerChange(index, 'image', '')}
                    className="remove-image-btn"
                  >
                    ✕ Удалить
                  </button>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Содержимое:</label>
              <Editor
                apiKey="vkcmcx49iuev9aqstqk1ab9q30dlj8x8je5ak45gx8tqid1s"
                value={banner.content || ''}
                onEditorChange={(content) => handleBannerChange(index, 'content', content)}
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

      {banners.length === 0 && (
        <div className="no-banners">
          <p>Баннеры не добавлены</p>
          <button type="button" onClick={addBanner} className="btn btn-primary">
            Добавить первый баннер
          </button>
        </div>
      )}
    </div>
  );
};

export default BannerEditor;