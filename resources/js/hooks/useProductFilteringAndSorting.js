import { useState, useEffect } from 'react';

const useProductFilteringAndSorting = (
  initialProducts = [],
  initialSortOption = { field: 'name', direction: 'asc' },
  isSearchPage = false,
  isAdminPage = false
) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState(initialSortOption);

  const sortProducts = (products) => {
    return [...products].sort((a, b) => {
      let valueA, valueB;
      if (sortOption.field === 'price') {
        valueA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
        valueB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
      } else {
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
      }
      if (valueA < valueB) return sortOption.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOption.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleFilterChange = (newFilters) => {
    let filtered = initialProducts.filter((product) => {
      const price = Number(product.price);
      const discountPrice = product.discount ? price * (1 - product.discount / 100) : price;
      if (newFilters.priceRange && (discountPrice < newFilters.priceRange[0] || discountPrice > newFilters.priceRange[1])) {
        return false;
      }
      if (newFilters.brand !== 'all' && product.brand !== newFilters.brand) {
        return false;
      }
      if ((isSearchPage || isAdminPage) && newFilters.category !== 'all' && product.category !== newFilters.category) {
        return false;
      }
      if ((isSearchPage || isAdminPage) && newFilters.subcategory !== 'all' && product.subcategory !== newFilters.subcategory) {
        return false;
      }
      if (product.specs && typeof product.specs === 'object' && product.specs !== null) {
        for (const [specKey, specFilter] of Object.entries(newFilters.selectedSpecs)) {
          const productValue = product.specs[specKey];
          if (productValue !== undefined) {
            const strValue = String(productValue);
            if (specFilter[strValue] === false) {
              return false;
            }
          }
        }
      }
      return true;
    });

    filtered = sortProducts(filtered);
    setFilteredProducts(filtered);
  };

  const handleSortChange = (field, direction) => {
    setSortOption({ field, direction });
  };

useEffect(() => {
  if (initialProducts && initialProducts.length > 0) {
    // Применяем фильтры по умолчанию (все товары показываем)
    const defaultFilters = {
      priceRange: [0, Infinity],
      brand: 'all',
      category: 'all', 
      subcategory: 'all',
      selectedSpecs: {}
    };
    handleFilterChange(defaultFilters);
  }
}, [initialProducts]);

useEffect(() => {
  if (filteredProducts.length > 0) {
    const sorted = sortProducts(filteredProducts);
    setFilteredProducts(sorted);
  }
}, [sortOption]);

  return {
    filteredProducts,
    sortOption,
    handleFilterChange,
    handleSortChange,
  };
};

export default useProductFilteringAndSorting;