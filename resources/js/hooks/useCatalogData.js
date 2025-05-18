// // resources/js/hooks/useCatalogData.js
// import { useState, useEffect } from 'react';

// export default function useCatalogData(type, options = {}) {
//   console.log('useCatalogData CALLED with:', { type, options }, 'at:', new Date().toISOString(), 'caller:', new Error().stack);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
// console.log('useCatalogData CALLED with:', { type, options }, 'at:', new Date().toISOString(), 'caller:', new Error().stack);
//     const fetchData = async () => {

//         // Проверяем, что все необходимые параметры определены
//         if (type && (type !== 'subcategories' || options.category) && (type !== 'products' || (options.category && options.subcategory))) {

//       try {
//         setLoading(true);
//         const params = new URLSearchParams({ type });
//         if (options.category) {
//           console.log('Adding category to params:', options.category); // Отладка
//           params.append('category', options.category);
//         }
//         if (options.subcategory) params.append('subcategory', options.subcategory);

//         console.log('Fetching data with params:', params.toString());
//         const response = await fetch(`/catalog/data?${params}`);
//         const result = await response.json();

//         console.log('API response:', result);

//         if (!result?.success) {
//           throw new Error(result.error || 'Server error');
//         }
//         setData(result.data || []);
//       } catch (err) {
//         console.error('Fetch error:', err.message);
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       // Если параметры не определены, не выполняем запрос и устанавливаем пустые данные
//       setData([]);
//       setLoading(false);
//     }
//   };

//     fetchData();
//   }, [type, options.category, options.subcategory]);

//   return { data, loading, error };
// }


// // // hooks/useCatalogData.js
// // import { useState, useEffect } from 'react';

// // const cache = {};
// // const pendingRequests = {};

// // export default function useCatalogData(type, options = {}, caller = 'unknown') {
// //   const cacheKey = `${type}-${options.category || ''}-${options.subcategory || ''}`;
  
// //   const [state, setState] = useState(() => ({
// //     data: cache[cacheKey] || [],
// //     loading: !cache[cacheKey],
// //     error: null
// //   }));

// //   useEffect(() => {
// //     if (!type) return;

// //     const shouldFetch =
// //       (type === 'categories') ||
// //       (type === 'subcategories' && options.category) ||
// //       (type === 'products' && options.category && options.subcategory);

// //     // Сброс состояния при невалидном запросе
// //     if (!shouldFetch) {
// //       setState({ data: [], loading: false, error: null });
// //       return;
// //     }

// //     const controller = new AbortController();

// //     const fetchData = async () => {
// //       try {
// //         setState(prev => ({ ...prev, loading: true }));
        
// //         const params = new URLSearchParams({ type });
// //         if (options.category) params.append('category', options.category);
// //         if (options.subcategory) params.append('subcategory', options.subcategory);

// //         const response = await fetch(`/catalog/data?${params}`, {
// //           signal: controller.signal
// //         });
        
// //         if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
// //         const result = await response.json();
// //         if (!result?.success) throw new Error(result.error || 'Ошибка сервера');

// //         // Атомарное обновление кэша и состояния
// //         cache[cacheKey] = result.data;
// //         setState({
// //           data: result.data,
// //           loading: false,
// //           error: null
// //         });

// //       } catch (error) {
// //         if (error.name !== 'AbortError') {
// //           setState({
// //             data: [],
// //             loading: false,
// //             error: error.message
// //           });
// //         }
// //       } finally {
// //         delete pendingRequests[cacheKey];
// //       }
// //     };

// //     // Если данные в кэше - сразу используем
// //     if (cache[cacheKey]) {
// //       setState({
// //         data: cache[cacheKey],
// //         loading: false,
// //         error: null
// //       });
// //       return;
// //     }

// //     // Запускаем запрос если не в процессе
// //     if (!pendingRequests[cacheKey]) {
// //       pendingRequests[cacheKey] = fetchData();
// //     }

// //     return () => controller.abort();
// //   }, [type, options.category, options.subcategory, cacheKey]);

// //   return state;
// // }


// resources/js/hooks/useCatalogData.js
import { useState, useEffect } from 'react';

export default function useCatalogData(type, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {

        // Проверяем, что все необходимые параметры определены
        if (type && (type !== 'subcategories' || options.category) && (type !== 'products' || (options.category && options.subcategory))) {

      try {
        setLoading(true);
        const params = new URLSearchParams({ type });
        if (options.category) {
          console.log('Adding category to params:', options.category); // Отладка
          params.append('category', options.category);
        }
        if (options.subcategory) params.append('subcategory', options.subcategory);

        console.log('Fetching data with params:', params.toString());
        const response = await fetch(`/catalog/data?${params}`);
        const result = await response.json();

        console.log('API response:', result);

        if (!result?.success) {
          throw new Error(result.error || 'Server error');
        }
        setData(result.data || []);
      } catch (err) {
        console.error('Fetch error:', err.message);
        setError(err);
      } finally {
        setLoading(false);
      }
    } else {
      // Если параметры не определены, не выполняем запрос и устанавливаем пустые данные
      setData([]);
      setLoading(false);
    }
  };

    fetchData();
  }, [type, options.category, options.subcategory]);

  return { data, loading, error };
}