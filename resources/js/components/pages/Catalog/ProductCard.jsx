// resources/js/components/pages/Catalog/ProductCard.jsx
import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image" /> {/* Заглушка для изображения */}
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">{product.price} ₽</p>
    </div>
  );
};

export default ProductCard;