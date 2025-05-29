import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useCatalogData from '../../../hooks/useCatalogData';
import ProductCard from './ProductCard';
import { ProductFilter } from './ProductFilter';
import '../../../../css/components/Products.css';
import '../../../../css/components/Loading.css';

const ProductsList = ({ products: initialProducts, emptyMessage, isSearchPage = false, location }) => {
  const { categorySlug, subcategorySlug } = useParams();
  const { data: catalogProducts, loading, error } = useCatalogData('products', {
    category: categorySlug,
    subcategory: subcategorySlug,
  }, isSearchPage); // Изменили !isSearchPage на isSearchPage

  const [filteredProducts, setFilteredProducts] = useState([]);

  const products = isSearchPage ? initialProducts : catalogProducts;

  useEffect(() => {
    console.log('ProductsList: Received products', products);
    setFilteredProducts(products);
  }, [products]);

  const handleFilterChange = (newFilters) => {
    const filtered = products.filter((product) => {
      const price = Number(product.price);
      if (newFilters.priceRange && price > newFilters.priceRange[1]) return false;
      if (newFilters.brand !== 'all' && product.brand !== newFilters.brand) return false;
      return true;
    });
    console.log('ProductsList: Filtered products', filtered);
    setFilteredProducts(filtered);
  };

  if (loading && !isSearchPage) return <div className="loading">Загрузка...</div>;
  if (error && !isSearchPage) return <div>Error: {error.message}</div>;

  // if (!isSearchPage && (!categorySlug || !subcategorySlug)) {
  //   return <div>Ошибка: категория или подкатегория не выбраны</div>;
  // }

  return (
    <div className="products-list-container">
      <ProductFilter products={products} onFilterChange={handleFilterChange} />
      <div className="products">
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
filteredProducts.map((product, index) => (
  <ProductCard
    key={product.id || product._id || index}
    product={product}
    categorySlug={isSearchPage ? product.category : categorySlug}
    subcategorySlug={isSearchPage ? product.subcategory : subcategorySlug}
    isSearchPage={isSearchPage}
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