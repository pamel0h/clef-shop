import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import "../../../../css/components/Order.css";

const Order = ({ order }) => {
    const { t } = useTranslation();
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);

    const toggleDetails = () => {
        setIsDetailsVisible(!isDetailsVisible);
    };

    // Преобразуем статус в читаемый вид
    const statusLabels = {
        pending: t('order.status.pending'),
        processing: t('order.status.processing'),
        shipped: t('order.status.shipped'),
        completed: t('order.status.completed'),
        cancelled: t('order.status.cancelled'),
    };

    // Форматируем дату
    const formattedDate = new Date(order.created_at).toLocaleDateString();

    return (
        <div className="order1 order">
            <div className="titleOrder">
                <h3>{t('order.title')}{order.id }</h3>
                <p className="status">{statusLabels[order.status] || order.status}</p>
            </div>
            <div className={`details ${isDetailsVisible ? 'visible' : ''}`}>
                <ul>
                    {order.items.map(item => (
                        <li key={item.product_id}>
                            {item.product?.name || t('order.item_unavailable')} x {item.quantity} - $
                            {(item.product?.price
                                ? item.product.price * (1 - (item.product.discount || 0) / 100) * item.quantity
                                : 0
                            ).toFixed(2)}
                        </li>
                    ))}
                </ul>
                <div className="order-info">
                    <p>{t('order.total')}: ${order.total_amount.toFixed(2)}</p>
                    <p>{t('order.date')}: {formattedDate}</p>
                    <p>
                        {t('order.delivery_type')}:{' '}
                        {order.delivery_type === 'pickup' ? t('order.pickup') : t('order.delivery')}
                    </p>
                    {order.delivery_type === 'delivery' && (
                        <p>{t('order.address')}: {order.address}</p>
                    )}
                    <p>{t('order.phone')}: {order.phone}</p>
                </div>
            </div>
            <p onClick={toggleDetails} style={{ cursor: 'pointer' }}>
                {isDetailsVisible ? t('order.hide_details') : t('order.show_details')}
            </p>
        </div>
    );
};

export default Order;