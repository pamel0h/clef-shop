import { useState, useEffect, useCallback } from 'react';

export default function useCatalogData(type, options = {}, skip = false) {
  const [data, setData] = useState(type === 'product_details' ? {} : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Функция для получения токена авторизации
  const getAuthToken = () => {
    return localStorage.getItem('auth_token') || localStorage.getItem('token');
  };

  // Функция для получения CSRF токена
  const getCSRFToken = () => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute('content') : null;
  };

  const fetchData = useCallback(async () => {
    if (skip) {
      console.log('useCatalogData: Skipped fetch', { type, options });
      setData(type === 'product_details' ? {} : []);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setData(type === 'product_details' ? {} : []);

      let url;
      let headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      };

   // Добавляем авторизацию для админских запросов
   const isAdminRequest = type === 'admin_catalog' || type === 'brands' || type === 'spec_keys';
   if (isAdminRequest) {
     const token = getAuthToken();
     if (token) {
       headers['Authorization'] = `Bearer ${token}`;
     }
     
     // Добавляем CSRF токен из мета-тега Laravel
     const csrfMeta = document.querySelector('meta[name="csrf-token"]');
     if (csrfMeta) {
       headers['X-CSRF-TOKEN'] = csrfMeta.getAttribute('content');
     }
   }

      if (type === 'search') {
        url = `/api/search?query=${encodeURIComponent(options.query)}`;
      } else if (type === 'product_details' && options.query) {
        url = `/api/search?id=${encodeURIComponent(options.id)}&query=${encodeURIComponent(options.query)}`;
      } else if (type === 'products') {
        const params = new URLSearchParams({ type });
        if (options.category) params.append('category', options.category);
        if (options.subcategory) params.append('subcategory', options.subcategory);
        url = `/api/catalog/data?${params}`;
      } else if (type === 'admin_catalog') {
        url = `/api/admin/catalog/data`;
      } else if (type === 'brands') {
        url = `/api/admin/catalog/brands`;
      } else if (type === 'spec_keys') {
        url = `/api/admin/catalog/spec-keys`;
      } else {
        const params = new URLSearchParams({ type });
        if (options.category) params.append('category', options.category);
        if (options.subcategory) params.append('subcategory', options.subcategory);
        if (options.id) params.append('id', options.id);
        url = `/api/catalog/data?${params}`;
      }

      console.log('useCatalogData: Fetching URL', url, 'options:', options);
      const response = await fetch(url, { headers });
      console.log('useCatalogData: Response status', response.status, response.statusText);

      if (!response.ok) {
        // Если ошибка авторизации, выводим специфичное сообщение
        if (response.status === 401) {
          throw new Error('Требуется авторизация');
        } else if (response.status === 403) {
          throw new Error('Доступ запрещен');
        } else {
          throw new Error(`HTTP error ${response.status}`);
        }
      }

      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('useCatalogData: Non-JSON response:', textResponse);
        throw new Error('Ожидался JSON-ответ, получен неверный формат');
      }

      const result = await response.json();
      console.log('useCatalogData: Response data', result);

      if (!result?.success) {
        throw new Error(result.error || 'Ошибка сервера');
      }

      setData(result.data || (type === 'product_details' ? {} : []));
    } catch (err) {
      console.error('useCatalogData: Fetch error:', err.message);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [type, options.category, options.subcategory, options.id, options.query, skip]);

  useEffect(() => {
    setData(type === 'product_details' ? {} : []);
    setError(null);
  }, [type, options.id, options.query, options.category, options.subcategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchData 
  };
}