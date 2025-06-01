import { useCart } from '../../../../context/CartContext';
import { useTranslation } from 'react-i18next';
import Button from '../../UI/Button';
import PlusIcon from '../../icons/PlusIcon';
import MinusIcon from '../../icons/MinusIcon';
import TrashIcon from '../../icons/TrashIcon';
import "../../../../css/components/CartItem.css"

const CartItem = ({ item }) => {
    const { t } = useTranslation();
    const { updateCart, removeFromCart } = useCart();

    const handleIncrease = () => {
        updateCart(item.product_id, item.quantity + 1);
    };

    const handleDecrease = () => {
        if (item.quantity > 1) {
            updateCart(item.product_id, item.quantity - 1);
        }
    };

    const handleRemove = async () => {
        const { success, error } = await removeFromCart(item.product_id);
        if (!success) {
            console.error('Failed to remove item:', error);
            // Можно показать уведомление пользователю
        }
    };

    const itemPrice = item.product?.price * (1 - (item.product?.discount || 0) / 100);
    const totalPrice = itemPrice * item.quantity;

    return (
        <div className='cartItem'>
            <img 
                src={item.product?.image_url} 
                alt={item.product?.name} 
                width="50" 
                style={{ marginRight: '10px' }} 
            />
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{item.product?.name}</div>
                <div>
                    ${itemPrice.toFixed(2)} {item.product?.discount > 0 && (
                        <span style={{ color: 'red', fontSize: '0.8em' }}>
                            (-{item.product?.discount}%)
                        </span>
                    )}
                </div>
                <div style={{ fontSize: '0.9em', color: '#666' }}>
                    Total: ${totalPrice.toFixed(2)}
                </div>
            </div>
            <div className='button-container'>
                <Button 
                    onClick={handleDecrease} variant='icon' icon={<MinusIcon></MinusIcon>}
                >
                </Button>
                <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                <Button 
                    onClick={handleIncrease}  variant='icon' icon={<PlusIcon></PlusIcon>}  
                > 
                </Button>
                <Button className='trashButton'
                    onClick={handleRemove} variant='icon' icon={<TrashIcon></TrashIcon>}   
                >
                </Button>
            </div>
        </div>
    );
};

export default CartItem;