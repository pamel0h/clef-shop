const ProductPrice = ({ price, discount }) => {
    const hasDiscount = discount && discount !== 0;
    const discountedPrice = hasDiscount 
      ? (price * (1 - discount / 100)).toFixed(2) 
      : null;
  
    const displayDiscountedPrice = hasDiscount 
      ? Number(discountedPrice) % 1 === 0 
        ? Math.floor(Number(discountedPrice)) 
        : discountedPrice 
      : null;
  
    return (
      <div className="product-price-container">
        {hasDiscount ? (
          <div className="price-inline">
            <span className="product-discounted-price">{displayDiscountedPrice} ₽</span>
            <span className="product-price discounted">{price} ₽</span>
          </div>
        ) : (
          <p className="product-price">{price} ₽</p>
        )}
      </div>
    );
  };
  
  export default ProductPrice;