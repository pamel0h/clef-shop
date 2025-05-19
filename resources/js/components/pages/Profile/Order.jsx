import { useState } from 'react';
import "../../../../css/components/Order.css"

const Order = ({ status, title }) => {
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    
    const toggleDetails = () => {
        setIsDetailsVisible(!isDetailsVisible);
    };

    return (
        <div className="order1 order">
            <div className="titleOrder">
                <h3>Заказ {title}</h3>
                <p className="status">{status}</p>
            </div>
            <div className={`details ${isDetailsVisible ? 'visible' : ''}`}>
                <ul>
                    <li>Гитара</li>
                    <li>Тюнер</li>
                    <li>Медиатор</li>
                </ul>
            </div>
            <p onClick={toggleDetails} style={{ cursor: 'pointer' }}>
                {isDetailsVisible ? 'Скрыть' : 'Подробнее'}
            </p>
        </div>
    );
};

export default Order;