import React, { useState } from 'react';
import axios from 'axios';
import '../../../../css/components/BrandEditor.css'; // Создай этот файл для стилей

const BrandEditor = ({ brands, onChange, currentLanguage }) => {
  const [uploading, setUploading] = useState({});

  const handleBrandChange = (index, field, value) => {
    const updatedBrands = [...brands];
    updatedBrands[index] = {
      ...updatedBrands[index],
      [field]: value,
    };
    onChange(updatedBrands);
  };

  const addBrand = () => {
    if (brands.length >= 10) { // Ограничение на максимум 10 брендов
      alert('Нельзя добавить больше 10 брендов');
      return;
    }
    const newBrand = {
      id: Date.now(),
      image: '',
    };
    onChange([...brands, newBrand]);
  };

  const removeBrand = (index) => {
    const updatedBrands = brands.filter((_, i) => i !== index);
    onChange(updatedBrands);
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
      formData.append('folder', 'brands');

      const token = localStorage.getItem('auth_token');
      const response = await axios.post('/api/admin/upload-image', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        handleBrandChange(index, 'image', response.data.path);
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
    <div className="brand-editor">
      <div className="brand-editor-header">
        <h3>Управление брендами ({brands.length}/10)</h3>
        <button type="button" onClick={addBrand} className="btn btn-small" disabled={brands.length >= 10}>
          + Добавить бренд
        </button>
      </div>
      {brands.map((brand, index) => (
        <div key={brand.id} className="brand-item">
          <div className="brand-item-header">
            <h4>Бренд #{index + 1}</h4>
            <div className="brand-controls">
              <button
                type="button"
                onClick={() => removeBrand(index)}
                className="btn btn-danger btn-small"
              >
                Удалить
              </button>
            </div>
          </div>

          <div className="brand-fields">
            <div className="form-group">
              <label>Изображение:</label>
              <div className="image-input-group">
                <input
                  type="text"
                  value={brand.image || ''}
                  onChange={(e) => handleBrandChange(index, 'image', e.target.value)}
                  className="form-input"
                  placeholder="Путь к изображению или загрузите файл"
                />
                <div className="image-upload-section">
                  <input
                    type="file"
                    id={`brand-image-${index}`}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, e.target.files[0])}
                    className="file-input"
                    disabled={uploading[index]}
                  />
                  <label
                    htmlFor={`brand-image-${index}`}
                    className={`file-input-label ${uploading[index] ? 'uploading' : ''}`}
                  >
                    {uploading[index] ? 'Загружается...' : 'Выбрать файл'}
                  </label>
                </div>
              </div>
              {brand.image && (
                <div className="image-preview">
                  <img
                    src={brand.image}
                    alt="Preview"
                    className="preview-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleBrandChange(index, 'image', '')}
                    className="remove-image-btn"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {brands.length === 0 && (
        <div className="no-brands">
          <p>Бренды не добавлены</p>
          <button type="button" onClick={addBrand} className="btn btn-primary">
            Добавить первый бренд
          </button>
        </div>
      )}
    </div>
  );
};

export default BrandEditor;