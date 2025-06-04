import '../../../css/components/ProductDetails.css';
import '../../../css/components/Products.css';

const ProductImage = ({ src, alt, variant = 'thumbnail', className = '' }) => {
  const baseClass = 'product-image';
  const variantClass = variant === 'main' ? 'main-image' : '';
  const galleryClass = variant === 'main' ? 'product-gallery' : '';

  return (
    <div className={galleryClass}>
      <img
        src={src || '/storage/product_images/no-image.png'}
        alt={alt}
        className={`${baseClass} ${variantClass} ${className}`}
      />
    </div>
  );
};

export default ProductImage;