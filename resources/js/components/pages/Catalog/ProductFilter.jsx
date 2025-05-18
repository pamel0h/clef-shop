// components/Catalog/ProductFilters.jsx
import { useState, useEffect } from 'react';

export const ProductFilter = ({ products, onFilterChange }) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    inStock: false,
    // Динамические характеристики
    dynamicFilters: {}
  });

  // Автоматически определяем доступные характеристики
  useEffect(() => {
    if (products.length > 0) {
      const dynamicFilters = {};
      
      // Собираем все уникальные характеристики товаров
      products.forEach(product => {
        Object.keys(product).forEach(key => {
          if (!['id', 'name', 'price', 'discount'].includes(key)) {
            dynamicFilters[key] = dynamicFilters[key] || new Set();
            dynamicFilters[key].add(product[key]);
          }
        });
      });

      setFilters(prev => ({
        ...prev,
        dynamicFilters: Object.fromEntries(
          Object.entries(dynamicFilters).map(([key, values]) => 
            [key, Array.from(values)]
        ))
      }));
    }
  }, [products]);

  const handleChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="filters">
      <h3>Фильтры</h3>
      
      {/* Общие фильтры */}
      <div className="filter-group">
        <label>Цена:</label>
        <input 
          type="range" 
          min="0" 
          max="100000" 
          value={filters.priceRange[1]} 
          onChange={(e) => handleChange('priceRange', [0, parseInt(e.target.value)])}
        />
        <span>до {filters.priceRange[1]} ₽</span>
      </div>

      {/* Динамические фильтры */}
      {Object.entries(filters.dynamicFilters).map(([key, values]) => (
        <div key={key} className="filter-group">
          <label>{key}:</label>
          <select 
            onChange={(e) => handleChange(key, e.target.value)}
            defaultValue="all"
          >
            <option value="all">Все</option>
            {values.map(value => (
              <option key={value} value={value}>
                {value.toString()}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};