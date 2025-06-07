// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null); // Добавляем состояние для токена
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false); // Добавляем состояние

    // Настройка axios и проверка аутентификации при монтировании
    useEffect(() => {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
            setToken(storedToken); // Устанавливаем токен в состояние
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            checkAuth();
        } else {
            setLoading(false);
        }
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get('/api/user');
            setUser(response.data.user);
            setIsAuthenticated(true);
        } catch (error) {
            handleLogout();
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/login', {
                email,
                password
            });

            const { user, access_token, show_subscription } = response.data;
            
            localStorage.setItem('auth_token', access_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            
            setUser(user);
            setToken(access_token); // Устанавливаем токен в состояние
            setIsAuthenticated(true);

            // Показываем модалку, если сервер вернул флаг и она еще не показывалась
            if (show_subscription && !sessionStorage.getItem('subscription_shown')) {
                setShowSubscriptionModal(true);
                sessionStorage.setItem('subscription_shown', 'true');
            }
            
            return { success: true, user };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    const register = async (name, email, password, passwordConfirmation) => {
        try {
            const response = await axios.post('/api/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            });

            const { user, access_token, show_subscription } = response.data;
            
            localStorage.setItem('auth_token', access_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            
            setUser(user);
            setToken(access_token); // Устанавливаем токен в состояние
            setIsAuthenticated(true);

            // Показываем модалку, если сервер вернул флаг и она еще не показывалась
            if (show_subscription && !sessionStorage.getItem('subscription_shown')) {
                setShowSubscriptionModal(true);
                sessionStorage.setItem('subscription_shown', 'true');
            }
            
            return { success: true, user };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Registration failed' 
            };
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            handleLogout();
        }
    };

    const openSubscriptionModal = () => setShowSubscriptionModal(true);
    const closeSubscriptionModal = () => setShowSubscriptionModal(false);

    // Методы для проверки ролей
    const isAdmin = () => user?.role === 'admin' || user?.role === 'super_admin';
    const isSuperAdmin = () => user?.role === 'super_admin';
    const isUser = () => user?.role === 'user';
    const hasRole = (role) => user?.role === role;

    const value = {
        user,
        token, // Теперь предоставляем токен в контексте
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isSuperAdmin,
        isUser,
        hasRole,
        showSubscriptionModal, // Добавляем это поле
        openSubscriptionModal, // Методы для управления модалкой
        closeSubscriptionModal
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};