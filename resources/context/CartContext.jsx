import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { debounce } from 'lodash';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [optimisticUpdates, setOptimisticUpdates] = useState({});


    // Мемоизированная функция загрузки корзины
    const fetchCart = useCallback(async () => {
        if (!isAuthenticated || !user) {
            setCartItems([]);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('/api/cart');
            setCartItems(response.data.items || []);
        } catch (error) {
            console.error('Failed to load cart:', error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, user]);

    // Загрузка корзины при монтировании или изменении авторизации
    useEffect(() => {
        if (authLoading) return;
        fetchCart();
    }, [authLoading, fetchCart]);

    // Дебаунс для синхронизации с сервером
    const debouncedSyncCart = useMemo(
        () => debounce(async (productId, quantity) => {
            try {
                await axios.put('/api/cart/update', { 
                    product_id: productId, 
                    quantity 
                });
            } catch (error) {
                console.error('Failed to sync cart:', error);
                fetchCart(); // Восстанавливаем актуальное состояние при ошибке
            }
        }, 500),
        [fetchCart]
    );

    const updateCart = useCallback(async (productId, quantity) => {
        if (!isAuthenticated) {
            return { success: false, error: 'User must be authenticated' };
        }

        setOptimisticUpdates(prev => ({ ...prev, [productId]: quantity }));
        setCartItems(prev => 
            prev.map(item => 
                item.product_id === productId ? { ...item, quantity } : item
            )
        );

        try {
            await debouncedSyncCart(productId, quantity);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to update cart'
            };
        } finally {
            setOptimisticUpdates(prev => {
                const newState = { ...prev };
                delete newState[productId];
                return newState;
            });
        }
    }, [isAuthenticated, debouncedSyncCart]);


    const removeFromCart = useCallback(async (productId) => {
        if (!isAuthenticated) {
            return { success: false, error: 'User must be authenticated' };
        }

        setCartItems(prev => prev.filter(item => item.product_id !== productId));

        try {
            await axios.delete(`/api/cart/remove/${productId}`);
            return { success: true };
        } catch (error) {
            // Восстанавливаем состояние при ошибке
            fetchCart();
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to remove item from cart'
            };
        }
    }, [isAuthenticated, fetchCart]);


    // Добавление в корзину с оптимистичным обновлением
    const addToCart = useCallback(async (productId, quantity = 1) => {
        if (!isAuthenticated) {
            return { success: false, error: 'User must be authenticated' };
        }

        setCartItems(prev => {
            const existingItem = prev.find(item => item.product_id === productId);
            return existingItem 
                ? prev.map(item => 
                    item.product_id === productId 
                        ? { ...item, quantity: item.quantity + quantity } 
                        : item
                )
                : [...prev, { product_id: productId, quantity, product: null }];
        });

        try {
            const response = await axios.post('/api/cart/add', {
                product_id: productId,
                quantity
            });
            setCartItems(response.data.cart.items);
            return { success: true };
        } catch (error) {
            fetchCart(); // Откат при ошибке
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to add item to cart'
            };
        }
    }, [isAuthenticated, fetchCart]);

    // Очистка корзины
    const clearCart = useCallback(async () => {
        if (!isAuthenticated) {
            return { success: false, error: 'User must be authenticated' };
        }
        setCartItems([]);

        try {
            await axios.delete('/api/cart/clear');
            return { success: true };
        } catch (error) {
            fetchCart(); // Откат при ошибке
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to clear cart'
            };
        }
    }, [isAuthenticated, fetchCart]);

    // Мемоизированное значение контекста
    const contextValue = useMemo(() => ({
        cartItems: cartItems.map(item => ({
            ...item,
            quantity: optimisticUpdates[item.product_id] ?? item.quantity
        })),
        loading,
        addToCart,
        removeFromCart,
        updateCart,
        clearCart,
        fetchCart // Для принудительного обновления
    }), [cartItems, loading, addToCart, removeFromCart, updateCart, clearCart, fetchCart, optimisticUpdates]);

    // Отмена дебаунса при размонтировании
    useEffect(() => {
        return () => {
            debouncedSyncCart.cancel();
        };
    }, [debouncedSyncCart]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};