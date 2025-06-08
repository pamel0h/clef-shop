import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../context/AuthContext';
import axios from 'axios';
import "../../../../css/components/ProfilePage.css";
import Order from './Order';
import ProfileForm from './ProfileForm';
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
    const [messageText, setMessageText] = useState('');

    const fetchMessages = async (lastMessageId = null) => {
    if (activeContainer === 'messages') {
        setLoadingMessages(true);
        try {
            const url = lastMessageId 
                ? `/api/messages?since=${lastMessageId}`
                : '/api/messages';
            
            const response = await axios.get(url);
            
            if (lastMessageId && response.data.length > 0) {
                setMessages(prev => [...prev, ...response.data]);
            } else if (!lastMessageId) {
                setMessages(response.data);
            }
        } catch (err) {
            setError(t('profile.messages_error'));
        } finally {
            setLoadingMessages(false);
        }
    }
};

    useEffect(() => {
        if (user) {
            const fetchOrders = async () => { /* ... */ };
            
            fetchOrders();
            fetchMessages();
        }
    }, [user, t, activeContainer]);

    useEffect(() => {
    if (activeContainer === 'messages' && user) {
        fetchMessages(); 
        
        const lastMessageId = messages.length > 0 
            ? messages[messages.length - 1].id 
            : null;
            
        const interval = setInterval(() => {
            fetchMessages(lastMessageId);
        }, 30000); 

        return () => clearInterval(interval);
    }
}, [activeContainer, user, t, messages.length]); 

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await axios.post('/api/messages', {
                message: messageText
            });
            
            setMessages(prev => [...prev, response.data]);
            setMessageText('');
        } catch (err) {
            setError(t('profile.message_send_error'));
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="page--user page">
                <div className="loading">{t('profile.loading')}</div>
            </div>
        );
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
                            <div className="messages-list">
                                {messages.map((msg, index) => (
                                    <div 
                                        key={index} 
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
                            <input 
                                type="text" 
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder={t('profile.type_message')}
                                required
                            />
                            <button type="submit">{t('profile.send')}</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;