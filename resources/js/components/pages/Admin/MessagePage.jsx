import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import "../../../../css/components/MessagePage.css";
import Button from '../../UI/Button';
import '../../../../css/components/Loading.css';
import Input from '../../UI/Input';
import SendIcon from '../../icons/SendIcon';

const MessagesPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const conversationsIntervalRef = useRef(null);
    const messagesIntervalRef = useRef(null);
    const lastMessageIdRef = useRef(null);
    const lastConversationUpdateRef = useRef(null);
    const messagesEndRef = useRef(null); 

    const fetchConversations = async () => {
        try {
            const response = await axios.get('/api/admin/conversations');
            const currentDataString = JSON.stringify(response.data);
            if (lastConversationUpdateRef.current !== currentDataString) {
                setConversations(response.data);
                lastConversationUpdateRef.current = currentDataString;
            }
        } catch (err) {
            console.error('Error fetching conversations:', err);
            if (!conversations.length) {
                setError(t('admin.messages.load_error'));
            }
        }
    };

    const fetchAllMessages = async (userId) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`/api/admin/conversations/${userId}`);
            setSelectedUser(response.data.user);
            setMessages(response.data.messages);
            
            if (response.data.messages.length > 0) {
                const lastMessage = response.data.messages[response.data.messages.length - 1];
                lastMessageIdRef.current = lastMessage.id;
            }
        } catch (err) {
            console.error('Error fetching all messages:', err);
            setError(t('admin.messages.load_error'));
        } finally {
            setLoading(false);
        }
    };

    const markMessagesAsRead = async (userId, messageIds) => {
        try {
            await axios.post(`/api/admin/conversations/${userId}/mark-read`, {
                message_ids: messageIds,
            });
            await fetchConversations();
        } catch (err) {
            console.error('Error marking messages as read:', err);
        }
    };

    const fetchNewMessages = async (userId) => {
        if (!lastMessageIdRef.current) {
            console.log('No last message ID, skipping new messages fetch');
            return;
        }
        
        try {
            console.log('Fetching new messages for user:', userId, 'since:', lastMessageIdRef.current);
            const response = await axios.get(`/api/admin/conversations/${userId}?since=${lastMessageIdRef.current}`);
            
            if (response.data.messages && response.data.messages.length > 0) {
                console.log('Found new messages:', response.data.messages.length);
                const newMessages = response.data.messages;
                setMessages(prev => [...prev, ...newMessages]);
                
                const lastMessage = newMessages[newMessages.length - 1];
                lastMessageIdRef.current = lastMessage.id;
                
                if (selectedUser && selectedUser.id === userId) {
                    const messageIds = newMessages
                        .filter(msg => !msg.is_admin && !msg.read_at)
                        .map(msg => msg.id);
                    if (messageIds.length > 0) {
                        await markMessagesAsRead(userId, messageIds);
                    }
                }
                
                if (response.data.user) {
                    setSelectedUser(response.data.user);
                }
            } else {
                console.log('No new messages found');
            }
        } catch (err) {
            console.error('Error fetching new messages:', err);
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
            lastMessageIdRef.current = response.data.id;
            setMessageText('');
            
            await fetchConversations();
        } catch (err) {
            setError(t('admin.messages.send_error'));
        }
    };

    const handleMessageChange = (e) => {
        setMessageText(e.target.value);
    };

    const handleSelectUser = (userId) => {
        if (messagesIntervalRef.current) {
            clearInterval(messagesIntervalRef.current);
            messagesIntervalRef.current = null;
        }
        
        lastMessageIdRef.current = null;
        fetchAllMessages(userId);
    };

   
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages, selectedUser]);

    useEffect(() => {
        setLoading(true);
        fetchConversations().finally(() => setLoading(false));
        
        conversationsIntervalRef.current = setInterval(() => {
            fetchConversations();
        }, 10000);

        return () => {
            if (conversationsIntervalRef.current) {
                clearInterval(conversationsIntervalRef.current);
            }
        };
    }, [t]);

    useEffect(() => {
        if (messagesIntervalRef.current) {
            clearInterval(messagesIntervalRef.current);
            messagesIntervalRef.current = null;
        }

        if (selectedUser && messages.length > 0) {
            messagesIntervalRef.current = setInterval(() => {
                fetchNewMessages(selectedUser.id);
            }, 3000);
        }

        return () => {
            if (messagesIntervalRef.current) {
                clearInterval(messagesIntervalRef.current);
            }
        };
    }, [selectedUser, messages.length]);

    useEffect(() => {
        return () => {
            if (conversationsIntervalRef.current) {
                clearInterval(conversationsIntervalRef.current);
            }
            if (messagesIntervalRef.current) {
                clearInterval(messagesIntervalRef.current);
            }
        };
    }, []);

    return (
        <div className="page--admin-messages">
            <h1>{t('admin.messages.title')}</h1>
            
            <div className="admin-messages-container">
                <div className="conversations-list">
                    {loading && !selectedUser ? (
                        <div className="loading"></div>
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
                                    onClick={() => handleSelectUser(conv.id)}
                                >
                                    <div className="user-info">
                                        <strong>{conv.name}</strong>
                                        <small className='last-data'>
                                            {new Date(conv.last_message_time).toLocaleString()}
                                        </small>
                                    </div>
                                    <div className="last-message">
                                        <p>{conv.last_message}</p>
                                        {conv.unread_count > 0 && (
                                            <span className="unread-count">{conv.unread_count}</span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                
                <div className="messages-container">
                    {selectedUser ? (
                        <>
                            <h2>{t('admin.messages.chat_with')} {selectedUser.name}</h2>
                            {loading && messages.length === 0 ? (
                                <div className="loading"></div>
                            ) : error ? (
                                <p className="error">{error}</p>
                            ) : messages.length === 0 ? (
                                <p>{t('admin.messages.no_messages')}</p>
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
                                    placeholder={t('admin.messages.type_message')}
                                    required
                                />
                                <Button variant='icon' type="submit"><SendIcon/></Button>
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