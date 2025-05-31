// // components/ProductFilter.jsx
// import { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import useProductFilter from '../../../hooks/useProductFilter';
// import '../../../../css/components/Filter.css';
// import '../../../../css/components/FilterNew.css';
// import Button from '../../UI/Button';
// import { useTranslation } from 'react-i18next';


// export const ProductFilter = ({ 
//   products, 
//   filteredProducts,
//   initialProducts,
//   onFilterChange, 
//   onSortChange, 
//   sortOption = { field: 'name', direction: 'asc' } ,// Добавляем значение по умолчанию
// }) => {
//   const { t } = useTranslation();
//   const { filters, setFilters } = useProductFilter(filteredProducts || products);
//   const location = useLocation();
//   const isSearchPage = location.pathname.startsWith('/search');
//   const [showSpecs, setShowSpecs] = useState(false); // Состояние для показа/скрытия

//   const handleSpecChange = (specKey, specValue, checked) => {
//     const newFilters = {
//       ...filters,
//       specs: {
//         ...filters.specs,
//         [specKey]: {
//           ...(filters.specs[specKey] || {}),
//           [specValue]: checked
//         }
//       }
//     };
//     setFilters(newFilters);
//     onFilterChange(newFilters);
//   };

//     // Добавляем обработчик сортировки
//     const handleSortFieldChange = (e) => {
//       const field = e.target.value;
//       onSortChange(field, sortOption.direction);
//     };
  
//     const handleSortDirectionChange = (e) => {
//       const direction = e.target.value;
//       onSortChange(sortOption.field, direction);
//     };

//   const handlePriceChange = (type, value) => {
//     const parsedValue = value === '' ? 0 : parseInt(value);
//     let newMin = filters.priceRange[0];
//     let newMax = filters.priceRange[1];

//     if (type === 'min') {
//       newMin = isNaN(parsedValue) ? 0 : Math.max(0, parsedValue);
//       newMax = Math.max(newMin, filters.priceRange[1]);
//     } else {
//       newMax = isNaN(parsedValue) ? filters.priceRange[1] : Math.max(newMin, parsedValue);
//     }

//     const newFilters = { ...filters, priceRange: [newMin, newMax] };
//     setFilters(newFilters);
//     onFilterChange(newFilters);
//   };

//   const handleBlur = (type, value) => {
//     if (value === '') {
//       handlePriceChange(type, type === 'min' ? '0' : filters.priceRange[1].toString());
//     }
//   };

//   const handleCategoryChange = (value) => {
//     const newFilters = {
//       ...filters,
//       category: value,
//       subcategory: 'all', // Сбрасываем подкатегорию при смене категории
//     };
//     setFilters(newFilters);
//     onFilterChange(newFilters);
//   };

//   const handleSubcategoryChange = (value) => {
//     const newFilters = { ...filters, subcategory: value };
//     setFilters(newFilters);
//     onFilterChange(newFilters);
//   };
//   const handleResetFilters = () => {
//     if (!initialProducts) {
//       console.error('initialProducts is not defined');
//       return;
//     }

//     const maxPrice = initialProducts?.length > 0 
//       ? Math.ceil(Math.max(...initialProducts.map(p => p.price)) / 1000) * 1000 
//       : 100000;

//     // Собираем все возможные характеристики
//     const allSpecs = {};
//     initialProducts.forEach(product => {
//       if (product.specs) {
//         Object.entries(product.specs).forEach(([key, value]) => {
//           if (!allSpecs[key]) allSpecs[key] = {};
//           allSpecs[key][String(value)] = true;
//         });
//       }
//     });

//     const newFilters = {
//       ...filters,
//       priceRange: [0, maxPrice],
//       brand: 'all',
//       category: 'all',
//       subcategory: 'all',
//       specs: allSpecs
//     };

//     setFilters(newFilters);
//     onFilterChange(newFilters);
//   };


//   // Фильтруем подкатегории в зависимости от выбранной категории
//   const availableSubcategories = filters.category === 'all'
//     ? filters.subcategories
//     : products
//         .filter((product) => product.category === filters.category)
//         .map((product) => product.subcategory)
//         .filter((value, index, self) => self.indexOf(value) === index)
//         .sort();

//   return (
//     <div className="filters">
//       <h3>{t('sort.mainTitle')}</h3>
//       {/* Добавляем блок сортировки */}
//       <div className="filter-block">
//       <div className="filter-group">
//         <label>{t('sort.sortBy')}:</label>
//           <select 
//             value={sortOption.field} 
//             onChange={handleSortFieldChange}
//             className="sort-select"
//           >
//             <option value="name">{t('sort.byName')}</option>
//             <option value="price">{t('sort.byPrice')}</option>
//           </select>
//         </div>
//           <div className="filter-group">
//           <label>{t('sort.direction')}:</label>
//           <select 
//             value={sortOption.direction} 
//             onChange={handleSortDirectionChange}
//             className="sort-select"
//           >
//             <option value="asc">{t('sort.asc')}</option>
//             <option value="desc">{t('sort.desc')}</option>
//           </select>
//       </div>
//       </div>
//       <div className="filter-block">
//       <h3>{t('filters.mainTitle')}</h3>
//       <div className="filter-group">
//         <label>{t('filters.price')}:</label>
//         <div className="price-inputs">
//           <input
//             type="number"
//             min="0"
//             value={filters.priceRange[0]}
//             onChange={(e) => handlePriceChange('min', e.target.value)}
//             onBlur={(e) => handleBlur('min', e.target.value)}
//             placeholder="{t('filters.from')}"
//             className="price-input"
//           />
//           <span>—</span>
//           <input
//             type="number"
//             min={filters.priceRange[0]}
//             value={filters.priceRange[1]}
//             onChange={(e) => handlePriceChange('max', e.target.value)}
//             onBlur={(e) => handleBlur('max', e.target.value)}
//             placeholder="{t('filters.to')}"
//             className="price-input"
//           />
//         </div>
//         <span>{t('filters.from')} {filters.priceRange[0]} {t('filters.to')} {filters.priceRange[1]} ₽</span>
//       </div>
//       <div className="filter-group">
//         <label>{t('filters.brand')}:</label>
//         <select
//           onChange={(e) => {
//             const newFilters = { ...filters, brand: e.target.value };
//             setFilters(newFilters);
//             onFilterChange(newFilters);
//           }}
//           value={filters.brand}
//         >
//           <option value="all">{t('filters.all')}</option>
//           {filters.brands.map((brand) => (
//             <option key={brand} value={brand}>
//               {brand}
//             </option>
//           ))}
//         </select>
//       </div>
//       {isSearchPage && (
//         <>
//           <div className="filter-group">
//             <label>{t('filters.category')}:</label>
//             <select
//               onChange={(e) => handleCategoryChange(e.target.value)}
//               value={filters.category}
//             >
//               <option value="all">{t('filters.all')}</option>
//               {filters.categories.map((category) => (
//                 <option key={category} value={category}>
//                   {t(`category.${category}`)}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="filter-group">
//             <label>{t('filters.subcategory')}:</label>
//             <select
//               onChange={(e) => handleSubcategoryChange(e.target.value)}
//               value={filters.subcategory}
//               disabled={filters.category === 'all' || availableSubcategories.length === 0}
//             >
//               <option value="all">{t('filters.all')}</option>
//               {availableSubcategories.map((subcategory) => (
//                 <option key={subcategory} value={subcategory}>
//                   {t(`subcategory.${filters.category}.${subcategory}`)}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </>
//       )}
//       </div>
// {/* Блок характеристик */}
// <div className="filter-block">
// <div className="specs-filter-section">
//   <h3 
//     className="specs-title" 
//     onClick={() => setShowSpecs(!showSpecs)}
//     style={{cursor: 'pointer'}}
//   >
//     {t('filters.specifications')}
//   </h3>
  
//   {showSpecs && (
//     <>
//       {Object.entries(filters.specs || {}).map(([specKey, specValues]) => (
//         <div key={specKey} className="spec-group">
//           <h4>{t(`specs.${specKey}`)}</h4>
//           <div className="spec-options">
//             {Object.entries(specValues).map(([value, isChecked]) => (
//               <label key={value} className="spec-option">
//                 <input
//                   type="checkbox"
//                   checked={isChecked !== false}
//                   onChange={(e) => handleSpecChange(specKey, value, e.target.checked)}
//                 />
//                 <span>{value}</span>
//               </label>
//             ))}
//           </div>
//         </div>
//       ))}
//     </>
//   )}
// </div>
// </div>
//       {/* <div className="filter-group"> */}
//         <Button className="reset-button" onClick={handleResetFilters}>
//         {t('filters.reset')}
//         </Button>
//       {/* </div> */}
//     </div>
//   );
// };


// import { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import useProductFilter from '../../../hooks/useProductFilter';
// import '../../../../css/components/Filter.css';
// import '../../../../css/components/FilterNew.css';
// import Button from '../../UI/Button';
// import { useTranslation } from 'react-i18next';

// export const ProductFilter = ({ 
//   initialProducts = [],
//   filteredByMainFilters = [],
//   filteredProducts = [],
//   onFilterChange, 
//   onSortChange, 
//   sortOption = { field: 'name', direction: 'asc' }
// }) => {
//   const { t } = useTranslation();
//   const { filters, setFilters } = useProductFilter(initialProducts, filteredByMainFilters);
//   const location = useLocation();
//   const isSearchPage = location.pathname.startsWith('/search');
//   const [showSpecs, setShowSpecs] = useState(false);
//   const [expandedSpecs, setExpandedSpecs] = useState({});

//   const VALUES_LIMIT = 5;

//   const handleSpecChange = (specKey, specValue, checked) => {
//     console.log(`handleSpecChange: ${specKey} = ${specValue}, checked = ${checked}`);
//     const newSelectedSpecs = {
//       ...filters.selectedSpecs,
//       [specKey]: {
//         ...(filters.selectedSpecs[specKey] || {}),
//         [specValue]: checked
//       }
//     };

//     const newFilters = {
//       ...filters,
//       selectedSpecs: newSelectedSpecs
//     };

//     setFilters(newFilters);
//     onFilterChange(newFilters);
//   };

//   const handleSortFieldChange = (e) => {
//     const field = e.target.value;
//     onSortChange(field, sortOption.direction);
//   };

//   const handleSortDirectionChange = (e) => {
//     const direction = e.target.value;
//     onSortChange(sortOption.field, direction);
//   };

//   const handlePriceChange = (type, value) => {
//     console.log(`handlePriceChange: ${type} = ${value}`);
//     const parsedValue = value === '' ? (type === 'min' ? 0 : filters.priceRange[1]) : parseInt(value, 10);
//     let newMin = filters.priceRange[0];
//     let newMax = filters.priceRange[1];

//     if (type === 'min') {
//       newMin = isNaN(parsedValue) ? 0 : Math.max(0, parsedValue);
//       newMax = Math.max(newMin, newMax);
//     } else {
//       newMax = isNaN(parsedValue) ? newMax : Math.max(newMin, parsedValue);
//     }

//     const newFilters = { ...filters, priceRange: [newMin, newMax] };
//     console.log('handlePriceChange: New priceRange', newFilters.priceRange);
//     setFilters(newFilters);
//     onFilterChange(newFilters);
//   };

//   const handleBlur = (type, value) => {
//     console.log(`handleBlur: ${type} = ${value}`);
//     if (value === '') {
//       handlePriceChange(type, type === 'min' ? '0' : filters.priceRange[1].toString());
//     }
//   };

//   const handleCategoryChange = (value) => {
//     const newFilters = {
//       ...filters,
//       category: value,
//       subcategory: 'all',
//     };
//     setFilters(newFilters);
//     onFilterChange(newFilters);
//   };

//   const handleSubcategoryChange = (value) => {
//     const newFilters = { ...filters, subcategory: value };
//     setFilters(newFilters);
//     onFilterChange(newFilters);
//   };

//   const handleResetFilters = () => {
//     if (!initialProducts.length) {
//       console.error('initialProducts is empty');
//       return;
//     }

//     const maxPrice = initialProducts.length > 0 
//       ? Math.ceil(Math.max(...initialProducts.map(p => Number(p.price) || 0)) / 1000) * 1000 
//       : 100000;

//     const allSpecs = {};
//     initialProducts.forEach(product => {
//       if (product.specs && typeof product.specs === 'object' && product.specs !== null) {
//         Object.entries(product.specs).forEach(([key, value]) => {
//           if (key && value) {
//             if (!allSpecs[key]) allSpecs[key] = {};
//             allSpecs[key][String(value)] = { count: 0, selected: true };
//           }
//         });
//       }
//     });

//     const newFilters = {
//       priceRange: [0, maxPrice],
//       brand: 'all',
//       category: 'all',
//       subcategory: 'all',
//       brands: filters.brands,
//       categories: filters.categories,
//       subcategories: filters.subcategories,
//       specs: allSpecs,
//       selectedSpecs: {}
//     };

//     setFilters(newFilters);
//     onFilterChange(newFilters);
//     setExpandedSpecs({});
//   };

//   const toggleExpandSpecs = (specKey) => {
//     setExpandedSpecs(prev => ({
//       ...prev,
//       [specKey]: !prev[specKey]
//     }));
//   };

//   const availableSubcategories = filters.category === 'all'
//     ? filters.subcategories
//     : initialProducts
//         .filter((product) => product.category === filters.category)
//         .map((product) => product.subcategory)
//         .filter((value, index, self) => value && self.indexOf(value) === index)
//         .sort();

//   return (
//     <div className="filters">
//       <div className="filter-block">
//         <h3>{t('sort.mainTitle')}</h3>
//         <div className="filter-group">
//           <label>{t('sort.sortBy')}:</label>
//           <select 
//             value={sortOption.field} 
//             onChange={handleSortFieldChange}
//             className="sort-select"
//           >
//             <option value="name">{t('sort.byName')}</option>
//             <option value="price">{t('sort.byPrice')}</option>
//           </select>
//         </div>
//         <div className="filter-group">
//           <label>{t('sort.direction')}:</label>
//           <select 
//             value={sortOption.direction} 
//             onChange={handleSortDirectionChange}
//             className="sort-select"
//           >
//             <option value="asc">{t('sort.asc')}</option>
//             <option value="desc">{t('sort.desc')}</option>
//           </select>
//         </div>
//       </div>
//       <div className="filter-block">
//         <h3>{t('filters.mainTitle')}</h3>
//         <div className="filter-group">
//           <label>{t('filters.price')}:</label>
//           <div className="price-inputs">
//             <input
//               type="number"
//               min="0"
//               value={filters.priceRange[0]}
//               onChange={(e) => handlePriceChange('min', e.target.value)}
//               onBlur={(e) => handleBlur('min', e.target.value)}
//               placeholder={t('filters.from')}
//               className="price-input"
//             />
//             <span>—</span>
//             <input
//               type="number"
//               min={filters.priceRange[0]}
//               value={filters.priceRange[1]}
//               onChange={(e) => handlePriceChange('max', e.target.value)}
//               onBlur={(e) => handleBlur('max', e.target.value)}
//               placeholder={t('filters.to')}
//               className="price-input"
//             />
//           </div>
//           <span>{t('filters.from')} {filters.priceRange[0]} {t('filters.to')} {filters.priceRange[1]} ₽</span>
//         </div>
//         <div className="filter-group">
//           <label>{t('filters.brand')}:</label>
//           <select
//             onChange={(e) => {
//               const newFilters = { ...filters, brand: e.target.value };
//               setFilters(newFilters);
//               onFilterChange(newFilters);
//             }}
//             value={filters.brand}
//           >
//             <option value="all">{t('filters.all')}</option>
//             {filters.brands.length > 0 ? (
//               filters.brands.map((brand) => (
//                 <option key={brand} value={brand}>
//                   {brand}
//                 </option>
//               ))
//             ) : (
//               <option disabled>{t('filters.noBrands')}</option>
//             )}
//           </select>
//         </div>
//         {isSearchPage && (
//           <>
//             <div className="filter-group">
//               <label>{t('filters.category')}:</label>
//               <select
//                 onChange={(e) => handleCategoryChange(e.target.value)}
//                 value={filters.category}
//               >
//                 <option value="all">{t('filters.all')}</option>
//                 {filters.categories.length > 0 ? (
//                   filters.categories.map((category) => (
//                     <option key={category} value={category}>
//                       {t(`category.${category}`)}
//                     </option>
//                   ))
//                 ) : (
//                   <option disabled>{t('filters.noCategories')}</option>
//                 )}
//               </select>
//             </div>
//             <div className="filter-group">
//               <label>{t('filters.subcategory')}:</label>
//               <select
//                 onChange={(e) => handleSubcategoryChange(e.target.value)}
//                 value={filters.subcategory}
//                 disabled={filters.category === 'all' || availableSubcategories.length === 0}
//               >
//                 <option value="all">{t('filters.all')}</option>
//                 {availableSubcategories.length > 0 ? (
//                   availableSubcategories.map((subcategory) => (
//                     <option key={subcategory} value={subcategory}>
//                       {t(`subcategory.${filters.category}.${subcategory}`)}
//                     </option>
//                   ))
//                 ) : (
//                   <option disabled>{t('filters.noSubcategories')}</option>
//                 )}
//               </select>
//             </div>
//           </>
//         )}
//       </div>
//       <div className="filter-block">
//         <div className="specs-filter-section">
//           <h3 
//             className="specs-title" 
//             onClick={() => setShowSpecs(!showSpecs)}
//             style={{ cursor: 'pointer' }}
//           >
//             {t('filters.specifications')}
//           </h3>
          
//           {showSpecs && (
//             <>
//               {Object.keys(filters.specs).length > 0 ? (
//                 Object.entries(filters.specs).map(([specKey, specValues]) => {
//                   const valuesArray = Object.entries(specValues).filter(([_, { count }]) => count > 0);
//                   if (valuesArray.length === 0) return null;

//                   const isExpanded = expandedSpecs[specKey];
//                   const displayedValues = isExpanded ? valuesArray : valuesArray.slice(0, VALUES_LIMIT);
//                   const hasMore = valuesArray.length > VALUES_LIMIT;

//                   return (
//                     <div key={specKey} className="spec-group">
//                       <h4>{t(`specs.${specKey}`) || specKey}</h4>
//                       <div className="spec-options">
//                         {displayedValues.map(([value, { count, selected }]) => (
//                           <label 
//                             key={value} 
//                             className="spec-option"
//                           >
//                             <input
//                               type="checkbox"
//                               checked={selected}
//                               onChange={(e) => handleSpecChange(specKey, value, e.target.checked)}
//                             />
//                             <span>{value} ({count})</span>
//                           </label>
//                         ))}
//                       </div>
//                       {hasMore && (
//                         <button
//                           className="show-more-button"
//                           onClick={() => toggleExpandSpecs(specKey)}
//                         >
//                           {isExpanded ? t('filters.showLess') || 'Показать меньше' : t('filters.showMore') || 'Показать больше'}
//                         </button>
//                       )}
//                     </div>
//                   );
//                 })
//               ) : (
//                 <p>{t('filters.noSpecs') || 'Характеристики не найдены'}</p>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//       <Button className="reset-button" onClick={handleResetFilters}>
//         {t('filters.reset')}
//       </Button>
//     </div>
//   );
// };

import { useState } from 'react';
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
  sortOption = { field: 'name', direction: 'asc' }
}) => {
  const { t } = useTranslation();
  const { filters, setFilters } = useProductFilter(initialProducts, filteredByMainFilters);
  const location = useLocation();
  const isSearchPage = location.pathname.startsWith('/search');
  const [showSpecs, setShowSpecs] = useState(false); // Изначально свернуто
  const [expandedSpecs, setExpandedSpecs] = useState({}); // Состояние для раскрытия значений

  const VALUES_LIMIT = 5; // Ограничение на количество отображаемых значений

  const handleSpecChange = (specKey, specValue, checked) => {
    const newSelectedSpecs = {
      ...filters.selectedSpecs,
      [specKey]: {
        ...(filters.selectedSpecs[specKey] || {}),
        [specValue]: checked
      }
    };

    const newFilters = {
      ...filters,
      selectedSpecs: newSelectedSpecs
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
      ? Math.ceil(Math.max(...initialProducts.map(p => Number(p.price) || 0)) / 1000) * 1000 
      : 100000;

    const allSpecs = {};
    initialProducts.forEach(product => {
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
      selectedSpecs: {}
    };

    setFilters(newFilters);
    onFilterChange(newFilters);
    setExpandedSpecs({});
  };

  const toggleExpandSpecs = (specKey) => {
    setExpandedSpecs(prev => ({
      ...prev,
      [specKey]: !prev[specKey]
    }));
  };

  const availableSubcategories = filters.category === 'all'
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
          <select 
            value={sortOption.field} 
            onChange={handleSortFieldChange}
            className="sort-select"
          >
            <option value="name">{t('sort.byName')}</option>
            <option value="price">{t('sort.byPrice')}</option>
          </select>
        </div>
        <div className="filter-group">
          <label>{t('sort.direction')}:</label>
          <select 
            value={sortOption.direction} 
            onChange={handleSortDirectionChange}
            className="sort-select"
          >
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
        {isSearchPage && (
          <>
            <div className="filter-group">
              <label>{t('filters.category')}:</label>
              <select
                onChange={(e) => handleCategoryChange(e.target.value)}
                value={filters.category}
              >
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
                onChange={(e) => handleSubcategoryChange(e.target.value)}
                value={filters.subcategory}
                disabled={filters.category === 'all' || availableSubcategories.length === 0}
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
              {Object.keys(filters.specs).length > 0 ? (
                Object.entries(filters.specs).map(([specKey, specValues]) => {
                  const valuesArray = Object.entries(specValues).filter(([_, { count }]) => count > 0);
                  if (valuesArray.length === 0) return null; // Пропускаем характеристику, если нет товаров

                  const isExpanded = expandedSpecs[specKey];
                  const displayedValues = isExpanded ? valuesArray : valuesArray.slice(0, VALUES_LIMIT);
                  const hasMore = valuesArray.length > VALUES_LIMIT;

                  return (
                    <div key={specKey} className="spec-group">
                      <h4>{t(`specs.${specKey}`) || specKey}</h4>
                      <div className="spec-options">
                        {displayedValues.map(([value, { count, selected }]) => (
                          <label 
                            key={value} 
                            className="spec-option"
                          >
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={(e) => handleSpecChange(specKey, value, e.target.checked)}
                            />
                            <span>{value} ({count})</span>
                          </label>
                        ))}
                      </div>
                      {hasMore && (
                        <button
                          className="show-more-button"
                          onClick={() => toggleExpandSpecs(specKey)}
                        >
                          {isExpanded ? t('filters.showLess') || 'Показать меньше' : t('filters.showMore') || 'Показать больше'}
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>{t('filters.noSpecs') || 'Характеристики не найдены'}</p>
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