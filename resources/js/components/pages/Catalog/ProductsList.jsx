import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import '../../../../css/components/Products.css';
import useCatalogData from '../../../hooks/useCatalogData';
import ProductCard from './ProductCard';
import { ProductFilter } from './ProductFilter';

export const ProductsList = () => {
  // ProductsList.jsx
console.log('ProductsList RENDERED at:', new Date().toISOString());
  const { categorySlug, subcategorySlug } = useParams();
  console.log('ProductsList rendered with params:', { categorySlug, subcategorySlug });

  const { data: products, loading, error } = useCatalogData('products', { category: categorySlug, subcategory: subcategorySlug });
  console.log('Fetched products:', { products, loading, error });

  const [filteredProducts, setFilteredProducts] = useState([]);
  useEffect(() => {
    setFilteredProducts(products); // Инициализируем filteredProducts исходным списком
  }, [products]);

  const handleFilterChange = (newFilters) => {
    // Реализуйте логику фильтрации здесь
    const filtered = products.filter(product => {
      // Пример: фильтрация по цене
      if (newFilters.priceRange && product.price > newFilters.priceRange[1]) {
        return false;
      }

      // Пример: фильтрация по динамическим фильтрам (предполагаем, что значения 'all' нет фильтрации)
      for (const key in newFilters) {
        if (key !== 'priceRange' && key !== 'inStock' && key !== 'dynamicFilters' && newFilters[key] !== 'all') {
          if (product[key] !== newFilters[key]) {
            return false;
          }
        }
      }

      return true;
    });
    setFilteredProducts(filtered);
  };

  // if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!categorySlug || !subcategorySlug) {
    console.log('Missing params, rendering fallback');
    return <div>Ошибка: категория или подкатегория не выбраны</div>;
  }

return (
  <div className="products-list-container"> {/* Контейнер для фильтров и списка */}
    <ProductFilter products={products} onFilterChange={handleFilterChange} />
    <div className="products">
      {/* <h2>Товары: {categorySlug.replace(/_/g, ' ')} → {subcategorySlug.replace(/_/g, ' ')}</h2> */}
      <div className="products-grid">
        {filteredProducts && filteredProducts.length > 0 ? ( // Используем filteredProducts
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          !loading && <p>Товаров нет</p>
        )}
      </div>
    </div>
    {loading && <div>Loading...</div>} {/* Loading после контента */}
  </div>
);
};

export default ProductsList;