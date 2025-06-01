import { useState } from 'react';
import useProductFilter from '../../../hooks/useProductFilter';
import { useTranslation } from 'react-i18next';
import Button from '../../UI/Button';
import '../../../../css/components/AdminFilter.css';

const AdminProductFilter = ({ initialProducts = [], onFilterChange }) => {
  const { t } = useTranslation();
  const { filters, setFilters } = useProductFilter(initialProducts, initialProducts);
  const [showFilters, setShowFilters] = useState(true);

  // Логирование для отладки
  console.log('AdminProductFilter: Initial Products', initialProducts);
  console.log('AdminProductFilter: Filters', filters);

  const handlePriceChange = (type, value) => {
    const parsedValue = value === '' ? 0 : parseInt(value);
    let newMin = filters.priceRange[0];
    let newMax = filters.priceRange[1];

    if (type === 'min') {
      newMin = isNaN(parsedValue) ? 0 : Math.max(0, parsedValue);
      newMax = Math.max(newMin, filters.priceRange[1]);
    } else {
      newMax = isNaN(parsedValue) ? filters.priceRange[1] : Math.max(newMin, parsedValue);
    }

    const newFilters = { ...filters, priceRange: [newMin, newMax] };
    setFilters(newFilters);
    console.log('AdminProductFilter: Price changed', newFilters);
    onFilterChange(newFilters);
  };

  const handleBrandChange = (e) => {
    const newFilters = { ...filters, brand: e.target.value };
    setFilters(newFilters);
    console.log('AdminProductFilter: Brand changed', newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryChange = (e) => {
    const newFilters = { ...filters, category: e.target.value, subcategory: 'all' };
    setFilters(newFilters);
    console.log('AdminProductFilter: Category changed', newFilters);
    onFilterChange(newFilters);
  };

  const handleSubcategoryChange = (e) => {
    const newFilters = { ...filters, subcategory: e.target.value };
    setFilters(newFilters);
    console.log('AdminProductFilter: Subcategory changed', newFilters);
    onFilterChange(newFilters);
  };

  const handleResetFilters = () => {
    if (!initialProducts.length) {
      console.warn('AdminProductFilter: No initial products for reset');
      return;
    }

    const maxPrice = initialProducts.length > 0
      ? Math.ceil(Math.max(...initialProducts.map((p) => Number(p.price) || 0)) / 1000) * 1000
      : 100000;

    const newFilters = {
      priceRange: [0, maxPrice],
      brand: 'all',
      category: 'all',
      subcategory: 'all',
      brands: filters.brands,
      categories: filters.categories,
      subcategories: filters.subcategories,
      specs: filters.specs,
      selectedSpecs: Object.keys(filters.specs).reduce((acc, key) => {
        acc[key] = Object.keys(filters.specs[key]).reduce((valAcc, val) => {
          valAcc[val] = true;
          return valAcc;
        }, {});
        return acc;
      }, {}),
    };

    setFilters(newFilters);
    console.log('AdminProductFilter: Filters reset', newFilters);
    onFilterChange(newFilters);
    setShowFilters(true);
  };

  const availableSubcategories = filters.category === 'all'
    ? filters.subcategories
    : initialProducts
        .filter((product) => product.category === filters.category)
        .map((product) => product.subcategory)
        .filter((value, index, self) => value && self.indexOf(value) === index)
        .sort();

  return (
    <div className="admin-filter-panel">
      <h3 onClick={() => setShowFilters(!showFilters)} style={{ cursor: 'pointer' }}>
        {t('filters.mainTitle')}
      </h3>
      {showFilters && (
        <div className="filter-content">
          <div className="filter-group">
            <label>{t('filters.price')}:</label>
            <div className="price-inputs">
              <input
                type="number"
                min="0"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                placeholder={t('filters.from')}
                className="price-input"
              />
              <span>—</span>
              <input
                type="number"
                min={filters.priceRange[0]}
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                placeholder={t('filters.to')}
                className="price-input"
              />
            </div>
          </div>
          <div className="filter-group">
            <label>{t('filters.brand')}:</label>
            <select value={filters.brand} onChange={handleBrandChange} className="filter-select">
              <option value="all">{t('filters.all')}</option>
              {filters.brands.length > 0 ? (
                filters.brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))
              ) : (
                <option disabled>{t('filters.noBrands')}</option>
              )}
            </select>
          </div>
          <div className="filter-group">
            <label>{t('filters.category')}:</label>
            <select value={filters.category} onChange={handleCategoryChange} className="filter-select">
              <option value="all">{t('filters.all')}</option>
              {filters.categories.length > 0 ? (
                filters.categories.map((category) => (
                  <option key={category} value={category}>
                    {t(`category.${category}`)}
                  </option>
                ))
              ) : (
                <option disabled>{t('filters.noCategories')}</option>
              )}
            </select>
          </div>
          <div className="filter-group">
            <label>{t('filters.subcategory')}:</label>
            <select
              value={filters.subcategory}
              onChange={handleSubcategoryChange}
              disabled={filters.category === 'all' || availableSubcategories.length === 0}
              className="filter-select"
            >
              <option value="all">{t('filters.all')}</option>
              {availableSubcategories.length > 0 ? (
                availableSubcategories.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {t(`subcategory.${filters.category}.${subcategory}`)}
                  </option>
                ))
              ) : (
                <option disabled>{t('filters.noSubcategories')}</option>
              )}
            </select>
          </div>
          <Button className="reset-button" onClick={handleResetFilters}>
            {t('filters.reset')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminProductFilter;