// import { Link } from 'react-router-dom';
// import '../../../../css/components/Products.css';

// const ProductCard = ({ product, categorySlug, subcategorySlug }) => {
//   console.log(product.image);

//   // Проверяем, есть ли скидка
//   const hasDiscount = product.discount && product.discount !== 0;
//   const discountedPrice = hasDiscount 
//     ? (product.price * (1 - product.discount / 100)).toFixed(2) 
//     : null;

//   // Убираем ".00" у новой цены, если она целая
//   const displayDiscountedPrice = hasDiscount 
//     ? Number(discountedPrice) % 1 === 0 
//       ? Math.floor(Number(discountedPrice)) 
//       : discountedPrice 
//     : null;

//   return (
//     <div className="product-card">
//       <Link 
//         to={`/catalog/${categorySlug}/${subcategorySlug}/${product.id}`}
//         className="product-link"
//       >
//         <div className="product-image-container">
//           <img 
//             src={product.image || 'storage/product_images/no-image.png'} 
//             alt={product.name} 
//             className="product-image"
//           />
//         </div>
//         <h3 className="product-name">{product.name}</h3>
//         <div className="product-price-container">
//           {hasDiscount ? (
//             <div className="price-inline">
//               <span className="product-discounted-price">{displayDiscountedPrice} ₽</span>
//               <span className="product-price discounted">{product.price} ₽</span>
//             </div>
//           ) : (
//             <p className="product-price">{product.price} ₽</p>
//           )}
//         </div>
//       </Link>
//     </div>
//   );
// };

// export default ProductCard;


import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import ProductPrice from './ProductPrice';
import '../../../../css/components/Products.css';

const ProductCard = ({ product, categorySlug, subcategorySlug }) => {
  return (
    <div className="product-card">
      <Link 
        to={`/catalog/${categorySlug}/${subcategorySlug}/${product.id}`}
        className="product-link"
      >
        <div className="product-image-container">
          <ProductImage src={product.image} alt={product.name} />
        </div>
        <h3 className="product-name">{product.name}</h3>
        <ProductPrice price={product.price} discount={product.discount} />
      </Link>
    </div>
  );
};

export default ProductCard;