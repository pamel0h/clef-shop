import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useCatalogData from '../../../hooks/useCatalogData';
import '../../../../css/components/AdminCatalog.css';

const AddEditCatalogForm = ({ initialData, onSubmit, onCancel, isOpen, title }) => {
  const { t } = useTranslation();
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useCatalogData('categories');
  const { data: subcategories, loading: subcategoriesLoading, error: subcategoriesError } = useCatalogData('subcategories');
  const { data: brands, loading: brandsLoading, error: brandsError } = useCatalogData('brands');
  const { data: specKeysValues, loading: specKeysValuesLoading, error: specKeysValuesError } = useCatalogData('spec_keys_values');
  const [translatedSpecKeys, setTranslatedSpecKeys] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    description: { ru: '', en: '' },
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
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        specs: initialData.specs
          ? Object.entries(initialData.specs).map(([key, value]) => ({
              key,
              value,
              isNewSpec: false,
              newSpec: { slug: '', ru: '', en: '' },
            }))
          : [{ key: '', value: '', isNewSpec: false, newSpec: { slug: '', ru: '', en: '' } }],
        isNewCategory: false,
        newCategory: { slug: '', ru: '', en: '' },
        isNewSubcategory: false,
        newSubcategory: { slug: '', ru: '', en: '' },
      });
      setImagePreviews(initialData.images || []);
    }
  }, [initialData]);

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

  const getSpecLabel = (key) => {
    return translatedSpecKeys[key] || key;
  };

  const getFilteredSpecValues = (key, searchTerm) => {
    if (!key || !specKeysValues[key]) return [];
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return specKeysValues[key].filter((value) =>
      String(value).toLowerCase().includes(lowercasedSearchTerm)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDescriptionChange = (lang, value) => {
    setFormData({
      ...formData,
      description: { ...formData.description, [lang]: value },
    });
  };

  const handleNewCategoryChange = (field, value) => {
    setFormData({
      ...formData,
      newCategory: { ...formData.newCategory, [field]: value },
    });
  };

  const handleNewSubcategoryChange = (field, value) => {
    setFormData({
      ...formData,
      newSubcategory: { ...formData.newSubcategory, [field]: value },
    });
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setFormData({ ...formData, specs: newSpecs });
  };

  const handleNewSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specs];
    newSpecs[index].newSpec = { ...newSpecs[index].newSpec, [field]: value };
    setFormData({ ...formData, specs: newSpecs });
  };

  const handleCategoryCheckboxChange = () => {
    setFormData({
      ...formData,
      isNewCategory: !formData.isNewCategory,
      category: '',
      isNewSubcategory: false,
      subcategory: '',
    });
  };

  const handleSubcategoryCheckboxChange = () => {
    setFormData({
      ...formData,
      isNewSubcategory: !formData.isNewSubcategory,
      subcategory: '',
    });
  };

  const handleSpecCheckboxChange = (index) => {
    const newSpecs = [...formData.specs];
    newSpecs[index].isNewSpec = !newSpecs[index].isNewSpec;
    setFormData({ ...formData, specs: newSpecs });
  };

  const addSpecField = () => {
    setFormData({
      ...formData,
      specs: [
        ...formData.specs,
        { key: '', value: '', isNewSpec: false, newSpec: { slug: '', ru: '', en: '' } },
      ],
    });
  };

  const removeSpecField = (index, e) => {
    e.preventDefault();
    if (formData.specs.length > 1) {
      const newSpecs = formData.specs.filter((_, i) => i !== index);
      setFormData({ ...formData, specs: newSpecs });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('description_en', formData.description.en);
      formDataToSubmit.append('description_ru', formData.description.ru);
      formDataToSubmit.append('price', formData.price);
      
      if (formData.isNewCategory && formData.newCategory.slug) {
        formDataToSubmit.append('new_category', JSON.stringify(formData.newCategory));
      } else {
        formDataToSubmit.append('category', formData.category);
      }

      if (formData.isNewSubcategory && formData.newSubcategory.slug) {
        formDataToSubmit.append('new_subcategory', JSON.stringify(formData.newSubcategory));
      } else {
        formDataToSubmit.append('subcategory', formData.subcategory);
      }

      formDataToSubmit.append('brand', formData.brand);
      formDataToSubmit.append('discount', formData.discount || '');

      formData.images.forEach((image, index) => {
        formDataToSubmit.append(`images[${index}]`, image);
      });

      const specsObject = {};
      formData.specs.forEach((spec) => {
        if (spec.isNewSpec && spec.newSpec.slug) {
          specsObject[spec.newSpec.slug] = {
            value: spec.value,
            translations: { ru: spec.newSpec.ru, en: spec.newSpec.en },
          };
        } else if (spec.key && spec.value) {
          specsObject[spec.key] = spec.value;
        }
      });
      formDataToSubmit.append('specs_data', JSON.stringify(specsObject));

      await onSubmit(formDataToSubmit);
    } catch (err) {
      setError(t('error.submit_failed', { message: err.message }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <h2>{title}</h2>
      {error && <div className="error">{error}</div>}
      {(categoriesError || subcategoriesError || brandsError || specKeysValuesError) && (
        <div className="error">
          {t('error.data_load_failed', { message: categoriesError || subcategoriesError || brandsError || specKeysValuesError })}
        </div>
      )}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>{t('name')}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>{t('description.ru')}</label>
          <textarea
            name="description_ru"
            value={formData.description.ru}
            onChange={(e) => handleDescriptionChange('ru', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>{t('description.en')}</label>
          <textarea
            name="description_en"
            value={formData.description.en}
            onChange={(e) => handleDescriptionChange('en', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>{t('price')}</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>{t('category')}</label>
          <label style={{ marginTop: '10px', display: 'block' }}>
            <input
              type="checkbox"
              checked={formData.isNewCategory}
              onChange={handleCategoryCheckboxChange}
            />
            {t('category.addNewCategory')}
          </label>
          {formData.isNewCategory ? (
            <>
              <input
                type="text"
                name="category_slug"
                placeholder={t('category.slugPlaceholder')}
                value={formData.newCategory.slug}
                onChange={(e) => handleNewCategoryChange('slug', e.target.value)}
                required
                style={{ marginBottom: '8px' }}
              />
              <input
                type="text"
                name="category_ru"
                placeholder={t('category.ruPlaceholder')}
                value={formData.newCategory.ru}
                onChange={(e) => handleNewCategoryChange('ru', e.target.value)}
                required
                style={{ marginBottom: '8px' }}
              />
              <input
                type="text"
                name="category_en"
                placeholder={t('category.enPlaceholder')}
                value={formData.newCategory.en}
                onChange={(e) => handleNewCategoryChange('en', e.target.value)}
                required
                style={{ marginBottom: '8px' }}
              />
            </>
          ) : (
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={categoriesLoading}
              required
            >
              <option value="">{t('select_category')}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {t(`category.${cat}`, cat)}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label>{t('subcategory')}</label>
          <label style={{ marginTop: '10px', display: 'block' }}>
            <input
              type="checkbox"
              checked={formData.isNewSubcategory}
              onChange={handleSubcategoryCheckboxChange}
              disabled={!formData.category && !formData.isNewCategory}
            />
            {t('subcategory.addNewSubcategory')}
          </label>
          {formData.isNewSubcategory ? (
            <>
              <input
                type="text"
                name="subcategory_slug"
                placeholder={t('subcategory.slugPlaceholder')}
                value={formData.newSubcategory.slug}
                onChange={(e) => handleNewSubcategoryChange('slug', e.target.value)}
                required
                style={{ marginBottom: '8px' }}
              />
              <input
                type="text"
                name="subcategory_ru"
                placeholder={t('subcategory.ruPlaceholder')}
                value={formData.newSubcategory.ru}
                onChange={(e) => handleNewSubcategoryChange('ru', e.target.value)}
                required
                style={{ marginBottom: '8px' }}
              />
              <input
                type="text"
                name="subcategory_en"
                placeholder={t('subcategory.enPlaceholder')}
                value={formData.newSubcategory.en}
                onChange={(e) => handleNewSubcategoryChange('en', e.target.value)}
                required
                style={{ marginBottom: '8px' }}
              />
            </>
          ) : (
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              disabled={subcategoriesLoading || !formData.category}
              required
            >
              <option value="">{t('select_subcategory')}</option>
              {subcategories.map((sub) => (
                <option key={sub} value={sub}>
                  {t(`subcategory.${formData.category}.${sub}`, sub)}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label>{t('brand')}</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            list="brands-list"
          />
          <datalist id="brands-list">
            {brands.map((brand) => (
              <option key={brand} value={brand} />
            ))}
          </datalist>
        </div>

        <div className="form-group">
          <label>{t('discount')}</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>{t('images')}</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="image-previews">
            {imagePreviews.map((preview, index) => (
              <img key={index} src={preview} alt={`Preview ${index}`} />
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>{t('specs.mainTitle')}</label>
          <datalist id="spec-keys">
            {getFilteredSpecKeys('').map((key) => (
              <option key={key} value={key}>
                {getSpecLabel(key)}
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
                disabled={!spec.key}
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
          <button type="button" onClick={addSpecField} className="add-spec-button">
            + {t('specs.addSpec')}
          </button>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={categoriesLoading || subcategoriesLoading || brandsLoading || specKeysValuesLoading}
          >
            {t('submit')}
          </button>
          <button type="button" onClick={onCancel}>
            {t('cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditCatalogForm;