//ProductList.jsx

import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useCatalogData from '../../../hooks/useCatalogData';
import ProductCard from './ProductCard';
import { ProductFilter } from './ProductFilter';
import '../../../../css/components/Products.css';

export const ProductsList = () => {
  const { categorySlug, subcategorySlug } = useParams();
  const { data: products, loading, error } = useCatalogData('products', {
    category: categorySlug,
    subcategory: subcategorySlug,
  });

  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleFilterChange = (newFilters) => {
    const filtered = products.filter((product) => {
      const price = Number(product.price);
      if (newFilters.priceRange && price > newFilters.priceRange[1]) {
        return false;
      }
      if (newFilters.brand !== 'all' && product.brand !== newFilters.brand) {
        return false;
      }
      return true;
    });
    setFilteredProducts(filtered);
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!categorySlug || !subcategorySlug) {
    return <div>Ошибка: категория или подкатегория не выбраны</div>;
  }

  return (
    <div className="products-list-container">
      <ProductFilter products={products} onFilterChange={handleFilterChange} />
      <div className="products">
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categorySlug={categorySlug}
                subcategorySlug={subcategorySlug}
              />
            ))
          ) : (
            <p>Товаров нет</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsList;