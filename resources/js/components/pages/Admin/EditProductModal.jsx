import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../UI/Button';
import '../../../../css/components/AddProductModal.css';

const EditProductModal = ({ isOpen, onClose, onSubmit, product }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description_en: '',
    description_ru: '',
    price: '',
    category: '',
    subcategory: '',
    brand: '',
    discount: '',
    image: null, 
    specs: [{ key: '', value: '' }]
  });
  const [currentImageUrl, setCurrentImageUrl] = useState(''); // Для отображения текущего изображения
  const [newImagePreview, setNewImagePreview] = useState(''); // Для превью нового изображения
  const [specKeys, setSpecKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // показываем текущие данные
  useEffect(() => {
    if (isOpen && product) {
      console.log('Product data:', product);
      setFormData({
        id: product.id || '',
        name: product.name || '',
        description_en: product.description?.en || '',
        description_ru: product.description?.ru || '',
        price: product.price || '',
        category: product.category || '',
        subcategory: product.subcategory || '',
        brand: product.brand || '',
        discount: product.discount || '',
        image: null,
        specs: product.specs
          ? Object.entries(product.specs).map(([key, value]) => ({ key, value }))
          : [{ key: '', value: '' }]
      });
      
      // Устанавливаем текущее изображение
      if (product.image) {
        setCurrentImageUrl(product.image);
      }
      setNewImagePreview(''); // Сбрасываем превью нового изображения
      fetchSpecKeys();
    }
  }, [isOpen, product]);

  const fetchSpecKeys = async () => {
    try {
      const response = await fetch('/api/admin/catalog/spec-keys');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setSpecKeys(data.data);
      }
    } catch (error) {
      console.error('Error fetching spec keys:', error);
      setSpecKeys([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; 
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Создаем превью нового изображения
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        image: null
      }));
      setNewImagePreview('');
    }
  };

  const handleSpecChange = (index, field, value) => {
    setFormData(prev => {
      const newSpecs = [...prev.specs];
      newSpecs[index] = { ...newSpecs[index], [field]: value };
      return { ...prev, specs: newSpecs };
    });
  };

  const addSpecField = (e) => {
    e.preventDefault();
    setFormData(prev => ({
      ...prev,
      specs: [...prev.specs, { key: '', value: '' }]
    }));
  };

  const removeSpecField = (index, e) => {
    e.preventDefault();
    setFormData(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index)
    }));
  };

  const getCSRFToken = () => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute('content') : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Добавляем _method для имитации PUT запроса
      formDataToSend.append('_method', 'PUT');
      
      // Добавляем текстовые поля
      Object.keys(formData).forEach(key => {
        if (key !== 'image' && key !== 'specs' && key !== 'id' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Добавляем изображение, если выбрано новое
      if (formData.image) {
        formDataToSend.append('images[]', formData.image);
      }

      // Добавляем только заполненные характеристики
      const validSpecs = formData.specs.filter(spec => spec.key.trim() && spec.value.trim());
      validSpecs.forEach((spec, index) => {
        formDataToSend.append(`specs[${index}][key]`, spec.key.trim());
        formDataToSend.append(`specs[${index}][value]`, spec.value.trim());
      });

      // Отладка: выводим содержимое FormData
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value instanceof File ? `File: ${value.name}` : value}`);
      }

      const csrfToken = getCSRFToken();
      
      const response = await fetch(`/api/admin/catalog/${formData.id}`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken })
        }
      });

      const result = await response.json();
      console.log('Response from server:', result);

      if (result.success) {
        // Сбрасываем форму
        setFormData({
          id: '',
          name: '',
          description_en: '',
          description_ru: '',
          price: '',
          category: '',
          subcategory: '',
          brand: '',
          discount: '',
          image: null,
          specs: [{ key: '', value: '' }]
        });
        setCurrentImageUrl('');
        setNewImagePreview('');

        if (onSubmit) {
          await onSubmit();
        }
        onClose();
      } else {
        setError(result.error || 'Ошибка при обновлении товара');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Ошибка сети: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Изменить товар</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="add-product-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Название товара *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Цена *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label>Скидка (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Категория *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Подкатегория *</label>
              <input
                type="text"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Бренд</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Описание (EN)</label>
            <textarea
              name="description_en"
              value={formData.description_en}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Описание (RU)</label>
            <textarea
              name="description_ru"
              value={formData.description_ru}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Изображение</label>
            
            {/* Показываем текущее изображение или превью нового */}
            {(newImagePreview || currentImageUrl) && (
              <div className="current-image-preview" style={{ marginBottom: '10px' }}>
                <p>{newImagePreview ? 'Новое изображение:' : 'Текущее изображение:'}</p>
                <img 
                  src={newImagePreview || currentImageUrl} 
                  alt="Product" 
                  style={{ 
                    width: '150px', 
                    height: '150px', 
                    objectFit: 'cover', 
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }} 
                />
              </div>
            )}
            
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              Оставьте пустым, чтобы сохранить текущее изображение
            </small>
          </div>

          <div className="form-group">
            <label>Характеристики</label>
            {formData.specs.map((spec, index) => (
              <div className="spec-row" key={index}>
                <input
                  type="text"
                  placeholder="Название характеристики"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                  list="spec-keys"
                />
                <input
                  type="text"
                  placeholder="Значение"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                />
                <button
                  type="button"
                  onClick={(e) => removeSpecField(index, e)}
                  className="remove-spec-button"
                  disabled={formData.specs.length === 1}
                >
                  −
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSpecField}
              className="add-spec-button"
            >
              + Добавить характеристику
            </button>
          </div>

          <datalist id="spec-keys">
            {specKeys.map(key => (
              <option key={key} value={key} />
            ))}
          </datalist>

          <div className="modal-actions">
            <Button type="button" onClick={onClose} className="cancel-button">
              Отмена
            </Button>
            <Button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;