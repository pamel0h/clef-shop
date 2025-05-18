import { useState, useEffect } from 'react';

export default function useCatalogData(type, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
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

          const response = await fetch(`/catalog/data?${params}`);
          const result = await response.json();

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
      }
    };

    fetchData();
  }, [type, options.category, options.subcategory, options.id]);

  return { data, loading, error };
}