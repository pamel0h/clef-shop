import { useParams, useLocation } from 'react-router-dom';
import useCatalogData from '../../../hooks/useCatalogData';
import '../../../../css/components/ProductDetails.css';
import '../../../../css/components/Loading.css';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductSpecs from './ProductSpecs';
import { useOutletContext } from 'react-router-dom';

const ProductDetailsPage = () => {
  const { productId, categorySlug, subcategorySlug } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isFromSearch = queryParams.get('fromSearch') === 'true' || location.pathname.startsWith('/search');
  const searchQuery = queryParams.get('query') || '';
  const context = useOutletContext();
  const query = context?.query || searchQuery;

  const { data: product, loading, error } = useCatalogData('product_details', {
    id: productId,
    category: isFromSearch ? undefined : categorySlug,
    subcategory: isFromSearch ? undefined : subcategorySlug,
    query: isFromSearch ? query : undefined,
  });

  console.log('ProductDetailsPage: State', {
    isFromSearch,
    query,
    productId,
    loading,
    error,
    product,
    location: location.pathname + location.search,
  });

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div>Error: {error?.message || 'Неизвестная ошибка'}</div>;
  if (!product) return <div>Товар не найден</div>;

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