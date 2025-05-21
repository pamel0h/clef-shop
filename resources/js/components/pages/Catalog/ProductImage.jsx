const ProductImage = ({ src, alt, className = '' }) => {
    return (
      <img 
        src={src || '/storage/product_images/no-image.png'} 
        alt={alt} 
        className={`product-image ${className}`}
      />
    );
  };
  
  export default ProductImage;