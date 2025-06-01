import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../UI/Button';
import '../../../../css/components/AddProductModal.css';

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    description_en: '',
    description_ru: '',
    price: '',
    category: '',
    subcategory: '',
    brand: '',
    discount: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      images: Array.from(e.target.files)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Добавляем все текстовые поля
      Object.keys(formData).forEach(key => {
        if (key !== 'images' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Добавляем изображения
      if (formData.images.length > 0) {
        formData.images.forEach((image, index) => {
          formDataToSend.append('images[]', image);
        });
      }

      const response = await fetch('/api/admin/catalog', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          // НЕ добавляем Content-Type для FormData
        }
      });

      const result = await response.json();

      if (result.success) {
        // Сбрасываем форму
        setFormData({
          name: '',
          description_en: '',
          description_ru: '',
          price: '',
          category: '',
          subcategory: '',
          brand: '',
          discount: '',
          images: []
        });
        
        // Вызываем callback для обновления списка товаров
        if (onProductAdded) {
          onProductAdded(result.data);
        }
        
        onClose();
      } else {
        setError(result.error || 'Ошибка при добавлении товара');
      }
    } catch (err) {
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
          <h2>{t('admin.catalog.addProduct')}</h2>
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
            <label>Изображения</label>
            <input
              type="file"
              name="images"
              onChange={handleFileChange}
              multiple
              accept="image/*"
            />
          </div>

          <div className="modal-actions">
            <Button type="button" onClick={onClose} className="cancel-button">
              Отмена
            </Button>
            <Button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Добавление...' : 'Добавить товар'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;