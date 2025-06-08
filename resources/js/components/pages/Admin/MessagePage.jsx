import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import "../../../../css/components/MessagePage.css";

const MessagesPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchConversations = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/admin/conversations');
            console.log('Conversations data:', response.data);
            setConversations(response.data);

            if (selectedUser) {
                const userInResponse = response.data.find(u => u.id === selectedUser.id);
                if (userInResponse && userInResponse.unread_count > 0) {
                    fetchMessages(selectedUser.id);
                }
            }
        } catch (err) {
            console.error('Error fetching conversations:', err);
            setError(t('admin.messages.load_error'));
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (userId) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/admin/conversations/${userId}`);
            setSelectedUser(response.data.user);
            setMessages(response.data.messages);
        } catch (err) {
            setError(t('admin.messages.load_error'));
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await axios.post(`/api/admin/conversations/${selectedUser.id}`, {
                message: messageText
            });
            
            setMessages(prev => [...prev, response.data]);
            setMessageText('');
            
            await fetchConversations();
        } catch (err) {
            setError(t('admin.messages.send_error'));
        }
    };


    useEffect(() => {
        fetchConversations();
        const interval = setInterval(() => {
            fetchConversations();
        }, 10000); 


        return () => clearInterval(interval);
    }, [t]);


    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser.id); 
            const messageInterval = setInterval(() => {
                fetchMessages(selectedUser.id);
            }, 10000); 

            return () => clearInterval(messageInterval);
        }
    }, [selectedUser]);

    return (
        <div className="page--admin page">
            <h1>{t('admin.messages.title')}</h1>
            
            <div className="admin-messages-container">
                <div className="conversations-list">
                    <h2>{t('admin.messages.conversations')}</h2>
                    {loading && !selectedUser ? (
                        <p>{t('admin.loading')}</p>
                    ) : error ? (
                        <p className="error">{error}</p>
                    ) : conversations.length === 0 ? (
                        <p>{t('admin.messages.no_conversations')}</p>
                    ) : (
                        <ul>
                            {conversations.map(conv => (
                                <li 
                                    key={conv.id}
                                    className={selectedUser?.id === conv.id ? 'active' : ''}
                                    onClick={() => fetchMessages(conv.id)}
                                >
                                    <div className="user-info">
                                        <strong>{conv.name}</strong>
                                        <span>{conv.email}</span>
                                    </div>
                                    <div className="last-message">
                                        <p>{conv.last_message}</p>
                                        <small>
                                            {new Date(conv.last_message_time).toLocaleString()}
                                        </small>
                                    </div>
                                    {conv.unread_count > 0 && (
                                        <span className="unread-count">{conv.unread_count}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                
                <div className="messages-container">
                    {selectedUser ? (
                        <>
                            <h2>{t('admin.messages.chat_with')} {selectedUser.name}</h2>
                            {loading ? (
                                <p>{t('admin.loading')}</p>
                            ) : error ? (
                                <p className="error">{error}</p>
                            ) : messages.length === 0 ? (
                                <p>{t('admin.messages.no_messages')}</p>
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
                                                {!msg.is_admin && msg.read_at && (
                                                    <span className="read-status">✓ Прочитано</span>
                                                )}
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
                                    placeholder={t('admin.messages.type_message')}
                                    required
                                />
                                <button type="submit">{t('admin.messages.send')}</button>
                            </form>
                        </>
                    ) : (
                        <div className="select-conversation">
                            <p>{t('admin.messages.select_conversation')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;