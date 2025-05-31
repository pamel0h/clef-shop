// // hooks/useProductFilter.jsx
// import { useState, useEffect } from 'react';

// const useProductFilter = (products) => {
//   const [filters, setFilters] = useState({
//     priceRange: [0, 100000],
//     brand: 'all',
//     category: 'all',
//     subcategory: 'all',
//     brands: [],
//     categories: [],
//     subcategories: [],
//     specs: {} 
//   });

//   useEffect(() => {
//     console.log('useProductFilter: Processing products', products);
//     if (products?.length > 0) {
//       const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))].sort();
//       const categories = [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
//       const subcategories = [...new Set(products.map((p) => p.subcategory).filter(Boolean))].sort();
//       const maxPrice = Math.max(...products.map((p) => p.price)) || 100000;
//       const roundedMaxPrice = Math.ceil(maxPrice / 1000) * 1000;
      
//       // Собираем характеристики
//       const allSpecs = {};
    
//       products.forEach(product => {
//         if (product.specs) {
//           Object.entries(product.specs).forEach(([key, value]) => {
//             if (!allSpecs[key]) allSpecs[key] = {};
//             allSpecs[key][String(value)] = true;
//           });
//         }
//       });

//       setFilters(prev => ({
//         ...prev,
//         brands,
//         categories,
//         subcategories,
//         priceRange: [0, Math.ceil(maxPrice / 1000) * 1000],
//         specs: allSpecs
//       }));
//     }
//   }, [products]);

//   return { filters, setFilters };
// };

// export default useProductFilter;


// // import { useState, useEffect } from 'react';

// // const useProductFilter = (initialProducts, filteredByMainFilters) => {
// //   const [filters, setFilters] = useState({
// //     priceRange: [0, 0], // Изначально 0, будет обновлено
// //     brand: 'all',
// //     category: 'all',
// //     subcategory: 'all',
// //     brands: [],
// //     categories: [],
// //     subcategories: [],
// //     specs: {},
// //     selectedSpecs: {}
// //   });

// //   useEffect(() => {
// //     console.log('useProductFilter: initialProducts', JSON.stringify(initialProducts, null, 2));
// //     console.log('useProductFilter: filteredByMainFilters', JSON.stringify(filteredByMainFilters, null, 2));

// //     const brands = initialProducts?.length > 0 
// //       ? [...new Set(initialProducts.map(p => p.brand).filter(val => val && typeof val === 'string'))].sort()
// //       : [];
// //     const categories = initialProducts?.length > 0 
// //       ? [...new Set(initialProducts.map(p => p.category).filter(val => val && typeof val === 'string'))].sort()
// //       : [];
// //     const subcategories = initialProducts?.length > 0 
// //       ? [...new Set(initialProducts.map(p => p.subcategory).filter(val => val && typeof val === 'string'))].sort()
// //       : [];
// //     const maxPrice = initialProducts?.length > 0 
// //       ? Math.max(...initialProducts.map(p => Number(p.price) || 0)) || 100000
// //       : 100000;

// //     const allSpecs = {};
// //     if (filteredByMainFilters?.length > 0) {
// //       filteredByMainFilters.forEach(product => {
// //         if (product.specs && typeof product.specs === 'object' && product.specs !== null) {
// //           Object.entries(product.specs).forEach(([key, value]) => {
// //             if (key && value) {
// //               if (!allSpecs[key]) allSpecs[key] = {};
// //               allSpecs[key][String(value)] = { 
// //                 count: 0, 
// //                 selected: filters.selectedSpecs[key]?.[String(value)] ?? true 
// //               };
// //             }
// //           });
// //         }
// //       });

// //       filteredByMainFilters.forEach(product => {
// //         if (product.specs && typeof product.specs === 'object' && product.specs !== null) {
// //           Object.entries(product.specs).forEach(([key, value]) => {
// //             if (allSpecs[key] && allSpecs[key][String(value)]) {
// //               allSpecs[key][String(value)].count += 1;
// //             }
// //           });
// //         }
// //       });
// //     }

// //     console.log('useProductFilter: Computed filters', {
// //       brands,
// //       categories,
// //       subcategories,
// //       maxPrice,
// //       specs: allSpecs
// //     });

// //     setFilters(prev => ({
// //       ...prev,
// //       brands,
// //       categories,
// //       subcategories,
// //       priceRange: [prev.priceRange[0], Math.ceil(maxPrice / 1000) * 1000], // Всегда берём максимальную цену
// //       specs: allSpecs,
// //       selectedSpecs: prev.selectedSpecs
// //     }));
// //   }, [initialProducts, filteredByMainFilters]);

// //   return { filters, setFilters };
// // };

// // export default useProductFilter;

import { useState, useEffect } from 'react';

const useProductFilter = (initialProducts, filteredByMainFilters) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    brand: 'all',
    category: 'all',
    subcategory: 'all',
    brands: [],
    categories: [],
    subcategories: [],
    specs: {}, // Все возможные характеристики
    selectedSpecs: {}, // Выбранные характеристики
    initialized: false,
  });

  useEffect(() => {
    console.log('useProductFilter: initialProducts', JSON.stringify(initialProducts, null, 2));
    console.log('useProductFilter: filteredByMainFilters', JSON.stringify(filteredByMainFilters, null, 2));

    // Формируем бренды, категории и подкатегории из initialProducts
    const brands = initialProducts?.length > 0 
      ? [...new Set(initialProducts.map(p => p.brand).filter(val => val && typeof val === 'string'))].sort()
      : [];
    const categories = initialProducts?.length > 0 
      ? [...new Set(initialProducts.map(p => p.category).filter(val => val && typeof val === 'string'))].sort()
      : [];
    const subcategories = initialProducts?.length > 0 
      ? [...new Set(initialProducts.map(p => p.subcategory).filter(val => val && typeof val === 'string'))].sort()
      : [];
    const maxPrice = initialProducts?.length > 0 
      ? Math.max(...initialProducts.map(p => Number(p.price) || 0)) || 100000
      : 100000;

    // Формируем характеристики только из товаров, прошедших фильтрацию по основным фильтрам
    const allSpecs = {};
    if (filteredByMainFilters?.length > 0) {
      filteredByMainFilters.forEach(product => {
        if (product.specs && typeof product.specs === 'object' && product.specs !== null) {
          Object.entries(product.specs).forEach(([key, value]) => {
            if (key && value) {
              if (!allSpecs[key]) allSpecs[key] = {};
              allSpecs[key][String(value)] = { 
                count: 0, 
                selected: filters.selectedSpecs[key]?.[String(value)] ?? true 
              };
            }
          });
        }
      });

      // Подсчитываем количество товаров для каждого значения характеристики
      filteredByMainFilters.forEach(product => {
        if (product.specs && typeof product.specs === 'object' && product.specs !== null) {
          Object.entries(product.specs).forEach(([key, value]) => {
            if (allSpecs[key] && allSpecs[key][String(value)]) {
              allSpecs[key][String(value)].count += 1;
            }
          });
        }
      });
    }

    console.log('useProductFilter: Computed filters', {
      brands,
      categories,
      subcategories,
      maxPrice,
      specs: allSpecs
    });

    setFilters((prev) => {
// Обновляем priceRange только если фильтры еще не инициализированы
    const newPriceRange = prev.initialized
    ? prev.priceRange
    : [0, Math.ceil(maxPrice / 1000) * 1000];

    return {
    ...prev,
    brands,
    categories,
    subcategories,
    priceRange: newPriceRange,
    specs: allSpecs,
    selectedSpecs: prev.selectedSpecs,
    initialized: true, // Устанавливаем флаг после первой инициализации
    };
    });
    }, [initialProducts, filteredByMainFilters]);

  return { filters, setFilters };
};

export default useProductFilter;