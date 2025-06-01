import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../../../context/CartContext'; // Импортируем useCart
import ProductImage from './ProductImage';
import ProductPrice from './ProductPrice';
import Button from '../../UI/Button';
import '../../../../css/components/Products.css';

const ProductCard = ({ product, categorySlug, subcategorySlug }) => {
    const { t } = useTranslation();
    const { addToCart } = useCart(); // Получаем функцию addToCart

    const handleAddToCart = async () => {
        const result = await addToCart(product.id, 1); // Добавляем 1 товар
        if (!result.success) {
            console.error(result.error);
        }
    };

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
            <Button onClick={handleAddToCart}>
                {t('cart.add_to_cart')}
            </Button>
        </div>
    );
};

export default ProductCard;