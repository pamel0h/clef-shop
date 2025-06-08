import { useState, useEffect } from 'react'; // Добавляем useEffect
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
  isSearchPage = false,
  isAdminPage = false,
  savedFilters, // Новый пропс
  savedSortOption, // Новый пропс
}) => {
  const { t } = useTranslation();
  const { filters, setFilters } = useProductFilter(initialProducts, filteredByMainFilters);
  const location = useLocation();
  const [showSpecs, setShowSpecs] = useState(false);
  const [expandedSpecs, setExpandedSpecs] = useState({});
  const [showMoreSpecs, setShowMoreSpecs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const SPECS_LIMIT = 5;
  const VALUES_LIMIT = 5;

  // Синхронизация filters и searchQuery с savedFilters
  useEffect(() => {
    if (savedFilters) {
      setFilters(savedFilters);
      setSearchQuery(savedFilters.searchQuery || '');
    }
  }, [savedFilters, setFilters]);

  // Синхронизация sortOption с savedSortOption
  useEffect(() => {
    if (savedSortOption && (savedSortOption.field !== sortOption.field || savedSortOption.direction !== sortOption.direction)) {
      onSortChange(savedSortOption.field, savedSortOption.direction);
    }
  }, [savedSortOption, sortOption, onSortChange]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    const newFilters = {
      ...filters,
      searchQuery: value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSpecChange = (specKey, specValue, checked) => {
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
    onSortChange(field, sortOption.direction);
  };

  const handleSortDirectionChange = (e) => {
    const direction = e.target.value;
    onSortChange(sortOption.field, direction);
  };

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
    onFilterChange(newFilters);
  };

  const handleBlur = (type, value) => {
    if (value === '') {
      handlePriceChange(type, type === 'min' ? '0' : filters.priceRange[1].toString());
    }
  };

  const handleCategoryChange = (value) => {
    const newFilters = {
      ...filters,
      category: value,
      subcategory: 'all',
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSubcategoryChange = (value) => {
    const newFilters = { ...filters, subcategory: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleResetFilters = () => {
    if (!initialProducts.length) {
      console.error('initialProducts is empty');
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
      searchQuery: '', // Сбрасываем поиск
    };

    setFilters(newFilters);
    onFilterChange(newFilters);
    setExpandedSpecs({});
    setSearchQuery('');
    setShowSpecs(false);
    setShowMoreSpecs(false);
  };

  const toggleExpandSpecs = (specKey) => {
    setExpandedSpecs((prev) => ({
      ...prev,
      [specKey]: !prev[specKey],
    }));
  };

  const toggleShowMoreSpecs = () => {
    setShowMoreSpecs((prev) => !prev);
  };

  const availableSubcategories = filters.category === 'all'
    ? filters.subcategories
    : initialProducts
        .filter((product) => product.category === filters.category)
        .map((product) => product.subcategory)
        .filter((value, index, self) => value && self.indexOf(value) === index)
        .sort();

  const specKeys = Object.keys(filters.specs);
  const displayedSpecKeys = showMoreSpecs ? specKeys : specKeys.slice(0, SPECS_LIMIT);
  const hasMoreSpecs = specKeys.length > SPECS_LIMIT;

  return (
    <div className="filters">
      <div className="filter-block">
        <h3>{t('filters.search')}</h3>
        <input
          type="text"
          placeholder={t('filters.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-block">
        <h3>{t('sort.mainTitle')}</h3>
        <div className="filter-group">
          <label>{t('sort.sortBy')}:</label>
          <select value={sortOption.field} onChange={handleSortFieldChange} className="sort-select">
            <option value="name">{t('sort.byName')}</option>
            <option value="price">{t('sort.byPrice')}</option>
          </select>
        </div>
        <div className="filter-group">
          <label>{t('sort.direction')}:</label>
          <select value={sortOption.direction} onChange={handleSortDirectionChange} className="sort-select">
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
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              onBlur={(e) => handleBlur('min', e.target.value)}
              placeholder={t('filters.from')}
              className="price-input"
            />
            <span>—</span>
            <input
              type="number"
              min={filters.priceRange[0]}
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              onBlur={(e) => handleBlur('max', e.target.value)}
              placeholder={t('filters.to')}
              className="price-input"
            />
          </div>
          <span>
            {t('filters.from')} {filters.priceRange[0]} {t('filters.to')} {filters.priceRange[1]} ₽
          </span>
        </div>
        <div className="filter-group">
          <label>{t('filters.brand')}:</label>
          <select
            onChange={(e) => {
              const newFilters = { ...filters, brand: e.target.value };
              setFilters(newFilters);
              onFilterChange(newFilters);
            }}
            value={filters.brand}
          >
            {filters.brands.length > 0 ? (
              <>
                <option value="all">{t('filters.all')}</option>
                {filters.brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </>
            ) : (
              <option value="all">{t('filters.all')}</option>
            )}
          </select>
        </div>
        {(isSearchPage || isAdminPage) && (
          <>
            <div className="filter-group">
              <label>{t('filters.category')}:</label>
              <select onChange={(e) => handleCategoryChange(e.target.value)} value={filters.category}>
                {filters.categories.length > 0 ? (
                  <>
                    <option value="all">{t('filters.all')}</option>
                    {filters.categories.map((category) => (
                      <option key={category} value={category}>
                        {t(`category.${category}`)}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="all">{t('filters.all')}</option>
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
                {availableSubcategories.length > 0 ? (
                  <>
                    <option value="all">{t('filters.all')}</option>
                    {availableSubcategories.map((subcategory) => (
                      <option key={subcategory} value={subcategory}>
                        {t(`subcategory.${filters.category}.${subcategory}`)}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="all">{t('filters.all')}</option>
                )}
              </select>
            </div>
          </>
        )}
      </div>
      <div className="filter-block">
        <div className="specs-filter-section">
          <h3
            className="specs-title"
            onClick={() => setShowSpecs(!showSpecs)}
            style={{ cursor: 'pointer' }}
          >
            {t('filters.specifications')}
          </h3>
          {showSpecs && (
            <>
              {displayedSpecKeys.length > 0 ? (
                displayedSpecKeys.map((specKey) => {
                  const specValues = filters.specs[specKey];
                  const valuesArray = Object.entries(specValues).filter(([_, { count }]) => count > 0);
                  if (valuesArray.length === 0) return null;

                  const isExpanded = expandedSpecs[specKey];
                  const displayedValues = isExpanded ? valuesArray : valuesArray.slice(0, VALUES_LIMIT);
                  const hasMore = valuesArray.length > VALUES_LIMIT;

                  return (
                    <div key={specKey} className="spec-group">
                      <h4>{t(`specs.${specKey}`) || specKey}</h4>
                      <div className="spec-options">
                        {displayedValues.map(([value, { count }]) => (
                          <label key={value} className="spec-option">
                            <input
                              type="checkbox"
                              checked={filters.selectedSpecs[specKey]?.[value] || false}
                              onChange={(e) => handleSpecChange(specKey, value, e.target.checked)}
                            />
                            <span>
                              {value} ({count})
                            </span>
                          </label>
                        ))}
                      </div>
                      {hasMore && (
                        <button
                          className="show-more-button"
                          onClick={() => toggleExpandSpecs(specKey)}
                        >
                          {isExpanded ? t('filters.showLess') : t('filters.showMore')}
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>{t('filters.noSpecs')}</p>
              )}
              {hasMoreSpecs && (
                <button className="show-more-button" onClick={toggleShowMoreSpecs}>
                  {showMoreSpecs ? t('filters.showLess') : t('filters.showMore')}
                </button>
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