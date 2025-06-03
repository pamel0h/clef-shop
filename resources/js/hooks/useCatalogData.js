import { useState, useEffect, useCallback, useRef } from 'react';

export default function useCatalogData(type, options = {}, skip = false) {
  const [data, setData] = useState(type === 'product_details' ? {} : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (skip) {
      console.log('useCatalogData: Пропущен запрос', { type, options });
      setData(type === 'product_details' ? {} : []);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setData(type === 'product_details' ? {} : []);

      let url;
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

      console.log('useCatalogData: Запрашиваем URL', url, 'опции:', options);
      const response = await fetch(url);
      console.log('useCatalogData: Статус ответа', response.status, response.statusText);

      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Ожидался JSON-ответ, получен неверный формат');
      }

      const result = await response.json();
      console.log('useCatalogData: Данные ответа', result);

      if (!response.ok || !result?.success) {
        throw new Error(result.error || `Ошибка HTTP ${response.status}`);
      }

      setData(result.data || (type === 'product_details' ? {} : []));
    } catch (err) {
      console.error('useCatalogData: Ошибка запроса:', err.message);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [type, options.category, options.subcategory, options.id, options.query, skip]);

  const checkForUpdates = useCallback(async () => {
    if (skip) return;

    try {
      const url = `/api/catalog/last-updated`;
      const response = await fetch(url);
      const result = await response.json();

      if (result.success && result.last_updated) {
        if (lastUpdated && result.last_updated !== lastUpdated) {
          console.log('useCatalogData: Данные обновлены, перезапрашиваем...', { type });
          await fetchData();
        }
        setLastUpdated(result.last_updated);
      }
    } catch (err) {
      console.error('useCatalogData: Ошибка проверки обновлений:', err.message);
    }
  }, [skip, type, lastUpdated, fetchData]);

  // Включаем пулинг для всех типов
  useEffect(() => {
    if (skip) return;

    const shouldPoll = ['categories', 'products', 'product_details', 'admin_catalog', 'brands', 'spec_keys'].includes(type);
    
    if (shouldPoll) {
      intervalRef.current = setInterval(checkForUpdates, 10000); // Проверяем каждые 10 секунд
      console.log('useCatalogData: Пулинг запущен для', type);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log('useCatalogData: Пулинг остановлен для', type);
      }
    };
  }, [checkForUpdates, skip, type]);

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