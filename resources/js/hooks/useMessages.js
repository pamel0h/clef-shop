import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export const useMessages = (options = {}) => {
    const {
        initialMessages = [],
        fetchUrl = '',
        fetchSinceUrl = '',
        sendUrl = '',
        markReadUrl = '',
        isAdmin = false,
        pollingInterval = 5000
    } = options;

    const { t } = useTranslation();
    const [messages, setMessages] = useState(initialMessages);
    const [selectedUser, setSelectedUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const lastMessageIdRef = useRef(null);
    const lastConversationUpdateRef = useRef(null);
    const messagesIntervalRef = useRef(null);
    const conversationsIntervalRef = useRef(null);

    const fetchConversations = async () => {
        if (!fetchUrl) return;

        try {
            const response = await axios.get(fetchUrl);
            const currentDataString = JSON.stringify(response.data);
            
            if (lastConversationUpdateRef.current !== currentDataString) {
                setConversations(response.data);
                lastConversationUpdateRef.current = currentDataString;
            }
        } catch (err) {
            console.error('Error fetching conversations:', err);
            if (!conversations.length) {
                setError(t('messages.load_error'));
            }
        }
    };

    const fetchAllMessages = async (userId) => {
        if (!fetchUrl) return;

        setLoading(true);
        setError('');
        try {
            const url = isAdmin 
                ? `${fetchUrl}/${userId}`
                : fetchUrl;
                
            const response = await axios.get(url);
            
            const fetchedMessages = isAdmin ? response.data.messages : response.data;
            const userData = isAdmin ? response.data.user : null;
            
            setMessages(fetchedMessages);
            if (isAdmin) setSelectedUser(userData);
            
            if (fetchedMessages.length > 0) {
                lastMessageIdRef.current = fetchedMessages[fetchedMessages.length - 1].id;
            }
        } catch (err) {
            console.error('Error fetching all messages:', err);
            setError(t('messages.load_error'));
        } finally {
            setLoading(false);
        }
    };

    const fetchNewMessages = async (userId) => {
        if (!lastMessageIdRef.current || !fetchSinceUrl) return;
        
        try {
            const url = isAdmin 
                ? `${fetchSinceUrl}/${userId}?since=${lastMessageIdRef.current}`
                : `${fetchSinceUrl}?since=${lastMessageIdRef.current}`;
                
            const response = await axios.get(url);
            
            const newMessages = isAdmin ? response.data.messages : response.data;
            if (newMessages && newMessages.length > 0) {
                setMessages(prev => [...prev, ...newMessages]);
                lastMessageIdRef.current = newMessages[newMessages.length - 1].id;
                
                if (isAdmin && selectedUser && selectedUser.id === userId) {
                    const unreadMessages = newMessages
                        .filter(msg => !msg.is_admin && !msg.read_at)
                        .map(msg => msg.id);
                        
                    if (unreadMessages.length > 0) {
                        await markMessagesAsRead(userId, unreadMessages);
                    }
                }
            }
        } catch (err) {
            console.error('Error fetching new messages:', err);
        }
    };

    const markMessagesAsRead = async (userId, messageIds) => {
        if (!markReadUrl) return;
        
        try {
            await axios.post(`${markReadUrl}/${userId}/mark-read`, {
                message_ids: messageIds,
            });
            await fetchConversations();
        } catch (err) {
            console.error('Error marking messages as read:', err);
        }
    };

    const sendMessage = async (messageText, userId = null) => {
        if (!sendUrl) return;

        setError('');
        try {
            const url = isAdmin && userId 
                ? `${sendUrl}/${userId}`
                : sendUrl;
                
            const response = await axios.post(url, {
                message: messageText
            });
            
            setMessages(prev => [...prev, response.data]);
            lastMessageIdRef.current = response.data.id;
            
            if (isAdmin) {
                await fetchConversations();
            }
            
            return true;
        } catch (err) {
            setError(t('messages.send_error'));
            return false;
        }
    };

    const selectUser = (userId) => {
        if (messagesIntervalRef.current) {
            clearInterval(messagesIntervalRef.current);
            messagesIntervalRef.current = null;
        }
        
        lastMessageIdRef.current = null;
        if (isAdmin) {
            fetchAllMessages(userId);
        }
    };

    
    useEffect(() => {
        if (isAdmin) {
            fetchConversations();
            
            conversationsIntervalRef.current = setInterval(() => {
                fetchConversations();
            }, pollingInterval);
        }

        return () => {
            if (conversationsIntervalRef.current) {
                clearInterval(conversationsIntervalRef.current);
            }
        };
    }, [isAdmin, pollingInterval]);

    
    useEffect(() => {
        if (messagesIntervalRef.current) {
            clearInterval(messagesIntervalRef.current);
            messagesIntervalRef.current = null;
        }

        if (messages.length > 0 && (isAdmin ? selectedUser : true)) {
            messagesIntervalRef.current = setInterval(() => {
                fetchNewMessages(isAdmin ? selectedUser.id : null);
            }, pollingInterval);
        }

        return () => {
            if (messagesIntervalRef.current) {
                clearInterval(messagesIntervalRef.current);
            }
        };
    }, [messages.length, selectedUser, isAdmin, pollingInterval]);

   
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

    return {
        messages,
        setMessages,
        conversations,
        selectedUser,
        loading,
        error,
        fetchAllMessages,
        fetchConversations,
        sendMessage,
        selectUser,
        lastMessageIdRef
    };
};