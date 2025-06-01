import { useState, useEffect, useCallback } from 'react';

// useCatalogData.js
export default function useCatalogData(type, options = {}, skip = false) {
  const [data, setData] = useState(type === 'product_details' ? {} : []); // Инициализируем объект для product_details
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (skip) {
      console.log('useCatalogData: Skipped fetch', { type, options });
      setData(type === 'product_details' ? {} : []);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Сбрасываем данные в начале загрузки
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
      } else {
        const params = new URLSearchParams({ type });
        if (options.category) params.append('category', options.category);
        if (options.subcategory) params.append('subcategory', options.subcategory);
        if (options.id) params.append('id', options.id);
        url = `/api/catalog/data?${params}`;
      }

      console.log('useCatalogData: Fetching URL', url, 'options:', options);
      const response = await fetch(url);
      console.log('useCatalogData: Response status', response.status, response.statusText);
      const result = await response.json();
      console.log('useCatalogData: Response data', result);
      
      if (!response.ok || !result?.success) {
        throw new Error(result.error || 'Server error');
      }
      
      setData(result.data || (type === 'product_details' ? {} : []));
    } catch (err) {
      console.error('useCatalogData: Fetch error:', err.message);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [type, options.category, options.subcategory, options.id, options.query, skip]);

  // Сбрасываем данные при изменении ключевых параметров
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