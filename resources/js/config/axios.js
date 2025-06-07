// src/config/axios.js
import axios from 'axios';


// Добавляем заголовки по умолчанию

axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';


// Интерцептор для обработки ошибок
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Токен недействителен, удаляем его
            localStorage.removeItem('auth_token');
            delete axios.defaults.headers.common['Authorization'];
            
            // Перенаправляем на главную страницу
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default axios;