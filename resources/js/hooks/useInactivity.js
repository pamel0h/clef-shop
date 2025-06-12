// src/hooks/useInactivity.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const updateLastActivity = () => {
    const now = Date.now();
    sessionStorage.setItem('lastActivity', now);
    console.log('Activity updated at:', new Date(now).toLocaleTimeString());
};

export const useInactivity = (userName, token, logout) => {
    const [showModal, setShowModal] = useState(false);

    const checkTokenValidity = useCallback(async () => {
        if (!token) {
            console.log('No token available');
            return false;
        }
        
        try {
            await axios.get('/api/user', {
                headers: { Authorization: `Bearer ${token}` },
            });
            return true;
        } catch (error) {
            if (error.response?.status === 401) {
                logout();
            }
            return false;
        }
    }, [token, logout]);

    const handleContinue = useCallback(async () => {
        const isValid = await checkTokenValidity();
        if (isValid) {
            setShowModal(false);
            updateLastActivity();
        }
    }, [checkTokenValidity]);

    useEffect(() => {
        if (!token) return; // Не запускаем таймер, если нет токена

        const checkInactivity = async () => {
            const lastActivity = sessionStorage.getItem('lastActivity');
            
            if (!lastActivity) {
                updateLastActivity(); // Инициализируем при первом запуске
                return;
            }

            const inactiveMinutes = (Date.now() - parseInt(lastActivity)) / 1000 / 60;
            
            if (inactiveMinutes >= 1) { // 5 минут неактивности
                const isValid = await checkTokenValidity();
                if (isValid) {
                    setShowModal(true);
                }
            }
        };

        // Обработчики активности пользователя
        const events = ['mousedown', 'keypress', 'scroll', 'touchstart'];
        const handleActivity = () => updateLastActivity();
        
        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        const interval = setInterval(checkInactivity, 10000); 
        
        // Первая проверка при монтировании
        checkInactivity();

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
            clearInterval(interval);
        };
    }, [token, checkTokenValidity]);

    return { showModal, handleContinue };
};