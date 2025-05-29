import { useState, useEffect } from 'react';

export default function useCatalogData(type, options = {}, skip = false) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Если skip=true, сбрасываем данные и не выполняем запрос
      if (skip) {
        console.log('useCatalogData: Skipped fetch', { type, options })
        setData(type === 'product_details' ? {} : []);
        setLoading(false);
        setError(null);
        return;
      }

      // Проверяем, что переданы необходимые параметры для запроса
      if (
        type &&
        (type !== 'subcategories' || options.category) &&
        (type !== 'products' || (options.category && options.subcategory)) &&
        (type !== 'product_details' || (options.id && options.category && options.subcategory))
      ) {
        try {
          setLoading(true);
          const params = new URLSearchParams({ type });
          if (options.category) params.append('category', options.category);
          if (options.subcategory) params.append('subcategory', options.subcategory);
          if (options.id) params.append('id', options.id);
          console.log('useCatalogData: Fetching URL', `/catalog/data?${params}`);
          const response = await fetch(`/catalog/data?${params}`);
          console.log('useCatalogData: Response status', response.status, response.statusText);
          const result = await response.json();
          console.log('useCatalogData: Response data', result);
          if (!response.ok || !result?.success) {
            throw new Error(result.error || 'Server error');
          }
          setData(result.data || (type === 'product_details' ? {} : []));
        } catch (err) {
          console.error('Fetch error:', err.message);
          setError(err);
        } finally {
          setLoading(false);
        }
      } else {
        setData(type === 'product_details' ? {} : []);
        setLoading(false);
        setError(null);
      }
    };

    fetchData();
  }, [type, options.category, options.subcategory, options.id, skip]);

  return { data, loading, error };
}