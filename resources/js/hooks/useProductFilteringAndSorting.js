import { useState, useEffect } from 'react';

const useProductFilteringAndSorting = (products, initialSortOption, isAdminPage) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortOption, setSortOption] = useState(initialSortOption);
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    console.log('useProductFilteringAndSorting: Products changed:', products);
    console.log('useProductFilteringAndSorting: Filters:', filters);
    console.log('useProductFilteringAndSorting: Sort option:', sortOption);

    // Применяем фильтры и сортировку
    let result = [...products];

    if (filters) {
      result = result.filter(product => {
        // Фильтрация по поисковому запросу
        const matchesSearch = filters.searchQuery
          ? product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
          : true;

        // Фильтрация по категории
        const matchesCategory = filters.category && filters.category !== 'all'
          ? product.category === filters.category
          : true;

        // Фильтрация по подкатегории
        const matchesSubcategory = filters.subcategory && filters.subcategory !== 'all'
          ? product.subcategory === filters.subcategory
          : true;

        // Фильтрация по бренду
        const matchesBrand = filters.brand && filters.brand !== 'all'
          ? product.brand === filters.brand
          : true;

        // Фильтрация по цене
        const price = Number(product.price) || 0;
        const discountPrice = product.discount ? price * (1 - product.discount / 100) : price;
        const matchesPrice = discountPrice >= filters.priceRange[0] && discountPrice <= filters.priceRange[1];

        // Фильтрация по характеристикам (specs)
        let matchesSpecs = true;
        if (filters.selectedSpecs && product.specs && typeof product.specs === 'object') {
          for (const [key, values] of Object.entries(filters.selectedSpecs)) {
            if (product.specs[key]) {
              const productSpecValue = String(product.specs[key]);
              if (values[productSpecValue] === false) {
                matchesSpecs = false; // Если характеристика не выбрана, исключаем товар
                break;
              }
            }
          }
        }

        return matchesSearch && matchesCategory && matchesSubcategory && matchesBrand && matchesPrice && matchesSpecs;
      });
    }

    // Применяем сортировку
    result.sort((a, b) => {
      const field = sortOption.field;
      const direction = sortOption.direction === 'asc' ? 1 : -1;
      if (field === 'name') {
        return a.name.localeCompare(b.name) * direction;
      } else if (field === 'price') {
        return (a.price - b.price) * direction;
      }
      return 0;
    });

    setFilteredProducts(result);
  }, [products, filters, sortOption]);

  const handleFilterChange = (newFilters) => {
    console.log('useProductFilteringAndSorting: Applying filters:', newFilters);
    setFilters(newFilters);
  };

  const handleSortChange = (field, direction) => {
    console.log('useProductFilteringAndSorting: Applying sort:', { field, direction });
    setSortOption({ field, direction });
  };

  return {
    filteredProducts,
    sortOption,
    handleFilterChange,
    handleSortChange,
  };
};

export default useProductFilteringAndSorting;