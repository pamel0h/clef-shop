import { useParams, useLocation } from 'react-router-dom';
import useCatalogData from '../../../hooks/useCatalogData';
import '../../../../css/components/ProductDetails.css';
import '../../../../css/components/Loading.css';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductSpecs from './ProductSpecs';

const ProductDetailsPage = () => {
  const location = useLocation();
  const { categorySlug, subcategorySlug, productId } = useParams();
  const { data: product, loading, error } = useCatalogData('product_details', {
    id: productId,
    category: categorySlug,
    subcategory: subcategorySlug,
  });

  if (!categorySlug || !subcategorySlug || !productId) {
    return <div>Ошибка: некорректные параметры</div>;
  }
  if (loading) return <div className="loading">Загрузка товара...</div>;
  if (error) return <div className="error">Ошибка: {error.message}</div>;
  if (!product?.id) return <div>Товар не найден</div>;

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