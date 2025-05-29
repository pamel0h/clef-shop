// components/pages/Catalog/ProductDetailsPage.jsx
import { useParams, useLocation } from 'react-router-dom';
import useCatalogData from '../../../hooks/useCatalogData';
import '../../../../css/components/ProductDetails.css';
import '../../../../css/components/Loading.css';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductSpecs from './ProductSpecs';

const ProductDetailsPage = () => {
  const { categorySlug, subcategorySlug, productId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isFromSearch = queryParams.get('fromSearch') === 'true';
  const searchQuery = queryParams.get('query') || '';

  const { data: product, loading, error } = useCatalogData('product_details', {
    id: productId,
    category: categorySlug,
    subcategory: subcategorySlug,
  });

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="product-details-container">
      <div className="product-details-grid">
        <ProductGallery image={product.image} alt={product.name} />
        <ProductInfo 
          name={product.name}
          price={product.price} 
          discount={product.discount} 
          brand={product.brand}
          description={product.description}
        />
        <ProductSpecs specs={product.specs} />
      </div>
    </div>
  );
};

export default ProductDetailsPage;