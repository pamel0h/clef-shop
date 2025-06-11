import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../context/AuthContext';
import axios from 'axios';
import "../../../../css/components/ProfilePage.css";
import '../../../../css/components/Loading.css';
import Order from './Order';
import ProfileForm from './ProfileForm';
import Button from '../../UI/Button';
import Input from '../../UI/Input';
import SendIcon from '../../icons/SendIcon';

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
    const [messageText, setMessageText] = useState('');
    
    // Ref для отслеживания последнего ID сообщения
    const lastMessageIdRef = useRef(null);
    const pollingIntervalRef = useRef(null);
    const messagesEndRef = useRef(null); // Ref for the messages container

    // Функция для получения всех сообщений (при первой загрузке)
    const fetchAllMessages = async () => {
        setLoadingMessages(true);
        try {
            const response = await axios.get('/api/messages');
            setMessages(response.data);
            
            // Обновляем последний ID сообщения
            if (response.data.length > 0) {
                lastMessageIdRef.current = response.data[response.data.length - 1].id;
            }
        } catch (err) {
            setError(t('profile.messages_error'));
        } finally {
            setLoadingMessages(false);
        }
    };

    // Функция для получения только новых сообщений
    const fetchNewMessages = async () => {
        if (!lastMessageIdRef.current) return;
        
        try {
            const response = await axios.get(`/api/messages?since=${lastMessageIdRef.current}`);
            
            if (response.data.length > 0) {
                setMessages(prev => [...prev, ...response.data]);
                // Обновляем последний ID
                lastMessageIdRef.current = response.data[response.data.length - 1].id;
            }
        } catch (err) {
            console.error('Error fetching new messages:', err);
        }
    };

    // Загрузка заказов
    const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
        const response = await axios.get('/api/order');
        // Проверяем, если ответ содержит массив или объект с массивом orders
        setOrders(Array.isArray(response.data) ? response.data : response.data.orders || []);
    } catch (err) {
        setError(t('profile.orders_error'));
        setOrders([]); // Устанавливаем пустой массив в случае ошибки
    } finally {
        setLoadingOrders(false);
    }
};

    // Первоначальная загрузка данных при смене контейнера
    useEffect(() => {
        if (user) {
            if (activeContainer === 'orders' || activeContainer === 'purchases') {
                fetchOrders();
            } else if (activeContainer === 'messages') {
                fetchAllMessages();
            }
        }
    }, [user, activeContainer, t]);

    // Настройка polling только для сообщений
    useEffect(() => {
        // Очищаем предыдущий интервал
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }

        if (activeContainer === 'messages' && user && messages.length > 0) {
            // Запускаем polling только для новых сообщений
            pollingIntervalRef.current = setInterval(() => {
                fetchNewMessages();
            }, 5000); // Проверяем каждые 5 секунд
        }

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        };
    }, [activeContainer, user, messages.length]);

    // Scroll to the bottom of the messages list when messages or activeContainer changes
    useEffect(() => {
        if (activeContainer === 'messages' && messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages, activeContainer]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await axios.post('/api/messages', {
                message: messageText
            });
            
            // Добавляем новое сообщение к существующим
            setMessages(prev => [...prev, response.data]);
            // Обновляем последний ID сообщения
            lastMessageIdRef.current = response.data.id;
            setMessageText('');
        } catch (err) {
            setError(t('profile.message_send_error'));
        }
    };

    const handleMessageChange = (e) => {
        setMessageText(e.target.value);
    };

    const handleLogout = async () => {
        // Очищаем интервал при выходе
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }
        await logout();
        navigate('/');
    };

    // Очистка при размонтировании компонента
    useEffect(() => {
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, []);

    if (loading) {
        return <div className="loading"></div>;
    }

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
                            <div className="loading"></div>
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
                           <div className="loading"></div>
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
                        <div className="loading"></div>
                    ) : error ? (
                        <p className="error">{error}</p>
                    ) : messages.length === 0 ? (
                        <p>{t('profile.no_messages')}</p>
                    ) : (
                        <div className="messages-list" ref={messagesEndRef} style={{ overflowY: 'auto', maxHeight: '400px' }}>
                            {messages.map((msg, index) => (
                                <div 
                                    key={msg.id || index} 
                                    className={`message ${msg.is_admin ? 'admin-message' : 'user-message'}`}
                                >
                                    <div className="message-content">
                                        {msg.message}
                                    </div>
                                    <div className="message-time">
                                        {new Date(msg.created_at).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <form onSubmit={handleSendMessage} className="message-form">
                        <Input 
                            type="text"
                            value={messageText}
                            onChange={handleMessageChange}
                            placeholder={t('profile.type_message')}
                            required
                        />
                        <Button variant='icon' type="submit"><SendIcon/></Button>
                    </form>
                </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;