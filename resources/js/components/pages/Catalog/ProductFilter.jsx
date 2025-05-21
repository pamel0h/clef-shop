// import { useState, useEffect } from 'react';

// export const ProductFilter = ({ products, onFilterChange }) => {
//   const [filters, setFilters] = useState({
//     priceRange: [0, 100000],
//     brand: 'all',
//   });

//   useEffect(() => {
//     if (products.length > 0) {
//       const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
//       setFilters(prev => ({
//         ...prev,
//         brands: brands,
//       }));
//     }
//   }, [products]);

//   const handleChange = (filterName, value) => {
//     const newFilters = { ...filters, [filterName]: value };
//     setFilters(newFilters);
//     onFilterChange(newFilters);
//   };

//   return (
//     <div className="filters">
//       <h3>Фильтры</h3>
//       <div className="filter-group">
//         <label>Цена:</label>
//         <input 
//           type="range" 
//           min="0" 
//           max="100000" 
//           value={filters.priceRange[1]} 
//           onChange={(e) => handleChange('priceRange', [0, parseInt(e.target.value)])}
//         />
//         <span>до {filters.priceRange[1]} ₽</span>
//       </div>
//       <div className="filter-group">
//         <label>Бренд:</label>
//         <select 
//           onChange={(e) => handleChange('brand', e.target.value)}
//           value={filters.brand}
//         >
//           <option value="all">Все</option>
//           {filters.brands?.map(brand => (
//             <option key={brand} value={brand}>
//               {brand}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// };

import '../../../../css/components/Filter.css';
import { useState, useEffect } from 'react';

export const ProductFilter = ({ products, onFilterChange }) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    brand: 'all',
    brands: [],
  });

  useEffect(() => {
    if (products.length > 0) {
      const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
      const maxPrice = Math.max(...products.map(p => p.price)) || 100000;
      const roundedMaxPrice = Math.ceil(maxPrice / 1000) * 1000;

      setFilters(prev => ({
        ...prev,
        brands,
        priceRange: [0, roundedMaxPrice],
      }));
    } else {
      setFilters({
        priceRange: [0, 100000],
        brand: 'all',
        brands: [],
      });
    }
  }, [products]);

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

  return (
    <div className="filters">
      <h3>Фильтры</h3>
      <div className="filter-group">
        <label>Цена:</label>
        <div className="price-inputs">
          <input
            type="number"
            min="0"
            value={filters.priceRange[0]}
            onChange={(e) => handlePriceChange('min', e.target.value)}
            onBlur={(e) => handleBlur('min', e.target.value)}
            placeholder="От"
            className="price-input"
          />
          <span>—</span>
          <input
            type="number"
            min={filters.priceRange[0]}
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange('max', e.target.value)}
            onBlur={(e) => handleBlur('max', e.target.value)}
            placeholder="До"
            className="price-input"
          />
        </div>
        <span>от {filters.priceRange[0]} до {filters.priceRange[1]} ₽</span>
      </div>
      <div className="filter-group">
        <label>Бренд:</label>
        <select
          onChange={(e) => {
            const newFilters = { ...filters, brand: e.target.value };
            setFilters(newFilters);
            onFilterChange(newFilters);
          }}
          value={filters.brand}
        >
          <option value="all">Все</option>
          {filters.brands.map(brand => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};