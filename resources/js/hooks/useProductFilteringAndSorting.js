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
      // Пример фильтрации
      result = result.filter(product => {
        const matchesSearch = filters.searchQuery
          ? product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
          : true;
        const matchesCategory = filters.category && filters.category !== 'all'
          ? product.category === filters.category
          : true;
        const matchesSubcategory = filters.subcategory && filters.subcategory !== 'all'
          ? product.subcategory === filters.subcategory
          : true;
        const matchesBrand = filters.brand && filters.brand !== 'all'
          ? product.brand === filters.brand
          : true;
        const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
        return matchesSearch && matchesCategory && matchesSubcategory && matchesBrand && matchesPrice;
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