//CartPage.jsx
import Button from '../../UI/Button';
import "../../../../css/components/CartPage.css"

const CartPage = () => {
    return (
        <div className="page--cart page">
            <h1>Cart</h1>
            <div className="productsCart">
                <h2>Товары</h2>
            </div>
            <div className="final">
                <h2>Итого:</h2>
                <Button variant='secondary'>Заказать</Button>
            </div>
            
        </div>
    );
};
export default CartPage;