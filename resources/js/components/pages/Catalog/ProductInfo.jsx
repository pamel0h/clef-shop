import ProductPrice from './ProductPrice'; 

const ProductInfo = ({ name, price, discount, brand, description }) => {
    console.log(price,discount);
    return (
      <div className="product-info">
        <h1 className="product-name">{name}</h1>
        <ProductPrice price={price} discount={discount} />
        <div className="product-description">
          <p><strong>Описание (RU):</strong> {description?.ru || 'Описание отсутствует'}</p>
          <p><strong>Description (EN):</strong> {description?.en || 'Description unavailable'}</p>
        </div>
        <p className="product-brand">Бренд: {brand || 'Не указан'}</p>
      </div>
    );
  };

  export default ProductInfo;