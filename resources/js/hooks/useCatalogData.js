import { useState, useEffect } from 'react';

export default function useCatalogData(type, options = {}, skip = false) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (skip) {
        console.log('useCatalogData: Skipped fetch', { type, options });
        setData(type === 'product_details' ? {} : []);
        return;
      }

      try {
        setLoading(true);
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
    };

    fetchData();
  }, [type, options.category, options.subcategory, options.id, options.query, skip]);

  return { data, loading, error };
}