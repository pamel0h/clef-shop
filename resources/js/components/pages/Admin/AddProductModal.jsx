import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../UI/Button';
import useCatalogData from '../../../hooks/useCatalogData';
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
    image: null,
    specs: [{ key: '', value: '', isNewSpec: false, newSpec: { slug: '', ru: '', en: '' } }],
    newCategory: { slug: '', ru: '', en: '' },
    newSubcategory: { slug: '', ru: '', en: '' },
    newBrand: { slug: '', ru: '', en: '' },
  });
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isNewCategoryAndSubcategory, setIsNewCategoryAndSubcategory] = useState(false);
  const [isNewBrand, setIsNewBrand] = useState(false);

  // Fetch data
  const { data: categories, loading: categoriesLoading } = useCatalogData('categories');
  const { data: subcategories, loading: subcategoriesLoading } = useCatalogData('subcategories', { category: formData.category }, !formData.category);
  const { data: brands, loading: brandsLoading } = useCatalogData('brands');
  const { data: specKeys, loading: specKeysLoading } = useCatalogData('spec_keys');
  const [translatedSpecKeys, setTranslatedSpecKeys] = useState({});

  // Initialize/update translated keys
  useEffect(() => {
    const translatedKeys = {};
    specKeys.forEach(key => {
      translatedKeys[key] = t(`specs.${key}`);
    });
    setTranslatedSpecKeys(translatedKeys);
  }, [specKeys, t]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      newCategory: { ...prev.newCategory, [name]: value },
    }));
  };

  const handleNewSubcategoryChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      newSubcategory: { ...prev.newSubcategory, [name]: value },
    }));
  };

  const handleNewBrandChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      newBrand: { ...prev.newBrand, [name]: value },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        image: null,
      }));
      setImagePreview('');
    }
  };

  const handleSpecChange = (index, field, value) => {
    setFormData((prev) => {
      const newSpecs = [...prev.specs];
      newSpecs[index] = { ...newSpecs[index], [field]: value };
      return { ...prev, specs: newSpecs };
    });
  };

  const handleNewSpecChange = (index, field, value) => {
    setFormData((prev) => {
      const newSpecs = [...prev.specs];
      newSpecs[index] = {
        ...newSpecs[index],
        newSpec: { ...newSpecs[index].newSpec, [field]: value },
      };
      return { ...prev, specs: newSpecs };
    });
  };

  const handleSpecCheckboxChange = (index) => {
    setFormData((prev) => {
      const newSpecs = [...prev.specs];
      newSpecs[index] = {
        ...newSpecs[index],
        isNewSpec: !newSpecs[index].isNewSpec,
        key: newSpecs[index].isNewSpec ? '' : newSpecs[index].key,
        newSpec: newSpecs[index].isNewSpec
          ? { slug: '', ru: '', en: '' }
          : newSpecs[index].newSpec,
      };
      return { ...prev, specs: newSpecs };
    });
  };

  const getSpecLabel = (key) => {
    return translatedSpecKeys[key] || key;
  };

  const getFilteredSpecKeys = (searchTerm) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return specKeys.filter(key => {
      const translatedKey = translatedSpecKeys[key] || key;
      return (
        key.toLowerCase().includes(lowercasedSearchTerm) ||
        translatedKey.toLowerCase().includes(lowercasedSearchTerm)
      );
    });
  };

  const addSpecField = (e) => {
    e.preventDefault();
    setFormData((prev) => ({
      ...prev,
      specs: [...prev.specs, { key: '', value: '', isNewSpec: false, newSpec: { slug: '', ru: '', en: '' } }],
    }));
  };

  const removeSpecField = (index, e) => {
    e.preventDefault();
    setFormData((prev) => ({
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
    const authToken = localStorage.getItem('auth_token') || localStorage.getItem('token');

    // Заполнение FormData
    Object.keys(formData).forEach((key) => {
      if (key === 'image' || key === 'specs' || key === 'newCategory' || key === 'newSubcategory' || key === 'newBrand') {
        return;
      }
      if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Обработка характеристик
    const specsObject = formData.specs.reduce((obj, spec) => {
      if (spec.isNewSpec && spec.newSpec.slug.trim() && spec.value.trim()) {
        obj[spec.newSpec.slug.trim()] = {
          value: spec.value.trim(),
          translations: { ru: spec.newSpec.ru, en: spec.newSpec.en }
        };
      } else if (spec.key.trim() && spec.value.trim()) {
        obj[spec.key.trim()] = spec.value.trim();
      }
      return obj;
    }, {});
    if (Object.keys(specsObject).length > 0) {
      formDataToSend.append('specs_data', JSON.stringify(specsObject));
    }

    // Обработка изображения
    if (formData.image) {
      formDataToSend.append('images[]', formData.image);
    }

    // Обработка новых категорий и подкатегорий
    if (isNewCategoryAndSubcategory) {
      if (formData.newCategory.slug) {
        formDataToSend.append('category', formData.newCategory.slug);
        formDataToSend.append('new_category', JSON.stringify(formData.newCategory));
      }
      if (formData.newSubcategory.slug) {
        formDataToSend.append('subcategory', formData.newSubcategory.slug);
        formDataToSend.append('new_subcategory', JSON.stringify(formData.newSubcategory));
      }
    }

    // Обработка нового бренда
    if (isNewBrand && formData.newBrand.slug) {
      formDataToSend.append('brand', formData.newBrand.slug);
      formDataToSend.append('new_brand', JSON.stringify(formData.newBrand));
    }

    const response = await fetch('/api/admin/catalog', {
      method: 'POST',
      body: formDataToSend,
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const result = await response.json();
    console.log('Response from server:', result);

    if (result.success) {
      setFormData({
        name: '',
        description_en: '',
        description_ru: '',
        price: '',
        category: '',
        subcategory: '',
        brand: '',
        discount: '',
        image: null,
        specs: [{ key: '', value: '', isNewSpec: false, newSpec: { slug: '', ru: '', en: '' } }],
        newCategory: { slug: '', ru: '', en: '' },
        newSubcategory: { slug: '', ru: '', en: '' },
        newBrand: { slug: '', ru: '', en: '' },
      });
      setImagePreview('');
      setIsNewCategoryAndSubcategory(false);
      setIsNewBrand(false);
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('admin.catalog.add')}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
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
              {isNewCategoryAndSubcategory ? (
                <>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Новая категория:</strong>
                  </div>
                  <input
                    type="text"
                    name="slug"
                    placeholder="Название для базы данных (catcat)"
                    value={formData.newCategory.slug}
                    onChange={handleNewCategoryChange}
                    required
                    style={{ marginBottom: '8px' }}
                  />
                  <input
                    type="text"
                    name="ru"
                    placeholder="Название на русском"
                    value={formData.newCategory.ru}
                    onChange={handleNewCategoryChange}
                    required
                    style={{ marginBottom: '8px' }}
                  />
                  <input
                    type="text"
                    name="en"
                    placeholder="Название на английском"
                    value={formData.newCategory.en}
                    onChange={handleNewCategoryChange}
                    required
                  />
                </>
              ) : (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  disabled={categoriesLoading}
                >
                  <option value="">{categoriesLoading ? 'Загрузка...' : 'Выберите категорию'}</option>
                  {categories?.map((category) => (
                    <option key={category} value={category}>
                      {t(`category.${category}`)}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="form-group">
              <label>Подкатегория *</label>
              {isNewCategoryAndSubcategory ? (
                <>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Новая подкатегория:</strong>
                  </div>
                  <input
                    type="text"
                    name="slug"
                    placeholder="Название для базы данных (subcat)"
                    value={formData.newSubcategory.slug}
                    onChange={handleNewSubcategoryChange}
                    required
                    style={{ marginBottom: '8px' }}
                  />
                  <input
                    type="text"
                    name="ru"
                    placeholder="Название на русском"
                    value={formData.newSubcategory.ru}
                    onChange={handleNewSubcategoryChange}
                    required
                    style={{ marginBottom: '8px' }}
                  />
                  <input
                    type="text"
                    name="en"
                    placeholder="Название на английском"
                    value={formData.newSubcategory.en}
                    onChange={handleNewSubcategoryChange}
                    required
                  />
                </>
              ) : (
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  required
                  disabled={subcategoriesLoading || !formData.category}
                >
                  <option value="">{subcategoriesLoading ? 'Загрузка...' : 'Выберите подкатегорию'}</option>
                  {subcategories?.map((subcategory) => (
                    <option key={subcategory} value={subcategory}>
                      {t(`subcategory.${formData.category}.${subcategory}`)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <label style={{ marginBottom: '20px', display: 'block' }}>
            <input
              type="checkbox"
              checked={isNewCategoryAndSubcategory}
              onChange={() => setIsNewCategoryAndSubcategory(!isNewCategoryAndSubcategory)}
            />
            Добавить новую категорию и подкатегорию
          </label>

          <div className="form-group">
            <label>Бренд</label>
            {isNewBrand ? (
              <>
                <input
                  type="text"
                  name="slug"
                  placeholder="Название для базы данных (nike)"
                  value={formData.newBrand.slug}
                  onChange={handleNewBrandChange}
                  required
                  style={{ marginBottom: '8px' }}
                />
                <input
                  type="text"
                  name="ru"
                  placeholder="Название на русском"
                  value={formData.newBrand.ru}
                  onChange={handleNewBrandChange}
                  required
                  style={{ marginBottom: '8px' }}
                />
                <input
                  type="text"
                  name="en"
                  placeholder="Название на английском"
                  value={formData.newBrand.en}
                  onChange={handleNewBrandChange}
                  required
                />
              </>
            ) : (
              <select
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                disabled={brandsLoading}
              >
                <option value="">{brandsLoading ? 'Загрузка...' : 'Выберите бренд'}</option>
                {brands?.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            )}
          </div>
          <label style={{ marginBottom: '20px', display: 'block' }}>
            <input
              type="checkbox"
              checked={isNewBrand}
              onChange={() => setIsNewBrand(!isNewBrand)}
            />
            Добавить новый бренд
          </label>

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
            {imagePreview && (
              <div className="image-preview" style={{ marginBottom: '10px' }}>
                <p>Превью изображения:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
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
          </div>

          <div className="form-group">
            <label>{t('specs.mainTitle')}</label>
            {formData.specs.map((spec, index) => (
              <div className="spec-row" key={index}>
                {spec.isNewSpec ? (
                  <>
                    <div style={{ marginBottom: '10px' }}>
                      <strong>Новая характеристика:</strong>
                    </div>
                    <input
                      type="text"
                      name="slug"
                      placeholder="Название для базы данных (spec_key)"
                      value={spec.newSpec.slug}
                      onChange={(e) => handleNewSpecChange(index, 'slug', e.target.value)}
                      required
                      style={{ marginBottom: '8px' }}
                    />
                    <input
                      type="text"
                      name="ru"
                      placeholder="Название на русском"
                      value={spec.newSpec.ru}
                      onChange={(e) => handleNewSpecChange(index, 'ru', e.target.value)}
                      required
                      style={{ marginBottom: '8px' }}
                    />
                    <input
                      type="text"
                      name="en"
                      placeholder="Название на английском"
                      value={spec.newSpec.en}
                      onChange={(e) => handleNewSpecChange(index, 'en', e.target.value)}
                      required
                      style={{ marginBottom: '8px' }}
                    />
                  </>
                ) : (
                  <input
                    type="text"
                    placeholder="Название характеристики"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                    list={`spec-keys-${index}`}
                  />
                )}
                {!spec.isNewSpec && (
                  <datalist id={`spec-keys-${index}`}>
                    {getFilteredSpecKeys(spec.key).map(key => (
                      <option key={key} value={key}>
                        {getSpecLabel(key)}
                      </option>
                    ))}
                  </datalist>
                )}
                <input
                  type="text"
                  placeholder="Значение"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                />
                                <label style={{ marginTop: '10px', display: 'block' }}>
                  <input
                    type="checkbox"
                    checked={spec.isNewSpec}
                    onChange={() => handleSpecCheckboxChange(index)}
                  />
                  Добавить новую характеристику
                </label>
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
              {loading ? 'Добавление...' : t('admin.catalog.add')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;