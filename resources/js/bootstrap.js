// src/bootstrap.js
import axios from 'axios';
import '../js/config/axios';

// Устанавливаем axios глобально
window.axios = axios;

// Настройка CSRF токена для Laravel
const token = document.querySelector('meta[name="csrf-token"]');
if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.getAttribute('content');
}

export default axios;