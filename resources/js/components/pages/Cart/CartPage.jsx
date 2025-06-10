import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../../../context/CartContext';
import { useAuth } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CartItem from './CartItem';
import Button from '../../UI/Button';
import Input from '../../UI/Input';
import '../../../../css/components/Loading.css';
import "../../../../css/components/CartPage.css";

const CartPage = () => {
    const { t } = useTranslation();
    const { cartItems, loading, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [totalPrice, setTotalPrice] = useState(0);
    const [isPickup, setIsPickup] = useState(true);
    const [formData, setFormData] = useState({
        phone: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    // Инициализация формы данными пользователя при загрузке
    useEffect(() => {
        if (user) {
            setFormData({
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

    useEffect(() => {
        const total = cartItems.reduce((sum, item) => {
            const itemPrice = item.product?.price * (1 - (item.product?.discount || 0) / 100);
            return sum + (itemPrice * item.quantity);
        }, 0);
        setTotalPrice(total);
    }, [cartItems]);

    const resetForm = () => {
        setFormData({
            phone: user?.phone || '',
            address: user?.address || ''
        });
        setError('');
        setLoadingSubmit(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoadingSubmit(true);

        if (!user) {
            setError(t('cart.please_login'));
            setLoadingSubmit(false);
            return;
        }

        if (!formData.phone) {
            setError(t('cart.phone_required'));
            setLoadingSubmit(false);
            return;
        }

        if (!isPickup && !formData.address) {
            setError(t('cart.address_required'));
            setLoadingSubmit(false);
            return;
        }

        try {
            const orderData = {
                items: cartItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    attributes: item.attributes || [],
                })),
                phone: formData.phone,
                delivery_type: isPickup ? 'pickup' : 'delivery',
                ...(isPickup ? {} : { address: formData.address }),
            };

            const response = await axios.post('/api/order/create', orderData);

            if (response.data.success) {
                clearCart();
                resetForm();
                navigate('/profile');
            } else {
                setError(response.data.message || t('cart.order_error'));
            }
        } catch (error) {
            setError(t('cart.order_error'));
        } finally {
            setLoadingSubmit(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) return <div className="loading"></div>;

    return (
        <div className="page--cart page">
            <h1>{t('cart.title')}</h1>
            <div className="containerProductsCart">
                <div className="productsCart">
                    {cartItems.length === 0 ? (
                        <p>{t('cart.empty')}</p>
                    ) : (
                        <>
                            {cartItems.map(item => (
                                <CartItem key={item.product_id} item={item} />
                            ))}
                            <Button onClick={clearCart}>
                                {t('cart.clear_cart')}
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <div className="orderForm">
                <h2>{t('cart.total')}: {totalPrice.toFixed(2)}</h2>
                <div className="order-tabs">
                    <button
                        className={`order-tab pickup-btn ${isPickup ? 'active' : ''}`}
                        onClick={() => setIsPickup(true)}
                    >
                        {t('cart.pickup')}
                    </button>
                    <button
                        className={`order-tab order-btn ${!isPickup ? 'active' : ''}`}
                        onClick={() => setIsPickup(false)}
                    >
                        {t('cart.delivery')}
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('cart.phone_label')}</label>
                        <Input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder={t('cart.phone_placeholder')}
                            disabled={loadingSubmit}
                        />
                    </div>
                    {!isPickup && (
                        <div className="form-group">
                            <label>{t('cart.address_label')}</label>
                            <Input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder={t('cart.address_placeholder')}
                                required
                                disabled={loadingSubmit}
                            />
                        </div>
                    )}
                    {error && <p className="error">{error}</p>}
                    <Button
                        type="submit"
                        className="submitOrder"
                        variant="secondary"
                        disabled={loadingSubmit || cartItems.length === 0}
                    >
                        {loadingSubmit ? t('cart.loading') : t('cart.order')}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default CartPage;