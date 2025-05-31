import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useProductFilter from '../../../hooks/useProductFilter';
import '../../../../css/components/Filter.css';
import '../../../../css/components/FilterNew.css';
import Button from '../../UI/Button';
import { useTranslation } from 'react-i18next';

export const ProductFilter = ({
  initialProducts = [],
  filteredByMainFilters = [],
  filteredProducts = [],
  onFilterChange,
  onSortChange,
  sortOption = { field: 'name', direction: 'asc' },
  initialFilters,
}) => {
  const { t } = useTranslation();
  const { filters, setFilters, setSortOption } = useProductFilter(initialProducts, filteredByMainFilters, initialFilters);
  const location = useLocation();
  const isSearchPage = location.pathname.startsWith('/search');
  const [showSpecs, setShowSpecs] = useState(false);
  const [expandedSpecs, setExpandedSpecs] = useState({});
  const [localPriceRange, setLocalPriceRange] = useState([0, 100000]);

  // Синхронизируем локальный диапазон цен с фильтрами
  useEffect(() => {
    if (filters?.priceRange && Array.isArray(filters.priceRange)) {
      console.log('ProductFilter: Syncing localPriceRange with filters', filters.priceRange);
      setLocalPriceRange(filters.priceRange);
    }
  }, [filters?.priceRange]);

  useEffect(() => {
    // Когда фильтры инициализируются с сохраненными значениями,
    // сразу сообщаем об этом родительскому компоненту
    if (filters?.initialized && initialFilters && Object.keys(initialFilters).length > 0) {
      console.log('ProductFilter: Filters initialized with saved values, triggering change', filters);
      onFilterChange(filters);
    }
  }, [filters?.initialized]);
  
  const VALUES_LIMIT = 5;

  const handlePriceChange = (type, value) => {
    console.log('ProductFilter: handlePriceChange', { type, value });
    const parsedValue = value === '' ? 0 : parseInt(value, 10);
    let newMin = localPriceRange[0];
    let newMax = localPriceRange[1];

    if (type === 'min') {
      newMin = isNaN(parsedValue) ? 0 : Math.max(0, parsedValue);
      newMax = Math.max(newMin, localPriceRange[1]);
    } else if (type === 'max') {
      newMax = isNaN(parsedValue) ? localPriceRange[1] : Math.max(newMin, parsedValue);
    }

    const newPriceRange = [newMin, newMax];
    setLocalPriceRange(newPriceRange);

    if (filters && setFilters) {
      setFilters((prev) => {
        const newFilters = {
          ...prev,
          priceRange: newPriceRange,
        };
        onFilterChange(newFilters);
        return newFilters;
      });
    }
  };

  const handleBlur = (type, value) => {
    console.log('ProductFilter: handleBlur', { type, value });
    if (value === '') {
      handlePriceChange(type, type === 'min' ? '0' : localPriceRange[1].toString());
    }
  };

  const handleSpecChange = (specKey, specValue, checked) => {
    console.log('ProductFilter: handleSpecChange', { specKey, specValue, checked });
    
    if (!filters || !setFilters) {
      console.warn('ProductFilter: Filters not ready');
      return;
    }

    const newSelectedSpecs = {
      ...filters.selectedSpecs,
      [specKey]: {
        ...(filters.selectedSpecs[specKey] || {}),
        [specValue]: checked,
      },
    };

    const newFilters = {
      ...filters,
      selectedSpecs: newSelectedSpecs,
    };

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortFieldChange = (e) => {
    const field = e.target.value;
    console.log('ProductFilter: Changing sort field', { field, currentSortOption: sortOption });
    const newSortOption = { 
      field: field || 'name',
      direction: sortOption.direction || 'asc'
    };
    onSortChange(newSortOption.field, newSortOption.direction);
  };

  const handleSortDirectionChange = (e) => {
    const direction = e.target.value;
    console.log('ProductFilter: Changing sort direction', { direction, currentSortOption: sortOption });
    const newSortOption = { 
      field: sortOption.field || 'name',
      direction: direction || 'asc'
    };
    onSortChange(newSortOption.field, newSortOption.direction);
  };


  const handleCategoryChange = (value) => {
    console.log('ProductFilter: handleCategoryChange', value);
    
    if (!filters || !setFilters) {
      console.warn('ProductFilter: Filters not ready');
      return;
    }

    const newFilters = {
      ...filters,
      category: value,
      subcategory: 'all',
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSubcategoryChange = (value) => {
    console.log('ProductFilter: handleSubcategoryChange', value);
    
    if (!filters || !setFilters) {
      console.warn('Filters not initialized yet, skipping subcategory change');
      return;
    }
    
    const newFilters = { ...filters, subcategory: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBrandChange = (value) => {
    console.log('ProductFilter: handleBrandChange', value);
    
    if (!filters || !setFilters) {
      console.warn('ProductFilter: Filters not ready');
      return;
    }

    const newFilters = { ...filters, brand: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleResetFilters = () => {
    console.log('ProductFilter: handleResetFilters');
    
    if (!initialProducts.length || !filters || !setFilters) {
      console.error('initialProducts is empty or filters not ready');
      return;
    }

    const maxPrice =
      initialProducts.length > 0
        ? Math.ceil(Math.max(...initialProducts.map((p) => Number(p.price) || 0)) / 1000) * 1000
        : 100000;

    const allSpecs = {};
    initialProducts.forEach((product) => {
      if (product.specs && typeof product.specs === 'object' && product.specs !== null) {
        Object.entries(product.specs).forEach(([key, value]) => {
          if (key && value) {
            if (!allSpecs[key]) allSpecs[key] = {};
            allSpecs[key][String(value)] = { count: 0, selected: true };
          }
        });
      }
    });

    const newFilters = {
      priceRange: [0, maxPrice],
      brand: 'all',
      category: 'all',
      subcategory: 'all',
      brands: filters.brands,
      categories: filters.categories,
      subcategories: filters.subcategories,
      specs: allSpecs,
      selectedSpecs: {},
      initialized: true,
    };

    // Сброс сортировки к значениям по умолчанию
    const defaultSortOption = { field: 'name', direction: 'asc' };
    setSortOption(defaultSortOption);
    onSortChange(defaultSortOption.field, defaultSortOption.direction);

    setLocalPriceRange([0, maxPrice]);
    setFilters(newFilters);
    onFilterChange(newFilters);
    setExpandedSpecs({});
  };

  const toggleExpandSpecs = (specKey) => {
    console.log('ProductFilter: toggleExpandSpecs', specKey);
    setExpandedSpecs((prev) => ({
      ...prev,
      [specKey]: !prev[specKey],
    }));
  };

  // Защита от неинициализированных фильтров
  if (!filters || !filters.initialized) {
    return <div className="loading">Загрузка фильтров...</div>;
  }

  const availableSubcategories =
    filters.category === 'all'
      ? filters.subcategories
      : initialProducts
          .filter((product) => product.category === filters.category)
          .map((product) => product.subcategory)
          .filter((value, index, self) => value && self.indexOf(value) === index)
          .sort();

  return (
    <div className="filters">
      <div className="filter-block">
        <h3>{t('sort.mainTitle')}</h3>
        <div className="filter-group">
          <label>{t('sort.sortBy')}:</label>
          <select value={sortOption.field || 'name'} onChange={handleSortFieldChange} className="sort-select">
            <option value="name">{t('sort.byName')}</option>
            <option value="price">{t('sort.byPrice')}</option>
          </select>
        </div>
        <div className="filter-group">
          <label>{t('sort.direction')}:</label>
          <select value={sortOption.direction || 'asc'} onChange={handleSortDirectionChange} className="sort-select">
            <option value="asc">{t('sort.asc')}</option>
            <option value="desc">{t('sort.desc')}</option>
          </select>
        </div>
      </div>
      <div className="filter-block">
        <h3>{t('filters.mainTitle')}</h3>
        <div className="filter-group">
          <label>{t('filters.price')}:</label>
          <div className="price-inputs">
            <input
              type="number"
              min="0"
              value={localPriceRange[0]}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              onBlur={(e) => handleBlur('min', e.target.value)}
              placeholder={t('filters.from')}
              className="price-input"
            />
            <span>—</span>
            <input
              type="number"
              min={localPriceRange[0]}
              value={localPriceRange[1]}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              onBlur={(e) => handleBlur('max', e.target.value)}
              placeholder={t('filters.to')}
              className="price-input"
            />
          </div>
          <span>
            {t('filters.from')} {localPriceRange[0]} {t('filters.to')} {localPriceRange[1]} ₽
          </span>
        </div>
        <div className="filter-group">
          <label>{t('filters.brand')}:</label>
          <select
            onChange={(e) => handleBrandChange(e.target.value)}
            value={filters.brand}
          >
            <option value="all">{t('filters.all')}</option>
            {filters.brands?.length > 0 ? (
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
        {isSearchPage && (
          <>
            <div className="filter-group">
              <label>{t('filters.category')}:</label>
              <select onChange={(e) => handleCategoryChange(e.target.value)} value={filters.category}>
                <option value="all">{t('filters.all')}</option>
                {filters.categories?.length > 0 ? (
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
                onChange={(e) => handleSubcategoryChange(e.target.value)}
                value={filters.subcategory}
                disabled={filters.category === 'all' || availableSubcategories.length === 0}
              >
                <option value="all">{t('filters.all')}</option>
                {availableSubcategories?.length > 0 ? (
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
          </>
        )}
      </div>
      <div className="filter-block">
        <div className="specs-filter-section">
          <h3 className="specs-title" onClick={() => setShowSpecs(!showSpecs)} style={{ cursor: 'pointer' }}>
            {t('filters.specifications')}
          </h3>
          {showSpecs && (
            <>
              {Object.keys(filters.specs).length > 0 ? (
                Object.entries(filters.specs).map(([specKey, specValues]) => {
                  const valuesArray = Object.entries(specValues).filter(([_, { count }]) => count > 0);
                  if (valuesArray.length === 0) return null;

                  const isExpanded = expandedSpecs[specKey];
                  const displayedValues = isExpanded ? valuesArray : valuesArray.slice(0, VALUES_LIMIT);
                  const hasMore = valuesArray.length > VALUES_LIMIT;

                  return (
                    <div key={specKey} className="spec-group">
                      <h4>{t(`specs.${specKey}`) || specKey}</h4>
                      <div className="spec-options">
                        {displayedValues.map(([value, { count, selected }]) => (
                          <label key={value} className="spec-option">
                            <input
                              type="checkbox"
                              checked={filters.selectedSpecs[specKey]?.[value] !== false}
                              onChange={(e) => handleSpecChange(specKey, value, e.target.checked)}
                            />
                            <span>
                              {value} ({count})
                            </span>
                          </label>
                        ))}
                      </div>
                      {hasMore && (
                        <button className="show-more-button" onClick={() => toggleExpandSpecs(specKey)}>
                          {isExpanded ? t('filters.showLess') : t('filters.showMore')}
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>{t('filters.noSpecs')}</p>
              )}
            </>
          )}
        </div>
      </div>
      <Button className="reset-button" onClick={handleResetFilters}>
        {t('filters.reset')}
      </Button>
    </div>
  );
};