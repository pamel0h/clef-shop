import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../UI/Button';
import Modal from '../../UI/Modal';

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
    images: [],
    specs: [{ key: '', value: '' }]
  });
  const [specKeys, setSpecKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize form with product data when modal opens
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
        images: [], // Images are not pre-filled in the file input
        specs: product.specs
          ? Object.entries(product.specs).map(([key, value]) => ({ key, value }))
          : [{ key: '', value: '' }]
      });
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
    setFormData(prev => ({
      ...prev,
      images: Array.from(e.target.files)
    }));
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specs];
    newSpecs[index][field] = value;
    setFormData(prev => ({
      ...prev,
      specs: newSpecs
    }));
  };

  const addSpec = () => {
    setFormData(prev => ({
      ...prev,
      specs: [...prev.specs, { key: '', value: '' }]
    }));
  };

  const removeSpec = (index) => {
    if (formData.specs.length > 1) {
      const newSpecs = formData.specs.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        specs: newSpecs
      }));
    }
  };

  const getCSRFToken = () => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute('content') : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category || !formData.subcategory) {
      alert(t('admin.catalog.fillRequiredFields'));
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Добавляем _method для имитации PUT запроса
      submitData.append('_method', 'PUT');
      
      Object.keys(formData).forEach(key => {
        if (key !== 'images' && key !== 'specs' && key !== 'id') {
          submitData.append(key, formData[key]);
        }
      });

      // Добавляем изображения, если они есть
      if (formData.images.length > 0) {
        formData.images.forEach((image, index) => {
          submitData.append(`images[${index}]`, image);
        });
      }

      // Добавляем только заполненные характеристики
      const validSpecs = formData.specs.filter(spec => spec.key.trim() && spec.value.trim());
      validSpecs.forEach((spec, index) => {
        submitData.append(`specs[${index}][key]`, spec.key.trim());
        submitData.append(`specs[${index}][value]`, spec.value.trim());
      });

      const csrfToken = getCSRFToken();
      
      // Используем POST с _method=PUT для совместимости с FormData
      const response = await fetch(`/api/admin/catalog/${formData.id}`, {
        method: 'POST',
        body: submitData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken })
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        await onSubmit();
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
          images: [],
          specs: [{ key: '', value: '' }]
        });
        onClose();
      } else {
        throw new Error(data.error || t('admin.catalog.failedToUpdate'));
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(t('admin.catalog.errorUpdating') + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('admin.catalog.editProduct')}>
      <form onSubmit={handleSubmit} className="edit-product-form">
        <div className="form-group">
          <label>{t('admin.catalog.name')} *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>{t('admin.catalog.descriptionEn')}</label>
          <textarea
            name="description_en"
            value={formData.description_en}
            onChange={handleInputChange}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>{t('admin.catalog.descriptionRu')}</label>
          <textarea
            name="description_ru"
            value={formData.description_ru}
            onChange={handleInputChange}
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{t('admin.catalog.price')} *</label>
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
            <label>{t('admin.catalog.discount')}</label>
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
            <label>{t('admin.catalog.category')} *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t('admin.catalog.subcategory')} *</label>
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
          <label>{t('admin.catalog.brand')}</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>{t('admin.catalog.image')}</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          {product?.images?.length > 0 && (
            <div className="existing-images">
              <p>{t('admin.catalog.existingImages')}:</p>
              {product.image_urls?.map((url, index) => (
                <img key={index} src={url} alt={`Product ${index}`} style={{ width: '100px', margin: '5px' }} />
              ))}
            </div>
          )}
        </div>

        <div className="specs-section">
          <label>{t('admin.catalog.specs')}</label>
          {formData.specs.map((spec, index) => (
            <div key={index} className="spec-row">
              <input
                type="text"
                placeholder={t('admin.catalog.specKey')}
                value={spec.key}
                onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                list="spec-keys"
              />
              <input
                type="text"
                placeholder={t('admin.catalog.specValue')}
                value={spec.value}
                onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
              />
              {formData.specs.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeSpec(index)}
                  className="remove-spec-btn"
                >
                  ×
                </Button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSpec}
            className="add-spec-btn"
          >
            + {t('admin.catalog.addSpec')}
          </button>
        </div>

        <datalist id="spec-keys">
          {specKeys.map(key => (
            <option key={key} value={key} />
          ))}
        </datalist>

        <div className="form-actions">
          <Button type="button" onClick={onClose} className="cancel-btn">
            {t('admin.catalog.cancel')}
          </Button>
          <Button type="submit" disabled={loading} className="submit-btn">
            {loading ? t('Loading') : t('admin.catalog.edit')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProductModal;