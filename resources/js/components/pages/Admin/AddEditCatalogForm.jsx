import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useCatalogData from '../../../hooks/useCatalogData';
import Button from '../../UI/Button';
import i18n from '../../../i18n';
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

  const { data: categories, loading: categoriesLoading, pausePolling, resumePolling } = useCatalogData('categories');
  const { data: subcategories, loading: subcategoriesLoading } = useCatalogData('subcategories', { category: selectedCategory }, !selectedCategory);
  const { data: brands, loading: brandsLoading } = useCatalogData('brands');
  const { data: specKeysValues, loading: specKeysValuesLoading } = useCatalogData('spec_keys_values');
  const { 
    refetch: refetchAdminCatalog, 
    updateLastUpdated, 
    updateTranslationsLastUpdated 
  } = useCatalogData('admin_catalog');

  useEffect(() => {
    if (initialData) {
      setSelectedCategory(initialData.category || '');
      console.log(initialData);
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
        image: [],
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
      console.log(initialData.image);
      if (initialData.image) {
        const imagePath = [initialData.image];
        setImagePreviews(imagePath);
      } else {
        setImagePreviews([]);
      }
    } else {
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
      setFormData((prev) => ({
        ...prev,
        category: value,
        subcategory: '',
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

    pausePolling();

    try {
      const formDataToSend = new FormData();
      const authToken = localStorage.getItem('auth_token') || localStorage.getItem('token');

      if (!authToken) {
        throw new Error(t('auth_token_missing'));
      }

      if (initialData) {
        formDataToSend.append('_method', 'PUT');
      }

      const fields = ['name', 'description_en', 'description_ru', 'price', 'discount', 'brand'];
      fields.forEach((key) => {
        formDataToSend.append(key, formData[key] || '');
      });

      console.log('FormData before sending:', {
        formData,
        isNewCategory: formData.isNewCategory,
        newCategory: formData.newCategory,
        isNewSubcategory: formData.isNewSubcategory,
        newSubcategory: formData.newSubcategory,
      });

      formDataToSend.append('is_new_category', formData.isNewCategory ? '1' : '0');
      if (
        formData.isNewCategory &&
        formData.newCategory.slug?.trim() &&
        formData.newCategory.ru?.trim() &&
        formData.newCategory.en?.trim()
      ) {
        formDataToSend.append('category', formData.newCategory.slug.trim());
        formDataToSend.append('new_category[slug]', formData.newCategory.slug.trim());
        formDataToSend.append('new_category[ru]', formData.newCategory.ru.trim());
        formDataToSend.append('new_category[en]', formData.newCategory.en.trim());
      } else {
        formDataToSend.append('category', formData.category || '');
      }

      formDataToSend.append('is_new_subcategory', formData.isNewSubcategory ? '1' : '0');
      if (
        formData.isNewSubcategory &&
        formData.newSubcategory.slug?.trim() &&
        formData.newSubcategory.ru?.trim() &&
        formData.newSubcategory.en?.trim()
      ) {
        formDataToSend.append('subcategory', formData.newSubcategory.slug.trim());
        formDataToSend.append('new_subcategory[slug]', formData.newSubcategory.slug.trim());
        formDataToSend.append('new_subcategory[ru]', formData.newSubcategory.ru.trim());
        formDataToSend.append('new_subcategory[en]', formData.newSubcategory.en.trim());
      } else {
        formDataToSend.append('subcategory', formData.subcategory || '');
      }

      if (Array.isArray(formData.images) && formData.images.length > 0) {
        formDataToSend.append('images[]', formData.images[0]);
      }

      const specsObject = formData.specs.reduce((obj, spec, index) => {
        if (
          spec.isNewSpec &&
          spec.newSpec.slug?.trim() &&
          spec.newSpec.ru?.trim() &&
          spec.newSpec.en?.trim() &&
          spec.value?.trim()
        ) {
          obj[spec.newSpec.slug.trim()] = {
            value: spec.value.trim(),
            translations: { ru: spec.newSpec.ru.trim(), en: spec.newSpec.en.trim() },
          };
        } else if (spec.key?.trim() && spec.value?.trim()) {
          formDataToSend.append(`specs[${index}][key]`, spec.key.trim());
          formDataToSend.append(`specs[${index}][value]`, spec.value.trim());
        }
        return obj;
      }, {});

      if (Object.keys(specsObject).length > 0) {
        formDataToSend.append('specs_data', JSON.stringify(specsObject));
      }

      const formDataEntries = {};
      for (let [key, value] of formDataToSend.entries()) {
        formDataEntries[key] = value;
      }
      console.log('FormData entries:', formDataEntries);

      const url = initialData ? `/api/admin/catalog/${initialData.id}` : '/api/admin/catalog';

      const response = await fetch(url, {
        method: 'POST',
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

  // Обновляем данные и переводы одним вызовом
  await refetchAdminCatalog(true); // true = обновить timestamps и переводы
  
  await onSubmit(result.data);
  onClose();
} else {
      //   const errorMessage = result.message || t('submit_error');
      //   const detailedErrors = result.errors
      //     ? Object.values(result.errors).flat().join(' ')
      //     : '';
      //   setError(`${errorMessage} ${detailedErrors}`);
      // }
      const errorCount = result.errors ? Object.keys(result.errors).length : 0;
      // const errorMessage = t('submit_error_with_count', { count: errorCount });
      const detailedErrors = result.errors
        ? Object.entries(result.errors)
            .map(([field, messages]) => {
              const formattedMessages = Array.isArray(messages)
                ? messages.map((msg) => `<li>${msg}</li>`).join('')
                : `<li>${messages}</li>`;
              return `<li><strong>${t(`admin.catalog.${field}`)}:</strong> ${
                Array.isArray(messages) && messages.length > 1
                  ? `<ul>${formattedMessages}</ul>`
                  : formattedMessages
              }</li>`;
            })
            .join('')
        : '';
      setError(
        `<div class="error-container">
          ${detailedErrors ? `<ul>${detailedErrors}</ul>` : ''}
        </div>`
      );
    }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(t('network_error', { message: err.message }));
    } finally {
      setLoading(false);
      resumePolling();
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
        {error && (
          <div
            className="error-message"
            dangerouslySetInnerHTML={{ __html: error }}
          />
        )}

          <div className="form-group">
            <label>{t('admin.catalog.name')}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('admin.catalog.price')}</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value) || value === '') {
                    setFormData({ ...formData, price: value });
                  }
                }}
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
              <label>{t('admin.catalog.category')}</label>
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
                    placeholder={t('admin.catalog.SlugPlaceholder')}
                    value={formData.newCategory.slug}
                    onChange={handleNewCategoryChange}
                    style={{ marginBottom: '8px' }}
                  />
                  <input
                    type="text"
                    name="ru"
                    placeholder={t('admin.catalog.RuPlaceholder')}
                    value={formData.newCategory.ru}
                    onChange={handleNewCategoryChange}
                    style={{ marginBottom: '8px' }}
                  />
                  <input
                    type="text"
                    name="en"
                    placeholder={t('admin.catalog.EnPlaceholder')}
                    value={formData.newCategory.en}
                    onChange={handleNewCategoryChange}
                  />
                </>
              ) : (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
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
              <label>{t('admin.catalog.subcategory')}</label>
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
                    placeholder={t('admin.catalog.SlugPlaceholder')}
                    value={formData.newSubcategory.slug}
                    onChange={handleNewSubcategoryChange}
                    style={{ marginBottom: '8px' }}
                  />
                  <input
                    type="text"
                    name="ru"
                    placeholder={t('admin.catalog.RuPlaceholder')}
                    value={formData.newSubcategory.ru}
                    onChange={handleNewSubcategoryChange}
                    style={{ marginBottom: '8px' }}
                  />
                  <input
                    type="text"
                    name="en"
                    placeholder={t('admin.catalog.EnPlaceholder')}
                    value={formData.newSubcategory.en}
                    onChange={handleNewSubcategoryChange}
                  />
                </>
              ) : (
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
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
                <p>{initialData ? t('admin.catalog.currentImage') : t('admin.catalog.imagePreview')}:</p>
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
              accept="image/*"
              onChange={handleFileChange}
            />
            {initialData && (
              <small style={{ color: '#666', fontSize: '12px' }}>
                {t('admin.catalog.keepCurrentImage')}
              </small>
            )}
          </div>

          <div className="form-group specs-group">
            <label className="specs-label">{t('specs.mainTitle')}</label>
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
                  <div className="new-spec-fields">
                    <input
                      type="text"
                      name="slug"
                      className="spec-input"
                      placeholder={t('admin.catalog.SlugPlaceholder')}
                      value={spec.newSpec.slug}
                      onChange={(e) => handleNewSpecChange(index, 'slug', e.target.value)}
                    />
                    <input
                      type="text"
                      name="ru"
                      className="spec-input"
                      placeholder={t('admin.catalog.RuPlaceholder')}
                      value={spec.newSpec.ru}
                      onChange={(e) => handleNewSpecChange(index, 'ru', e.target.value)}
                    />
                    <input
                      type="text"
                      name="en"
                      className="spec-input"
                      placeholder={t('admin.catalog.EnPlaceholder')}
                      value={spec.newSpec.en}
                      onChange={(e) => handleNewSpecChange(index, 'en', e.target.value)}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    className="spec-input"
                    placeholder={t('admin.catalog.keyPlaceholder')}
                    value={spec.key}
                    onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                    list="spec-keys"
                  />
                )}
                <input
                  type="text"
                  className="spec-input"
                  placeholder={t('admin.catalog.valuePlaceholder')}
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  list={`spec-values-${index}`}
                />
                <datalist id={`spec-values-${index}`}>
                  {getFilteredSpecValues(spec.key, '').map((value) => (
                    <option key={value} value={String(value)} />
                  ))}
                </datalist>
                <div className="spec-actions">
                  <label className="spec-checkbox">
                    <input
                      type="checkbox"
                      checked={spec.isNewSpec}
                      onChange={() => handleSpecCheckboxChange(index)}
                    />
                    {t('admin.catalog.addNewSpec')}
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
              </div>
            ))}
            <button
              type="button"
              onClick={addSpecField}
              className="add-spec-button"
            >
              + {t('admin.catalog.addSpec')}
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