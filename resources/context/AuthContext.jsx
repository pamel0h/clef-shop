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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Настройка axios
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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
            localStorage.removeItem('auth_token');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/login', {
                email,
                password
            });

            const { user, access_token } = response.data;
            
            localStorage.setItem('auth_token', access_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            
            setUser(user);
            setIsAuthenticated(true);
            
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

            const { user, access_token } = response.data;
            
            localStorage.setItem('auth_token', access_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            
            setUser(user);
            setIsAuthenticated(true);
            
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
            localStorage.removeItem('auth_token');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    // Методы для проверки ролей
    const isAdmin = () => {
        return user && (user.role === 'admin' || user.role === 'super_admin');
    };

    const isSuperAdmin = () => {
        return user && user.role === 'super_admin';
    };

    const isUser = () => {
        return user && user.role === 'user';
    };

    const hasRole = (role) => {
        return user && user.role === role;
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isSuperAdmin,
        isUser,
        hasRole
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};