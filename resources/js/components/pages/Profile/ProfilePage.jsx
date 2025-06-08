import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../context/AuthContext';
import axios from 'axios';
import "../../../../css/components/ProfilePage.css";
import Order from './Order';
import ProfileForm from './ProfileForm';
import Message from './Message'; // Новый компонент для отображения сообщений
import Button from '../../UI/Button';

const ProfilePage = () => {
    const { t } = useTranslation();
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const [activeContainer, setActiveContainer] = useState('profile');
    const [orders, setOrders] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            const fetchOrders = async () => {
                setLoadingOrders(true);
                setError('');
                try {
                    const response = await axios.get('/api/order');
                    setOrders(response.data.orders);
                } catch (err) {
                    setError(t('profile.orders_error'));
                } finally {
                    setLoadingOrders(false);
                }
            };

            const fetchMessages = async () => {
                setLoadingMessages(true);
                setError('');
                try {
                    const response = await axios.get('/api/messages', {
                        params: { userId: user.id },
                    });
                    setMessages(response.data.messages);
                } catch (err) {
                    setError(t('profile.messages_error'));
                } finally {
                    setLoadingMessages(false);
                }
            };

            fetchOrders();
            fetchMessages();
        }
    }, [user, t]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };
    
    const handleButton = async (e) => {
        e.preventDefault();
    
        setError('');
        

        try {
            await axios.post('/api/messages', {
                userId: user.id,
                message,
                createdAt: new Date(),
            });
            setMessage('');
        } catch (err) {
            setError(t('contactForm.error'));
        } finally {
           
        }
    };


    if (loading) {
        return (
            <div className="page--user page">
                <div className="loading">{t('profile.loading')}</div>
            </div>
        );
    }

    // Разделяем заказы на текущие и завершенные
    const currentOrders = orders.filter(order => order.status !== 'completed');
    const completedOrders = orders.filter(order => order.status === 'completed');

    return (
        <div className="page--user page">
            <h1>{t('profile.title')}</h1>
            <div className="menu">
                <ul>
                    <li
                        onClick={() => setActiveContainer('profile')}
                        className={activeContainer === 'profile' ? 'active' : ''}
                    >
                        {t('profile.my_data')}
                    </li>
                    <li
                        onClick={() => setActiveContainer('orders')}
                        className={activeContainer === 'orders' ? 'active' : ''}
                    >
                        {t('profile.orders')}
                    </li>
                    <li
                        onClick={() => setActiveContainer('purchases')}
                        className={activeContainer === 'purchases' ? 'active' : ''}
                    >
                        {t('profile.purchases')}
                    </li>
                    <li
                        onClick={() => setActiveContainer('messages')}
                        className={activeContainer === 'messages' ? 'active' : ''}
                    >
                        {t('profile.messages')}
                    </li>
                </ul>
                <Button onClick={handleLogout}>{t('profile.logout')}</Button>
            </div>

            <div className="user--container">
                {activeContainer === 'profile' && (
                    <div className="profile-container">
                        <h2>{t('profile.my_data')}</h2>
                        <ProfileForm user={user} />
                    </div>
                )}
                {activeContainer === 'orders' && (
                    <div className="orders-container">
                        <h2>{t('profile.my_orders')}</h2>
                        {loadingOrders ? (
                            <p>{t('profile.loading')}</p>
                        ) : error ? (
                            <p className="error">{error}</p>
                        ) : currentOrders.length === 0 ? (
                            <p>{t('profile.no_orders')}</p>
                        ) : (
                            currentOrders.map(order => (
                                <Order key={order.id} order={order} />
                            ))
                        )}
                    </div>
                )}
                {activeContainer === 'purchases' && (
                    <div className="purchases-container">
                        <h2>{t('profile.my_purchases')}</h2>
                        {loadingOrders ? (
                            <p>{t('profile.loading')}</p>
                        ) : error ? (
                            <p className="error">{error}</p>
                        ) : completedOrders.length === 0 ? (
                            <p>{t('profile.no_purchases')}</p>
                        ) : (
                            completedOrders.map(order => (
                                <Order key={order.id} order={order} />
                            ))
                        )}
                    </div>
                )}
                {activeContainer === 'messages' && (
                    <div className="messages-container">
                        <h2>{t('profile.messages')}</h2>
                        {loadingMessages ? (
                            <p>{t('profile.loading')}</p>
                        ) : error ? (
                            <p className="error">{error}</p>
                        ) : messages.length === 0 ? (
                            <p>{t('profile.no_messages')}</p>
                        ) : (
                            messages.map(message => (
                                <Message key={message.id} message={message} />
                            ))
                        )}
                        <input type='text' onChange={(e) => setMessage(e.target.value)}></input>
                        <button onClick={handleButton}>Отправить</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;