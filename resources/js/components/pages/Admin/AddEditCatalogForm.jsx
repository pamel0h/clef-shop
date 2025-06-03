import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useCatalogData from '../../../hooks/useCatalogData';
import Button from '../../UI/Button';
import '../../../../css/components/AddProductModal.css';

const AddEditCatalogForm = ({ isOpen, onClose, onSubmit, initialData, title }) => {
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
    specs: [{ key: '', value: '', isNewSpec: false, newSpec: { slug: '', ru: '', en: '' } }],
    isNewCategory: false,
    newCategory: { slug: '', ru: '', en: '' },
    isNewSubcategory: false,
    newSubcategory: { slug: '', ru: '', en: '' },
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [translatedSpecKeys, setTranslatedSpecKeys] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data: categories, loading: categoriesLoading } = useCatalogData('categories');
  const { data: subcategories, loading: subcategoriesLoading } = useCatalogData('subcategories', { category: selectedCategory }, !selectedCategory);
  const { data: brands, loading: brandsLoading } = useCatalogData('brands');
  const { data: specKeysValues, loading: specKeysValuesLoading } = useCatalogData('spec_keys_values');

  useEffect(() => {
    if (initialData) {
      // Устанавливаем selectedCategory ПЕРЕД установкой formData
      setSelectedCategory(initialData.category || '');
      
      setFormData({
        id: initialData.id || '',
        name: initialData.name || '',
        description_en: initialData.description?.en || '',
        description_ru: initialData.description?.ru || '',
        price: initialData.price || '',
        category: initialData.category || '',
        subcategory: initialData.subcategory || '',
        brand: initialData.brand || '',
        discount: initialData.discount || '',
        images: [],
        specs: initialData.specs
          ? Object.entries(initialData.specs).map(([key, value]) => ({
              key,
              value: String(value),
              isNewSpec: false,
              newSpec: { slug: '', ru: '', en: '' },
            }))
          : [{ key: '', value: '', isNewSpec: false, newSpec: { slug: '', ru: '', en: '' } }],
        isNewCategory: false,
        newCategory: { slug: '', ru: '', en: '' },
        isNewSubcategory: false,
        newSubcategory: { slug: '', ru: '', en: '' },
      });
      
      // Устанавливаем превью изображений из базы данных
      if (initialData.images && initialData.images.length > 0) {
        const imagePaths = initialData.images.map(img => `/storage/product_images/${img}`);
        setImagePreviews(imagePaths);
      } else {
        setImagePreviews([]);
      }
    } else {
      // Сброс для нового товара
      setSelectedCategory('');
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
        specs: [{ key: '', value: '', isNewSpec: false, newSpec: { slug: '', ru: '', en: '' } }],
        isNewCategory: false,
        newCategory: { slug: '', ru: '', en: '' },
        isNewSubcategory: false,
        newSubcategory: { slug: '', ru: '', en: '' },
      });
      setImagePreviews([]);
    }
  }, [initialData]);

  useEffect(() => {
    if (!formData.isNewCategory && formData.category) {
      console.log('Fetching subcategories for category:', formData.category);
    }
  }, [formData.category, formData.isNewCategory]);

  useEffect(() => {
    const translatedKeys = {};
    if (specKeysValues && Object.keys(specKeysValues).length > 0) {
      Object.keys(specKeysValues).forEach((key) => {
        translatedKeys[key] = t(`specs.${key}`, key);
      });
    }
    setTranslatedSpecKeys(translatedKeys);
  }, [specKeysValues, t]);

  const getFilteredSpecKeys = (searchTerm) => {
    if (!specKeysValues) return [];
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return Object.keys(specKeysValues).filter((key) => {
      const translatedKey = translatedSpecKeys[key] || key;
      return (
        key.toLowerCase().includes(lowercasedSearchTerm) ||
        translatedKey.toLowerCase().includes(lowercasedSearchTerm)
      );
    });
  };

  const getFilteredSpecValues = (key, searchTerm) => {
    if (!key || !specKeysValues[key]) return [];
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return specKeysValues[key].filter((value) =>
      String(value).toLowerCase().includes(lowercasedSearchTerm)
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setSelectedCategory(value);
      // Сбрасываем подкатегорию при смене категории
      setFormData((prev) => ({
        ...prev,
        category: value,
        subcategory: '', // Очищаем подкатегорию
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
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

  const handleCategoryCheckboxChange = () => {
    setFormData((prev) => ({
      ...prev,
      isNewCategory: !prev.isNewCategory,
      category: !prev.isNewCategory ? '' : prev.category,
      isNewSubcategory: !prev.isNewCategory ? false : prev.isNewSubcategory,
      subcategory: !prev.isNewCategory ? '' : prev.subcategory,
    }));
    
    // Сбрасываем selectedCategory если переключаемся на новую категорию
    if (!formData.isNewCategory) {
      setSelectedCategory('');
    }
  };

  const handleSubcategoryCheckboxChange = () => {
    setFormData((prev) => ({
      ...prev,
      isNewSubcategory: !prev.isNewSubcategory,
      subcategory: !prev.isNewSubcategory ? '' : prev.subcategory,
    }));
  };

  const handleSpecCheckboxChange = (index) => {
    setFormData((prev) => {
      const newSpecs = [...prev.specs];
      newSpecs[index] = {
        ...newSpecs[index],
        isNewSpec: !newSpecs[index].isNewSpec,
        key: newSpecs[index].isNewSpec ? '' : newSpecs[index].key,
        newSpec: newSpecs[index].isNewSpec ? { slug: '', ru: '', en: '' } : newSpecs[index].newSpec,
      };
      return { ...prev, specs: newSpecs };
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

      if (!authToken) {
        throw new Error(t('auth_token_missing'));
      }

      if (!formData.name || !formData.price || (!formData.isNewCategory && !formData.category) || (!formData.isNewSubcategory && !formData.subcategory)) {
        throw new Error(t('required_fields_missing'));
      }

      const fields = ['name', 'description_en', 'description_ru', 'price', 'discount', 'brand'];
      fields.forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (formData.isNewCategory && formData.newCategory.slug) {
        formDataToSend.append('category', formData.newCategory.slug);
        formDataToSend.append('new_category', JSON.stringify(formData.newCategory));
      } else {
        formDataToSend.append('category', formData.category);
      }

      if (formData.isNewSubcategory && formData.newSubcategory.slug) {
        formDataToSend.append('subcategory', formData.newSubcategory.slug);
        formDataToSend.append('new_subcategory', JSON.stringify(formData.newSubcategory));
      } else {
        formDataToSend.append('subcategory', formData.subcategory);
      }

      formData.images.forEach((image, index) => {
        formDataToSend.append(`images[${index}]`, image);
      });

      const specsObject = formData.specs.reduce((obj, spec, index) => {
        if (spec.isNewSpec && spec.newSpec.slug.trim() && spec.value.trim()) {
          obj[spec.newSpec.slug.trim()] = {
            value: spec.value.trim(),
            translations: { ru: spec.newSpec.ru, en: spec.newSpec.en },
          };
        } else if (spec.key.trim() && spec.value.trim()) {
          formDataToSend.append(`specs[${index}][key]`, spec.key.trim());
          formDataToSend.append(`specs[${index}][value]`, spec.value.trim());
        }
        return obj;
      }, {});
      
      if (Object.keys(specsObject).length > 0) {
        formDataToSend.append('specs_data', JSON.stringify(specsObject));
      }

      const url = initialData ? `/api/admin/catalog/${initialData.id}` : '/api/admin/catalog';
      const method = initialData ? 'POST' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
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
          images: [],
          specs: [{ key: '', value: '', isNewSpec: false, newSpec: { slug: '', ru: '', en: '' } }],
          isNewCategory: false,
          newCategory: { slug: '', ru: '', en: '' },
          isNewSubcategory: false,
          newSubcategory: { slug: '', ru: '', en: '' },
        });
        setImagePreviews([]);
        setSelectedCategory('');
        await onSubmit(result.data);
        onClose();
      } else {
        setError(result.error || t('submit_error'));
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(t('network_error', { message: err.message }));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="add-product-form">
          {error && <div className="error-message">{error}</div>}

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
              <label>{t('admin.catalog.discount')} (%)</label>
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
              <label style={{ marginBottom: '10px', display: 'block' }}>
                <input
                  type="checkbox"
                  checked={formData.isNewCategory}
                  onChange={handleCategoryCheckboxChange}
                />
                {t('admin.catalog.addNewCategory')}
              </label>
              {formData.isNewCategory ? (
                <>
                  <input
                    type="text"
                    name="slug"
                    placeholder={t('admin.catalog.categorySlugPlaceholder')}
                    value={formData.newCategory.slug}
                    onChange={handleNewCategoryChange}
                    required
                    style={{ marginBottom: '8px' }}
                  />
                  <input
                    type="text"
                    name="ru"
                    placeholder={t('admin.catalog.categoryRuPlaceholder')}
                    value={formData.newCategory.ru}
                    onChange={handleNewCategoryChange}
                    required
                    style={{ marginBottom: '8px' }}
                  />
                  <input
                    type="text"
                    name="en"
                    placeholder={t('admin.catalog.categoryEnPlaceholder')}
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
                  <option value="">{categoriesLoading ? t('loading') : t('admin.catalog.selectCategory')}</option>
                  {categories?.map((category) => (
                    <option key={category} value={category}>
                      {t(`category.${category}`)}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="form-group">
              <label>{t('admin.catalog.subcategory')} *</label>
              <label style={{ marginBottom: '10px', display: 'block' }}>
                <input
                  type="checkbox"
                  checked={formData.isNewSubcategory}
                  onChange={handleSubcategoryCheckboxChange}
                  disabled={!formData.category && !formData.isNewCategory}
                />
                {t('admin.catalog.addNewSubcategory')}
              </label>
              {formData.isNewSubcategory ? (
                <>
                  <input
                    type="text"
                    name="slug"
                    placeholder={t('admin.catalog.subcategorySlugPlaceholder')}
                    value={formData.newSubcategory.slug}
                    onChange={handleNewSubcategoryChange}
                    required
                    style={{ marginBottom: '8px' }}
                  />
                  <input
                    type="text"
                    name="ru"
                    placeholder={t('admin.catalog.subcategoryRuPlaceholder')}
                    value={formData.newSubcategory.ru}
                    onChange={handleNewSubcategoryChange}
                    required
                    style={{ marginBottom: '8px' }}
                  />
                  <input
                    type="text"
                    name="en"
                    placeholder={t('admin.catalog.subcategoryEnPlaceholder')}
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
                  disabled={subcategoriesLoading || (!formData.category && !formData.isNewCategory)}
                >
                  <option value="">{subcategoriesLoading ? t('loading') : t('admin.catalog.selectSubcategory')}</option>
                  {subcategories?.map((subcategory) => (
                    <option key={subcategory} value={subcategory}>
                      {t(`subcategory.${formData.category}.${subcategory}`) || subcategory}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>{t('admin.catalog.brand')}</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              list="brands-list"
            />
            <datalist id="brands-list">
              {brands?.map((brand) => (
                <option key={brand} value={brand} />
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label>{t('admin.catalog.descriptionEn')}</label>
            <textarea
              name="description_en"
              value={formData.description_en}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>{t('admin.catalog.descriptionRu')}</label>
            <textarea
              name="description_ru"
              value={formData.description_ru}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>{t('admin.catalog.image')}</label>
            {imagePreviews.length > 0 && (
              <div className="image-preview" style={{ marginBottom: '10px' }}>
                <p>{initialData ? t('admin.catalog.currentImages') : t('admin.catalog.imagePreview')}:</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {imagePreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index}`}
                      style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
            {initialData && (
              <small style={{ color: '#666', fontSize: '12px' }}>
                {t('admin.catalog.keepCurrentImage')}
              </small>
            )}
          </div>

          <div className="form-group">
            <label>{t('specs.mainTitle')}</label>
            <datalist id="spec-keys">
              {getFilteredSpecKeys('').map((key) => (
                <option key={key} value={key}>
                  {translatedSpecKeys[key] || key}
                </option>
              ))}
            </datalist>
            {formData.specs.map((spec, index) => (
              <div className="spec-row" key={index}>
                {spec.isNewSpec ? (
                  <>
                    <div style={{ marginBottom: '10px' }}>
                      <strong>{t('specs.newSpec')}</strong>
                    </div>
                    <input
                      type="text"
                      name="slug"
                      placeholder={t('specs.slugPlaceholder')}
                      value={spec.newSpec.slug}
                      onChange={(e) => handleNewSpecChange(index, 'slug', e.target.value)}
                      required
                      style={{ marginBottom: '8px' }}
                    />
                    <input
                      type="text"
                      name="ru"
                      placeholder={t('specs.ruPlaceholder')}
                      value={spec.newSpec.ru}
                      onChange={(e) => handleNewSpecChange(index, 'ru', e.target.value)}
                      required
                      style={{ marginBottom: '8px' }}
                    />
                    <input
                      type="text"
                      name="en"
                      placeholder={t('specs.enPlaceholder')}
                      value={spec.newSpec.en}
                      onChange={(e) => handleNewSpecChange(index, 'en', e.target.value)}
                      required
                      style={{ marginBottom: '8px' }}
                    />
                  </>
                ) : (
                  <input
                    type="text"
                    placeholder={t('specs.keyPlaceholder')}
                    value={spec.key}
                    onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                    list="spec-keys"
                  />
                )}
                <input
                  type="text"
                  placeholder={t('specs.valuePlaceholder')}
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  list={`spec-values-${index}`}
                />
                <datalist id={`spec-values-${index}`}>
                  {getFilteredSpecValues(spec.key, '').map((value) => (
                    <option key={value} value={String(value)} />
                  ))}
                </datalist>
                <label style={{ marginTop: '10px', display: 'block' }}>
                  <input
                    type="checkbox"
                    checked={spec.isNewSpec}
                    onChange={() => handleSpecCheckboxChange(index)}
                  />
                  {t('specs.addNewSpec')}
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
              + {t('specs.addSpec')}
            </button>
          </div>

          <div className="modal-actions">
            <Button type="button" onClick={onClose} className="cancel-button">
              {t('admin.catalog.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={loading || categoriesLoading || subcategoriesLoading || brandsLoading || specKeysValuesLoading}
              className="submit-button"
            >
              {loading ? t('admin.catalog.saving') : t('admin.catalog.submit')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditCatalogForm;