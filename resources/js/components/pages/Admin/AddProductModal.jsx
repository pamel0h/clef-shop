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
    images: [],
    specs: [{ key: '', value: '' }], // Инициализация specs
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      images: Array.from(e.target.files),
    }));
  };

  const handleSpecChange = (index, field, value) => {
    setFormData(prev => {
      const newSpecs = [...prev.specs];
      newSpecs[index] = { ...newSpecs[index], [field]: value };
      return { ...prev, specs: newSpecs };
    });
  };

  const addSpecField = (e) => {
    e.preventDefault(); // Предотвращаем отправку формы
    setFormData(prev => ({
      ...prev,
      specs: [...prev.specs, { key: '', value: '' }],
    }));
  };

  const removeSpecField = (index, e) => {
    e.preventDefault(); // Предотвращаем отправку формы
    setFormData(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();

      // Добавляем текстовые поля
      Object.keys(formData).forEach(key => {
        if (key !== 'images' && key !== 'specs' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Преобразуем specs в объект, исключая пустые пары
      const specsObject = formData.specs.reduce((obj, spec) => {
        if (spec.key.trim() && spec.value.trim()) {
          obj[spec.key.trim()] = spec.value.trim();
        }
        return obj;
      }, {});

      // Проверяем, есть ли характеристики для отправки
      if (Object.keys(specsObject).length > 0) {
        // Отправляем как specs_data вместо specs, чтобы избежать конфликтов
        formDataToSend.append('specs_data', JSON.stringify(specsObject));
        console.log('Specs to send:', JSON.stringify(specsObject));
      } else {
        console.log('No specs to send - all fields are empty');
      }

      // Добавляем изображения
      if (formData.images.length > 0) {
        formData.images.forEach((image, index) => {
          formDataToSend.append('images[]', image);
        });
      }

      // Отладка: выводим содержимое FormData
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value instanceof File ? `File: ${value.name}` : value}`);
      }

      const response = await fetch('/api/admin/catalog', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      const result = await response.json();
      console.log('Response from server:', result);

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
          images: [],
          specs: [{ key: '', value: '' }],
        });

        if (onProductAdded) {
          onProductAdded(result.data);
        }

        onClose();
      } else {
        setError(result.error || 'Ошибка при добавлении товара');
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
          <h2>{t('admin.catalog.add')}</h2>
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

          <div className="form-group">
            <label>Характеристики</label>
            {formData.specs.map((spec, index) => (
              <div className="spec-row" key={index}>
                <input
                  type="text"
                  placeholder="Название характеристики (например, material)"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Значение (например, Nylon)"
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

          <div className="modal-actions">
            <Button type="button" onClick={onClose} className="cancel-button">
              {t('admin.catalog.cancel')}
            </Button>
            <Button type="submit" disabled={loading} className="submit-button">
              {t('admin.catalog.add')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;