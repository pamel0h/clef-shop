import { useParams } from 'react-router-dom';
import useCatalogData from '../../../hooks/useCatalogData';
import '../../../../css/components/ProductDetails.css';
import '../../../../css/components/Loading.css';


const ProductDetailsPage = () => {
  const { categorySlug, subcategorySlug, productId } = useParams();

  if (!categorySlug || !subcategorySlug || !productId) {
    return <div>Ошибка: некорректные параметры</div>;
  }

  const { data: product, loading, error } = useCatalogData('product_details', {
    id: productId,
    category: categorySlug,
    subcategory: subcategorySlug,
  });

  if (loading) return <div className="loading">Загрузка товара...</div>;
  if (error) return <div className="error">Ошибка: {error.message}</div>;
  if (!product?.id) return <div>Товар не найден</div>;
  console.log(product.image);

  return (
    <div className="product-details-container">
<div className="product-details-grid">
<div className="product-gallery">
    <img
      src={product.image || '/storage/product_images/no-image.png'}
      alt={product.name}
      className="product-image main-image"
    />
  </div>

      <div className="product-info">
        <h1 className="product-name">{product.name}</h1>
        <p className="product-price">{product.price} ₽</p>
        <div className="product-description">
        <p><strong>Описание (RU):</strong> {product.description?.ru || 'Описание отсутствует'}</p>
      <p><strong>Description (EN):</strong> {product.description?.en || 'Description unavailable'}</p>
    </div> 
        <p className="product-brand">Бренд: {product.brand || 'Не указан'}</p>
        {product.specs && (
          <ul className="product-specs">
            {Object.entries(product.specs).map(([key, value]) => (
              <li key={key}>{key}: {value}</li>
            ))}
          </ul>
        )}
        <div className="product-category-path">
          {categorySlug} / {subcategorySlug}
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProductDetailsPage;