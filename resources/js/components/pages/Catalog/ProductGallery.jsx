import ProductImage from './ProductImage';

const ProductGallery = ({ image, alt }) => {
    return (
      <div className="product-gallery">
        <ProductImage src={image} alt={alt} className="main-image" />
      </div>
    );
  };

  export default ProductGallery;