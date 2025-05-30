import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ProductFilter } from './ProductFilter';
import '../../../../css/components/Products.css';
import '../../../../css/components/Loading.css';

const ProductsList = ({ products: initialProducts = [], emptyMessage, isSearchPage = false, query }) => {
  const { categorySlug, subcategorySlug } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState({
    field: 'name',
    direction: 'asc'
  });

  // Функция для сортировки продуктов
  const sortProducts = (products) => {
    return [...products].sort((a, b) => {
      let valueA, valueB;
      
      if (sortOption.field === 'price') {
        // Используем цену со скидкой, если есть
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

  useEffect(() => {
    console.log('ProductsList: Received products', initialProducts, 'isSearchPage:', isSearchPage, 'query:', query);
    const sortedProducts = sortProducts(initialProducts);
    setFilteredProducts(sortedProducts);
  }, [initialProducts, sortOption]);

  const handleFilterChange = (newFilters) => {
    const filtered = initialProducts.filter((product) => {
      const price = Number(product.price);
      const discountPrice = product.discount ? price * (1 - product.discount / 100) : price;
      if (newFilters.priceRange && discountPrice > newFilters.priceRange[1]) return false;
      if (newFilters.brand !== 'all' && product.brand !== newFilters.brand) return false;
      if (isSearchPage && newFilters.category !== 'all' && product.category !== newFilters.category) return false;
      if (isSearchPage && newFilters.subcategory !== 'all' && product.subcategory !== newFilters.subcategory) return false;
      return true;
    });
    const sortedFilteredProducts = sortProducts(filtered);
    console.log('ProductsList: Filtered products', sortedFilteredProducts);
    setFilteredProducts(sortedFilteredProducts);
  };

  const handleSortChange = (field, direction) => {
    setSortOption({ field, direction });
  };

  return (
    <div className="products-list-container">
      <ProductFilter 
        products={initialProducts} 
        onFilterChange={handleFilterChange} 
        onSortChange={handleSortChange}
        sortOption={sortOption}
      />
      <div className="products">
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id || product._id || index}
                product={product}
                isSearchPage={isSearchPage}
                query={query}
              />
            ))
          ) : (
            <p>{emptyMessage || 'Товаров нет'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsList;