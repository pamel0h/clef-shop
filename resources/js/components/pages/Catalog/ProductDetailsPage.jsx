// ProductDetailsPage.jsx
import { useParams, useLocation } from 'react-router-dom';
import useCatalogData from '../../../hooks/useCatalogData';
import '../../../../css/components/ProductDetails.css';
import '../../../../css/components/Loading.css';
import ProductImage from '../../UI/ProductImage';
import ProductInfo from './ProductInfo';
import ProductSpecs from './ProductSpecs';
import { useOutletContext } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';

const ProductDetailsPage = () => {
  const { productId, categorySlug, subcategorySlug } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isFromSearch = queryParams.get('fromSearch') === 'true' || location.pathname.startsWith('/search');
  const searchQuery = queryParams.get('query') || '';
  const context = useOutletContext();
  const query = context?.query || searchQuery;
  const filters = context?.filters || location.state?.filters || {};
  const sortOption = context?.sortOption || location.state?.sortOption || {};
  const fromSearch = location.state?.fromSearch || isFromSearch;
  
  const { data: product, loading, error } = useCatalogData('product_details', {
    id: productId,
    category: isFromSearch ? undefined : categorySlug,
    subcategory: isFromSearch ? undefined : subcategorySlug,
    query: isFromSearch ? query : undefined,
  });

  // Показываем лоадер, если данные ещё загружаются или product пустой
  if (loading || !product || Object.keys(product).length === 0) {
    return <div className="loading"></div>;
  }
  if (error) return <div className="error">{error.message}</div>;
  if (!product.name) return <div>Товар не найден</div>;

  return (
    <div className="product-details-container">
      {/* <Breadcrumbs /> */}
      <div className="product-details-grid">
        <ProductImage src={product.image} alt={product.name || 'Товар'} variant="main" />
        <ProductInfo
        id ={productId}
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