import { useState, useEffect } from 'react';

export const ProductFilter = ({ products, onFilterChange }) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    brand: 'all',
  });

  useEffect(() => {
    if (products.length > 0) {
      const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
      setFilters(prev => ({
        ...prev,
        brands: brands,
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
      <div className="filter-group">
        <label>Бренд:</label>
        <select 
          onChange={(e) => handleChange('brand', e.target.value)}
          value={filters.brand}
        >
          <option value="all">Все</option>
          {filters.brands?.map(brand => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};