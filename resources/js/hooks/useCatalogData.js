// // export default function useCatalogData(type, category = null, subcategory = null) {
// //   const [data, setData] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         setLoading(true);
// //         setError(null);
        
// //         const params = new URLSearchParams({ type });
// //         if (category) params.append('category', category);
// //         if (subcategory) params.append('subcategory', subcategory);
        
// //         const response = await fetch(`/catalog/data?${params}`);
        
// //         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
// //         const result = await response.json();
        
// //         if (!result?.success) throw new Error(result.error || 'Invalid response');
        
// //         // Гарантируем, что data будет массивом
// //         setData(Array.isArray(result.data) ? result.data : []);

// //       } catch (err) {
// //         setError(err.message);
// //         console.error('Fetch error:', err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [type, category, subcategory]);

// //   return { data, loading, error };
// // }


// import { useState, useEffect } from 'react'; // Убедитесь, что есть этот импорт

// export default function useCatalogData(type, category = null, subcategory = null) {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const params = new URLSearchParams({ type });
//         if (category) params.append('category', category);
//         if (subcategory) params.append('subcategory', subcategory);
        
//         const response = await fetch(`/catalog/data?${params}`);
//         const result = await response.json();
        
//         if (!result.success) throw new Error(result.error || 'Request failed');
        
//         setData(result.data);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [type, category, subcategory]);

//   return { data, loading, error };
// }
import { useState, useEffect } from 'react';

// Явно экспортируем хук как default
export default function useCatalogData(type, category = null) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ type });
        if (category) params.append('category', category);
        
        const response = await fetch(`/catalog/data?${params}`);
        const result = await response.json();
        
        if (!result?.success) throw new Error(result.error || 'Server error');
        setData(result.data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, category]);

  return { data, loading, error };
}