// components/ProductFilter.jsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useProductFilter from '../../../hooks/useProductFilter';
import '../../../../css/components/Filter.css';
import { useTranslation } from 'react-i18next';


export const ProductFilter = ({ products, onFilterChange }) => {
  const { t } = useTranslation();
  const { filters, setFilters } = useProductFilter(products);
  const location = useLocation();
  const isSearchPage = location.pathname.startsWith('/search');

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
      subcategory: 'all', // Сбрасываем подкатегорию при смене категории
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
    const maxPrice = products?.length > 0 ? Math.ceil(Math.max(...products.map((p) => p.price)) / 1000) * 1000 : 100000;
    const newFilters = {
      priceRange: [0, maxPrice],
      brand: 'all',
      category: 'all',
      subcategory: 'all',
      brands: filters.brands,
      categories: filters.categories,
      subcategories: filters.subcategories,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Фильтруем подкатегории в зависимости от выбранной категории
  const availableSubcategories = filters.category === 'all'
    ? filters.subcategories
    : products
        .filter((product) => product.category === filters.category)
        .map((product) => product.subcategory)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort();

  return (
    <div className="filters">
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
            placeholder="{t('filters.from')}"
            className="price-input"
          />
          <span>—</span>
          <input
            type="number"
            min={filters.priceRange[0]}
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange('max', e.target.value)}
            onBlur={(e) => handleBlur('max', e.target.value)}
            placeholder="{t('filters.to')}"
            className="price-input"
          />
        </div>
        <span>{t('filters.from')} {filters.priceRange[0]} {t('filters.to')} {filters.priceRange[1]} ₽</span>
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
          <option value="all">{t('filters.all')}</option>
          {filters.brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>
      {isSearchPage && (
        <>
          <div className="filter-group">
            <label>{t('filters.category')}:</label>
            <select
              onChange={(e) => handleCategoryChange(e.target.value)}
              value={filters.category}
            >
              <option value="all">{t('filters.all')}</option>
              {filters.categories.map((category) => (
                <option key={category} value={category}>
                  {t(`category.${category}`)}
                </option>
              ))}
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
              {availableSubcategories.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {t(`subcategory.${filters.category}.${subcategory}`)}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
      <div className="filter-group">
        <button className="reset-button" onClick={handleResetFilters}>
        {t('filters.reset')}
        </button>
      </div>
    </div>
  );
};