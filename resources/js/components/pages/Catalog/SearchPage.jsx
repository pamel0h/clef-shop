// components/pages/Catalog/SearchPage.jsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import  Breadcrumbs  from './Breadcrumbs';
import ProductsList from './ProductsList';
import { useTranslation } from 'react-i18next';

function SearchPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || '';

  useEffect(() => {
    console.log('SearchPage: Query received:', query);
    if (!query) {
      console.log('SearchPage: No query, resetting products');
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const url = `/search?query=${encodeURIComponent(query)}`;
    console.log('SearchPage: Fetching URL:', url);
    fetch(url)
      .then((res) => {
        console.log('SearchPage: API response status:', res.status, res.statusText);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('SearchPage: API response data:', data);
        if (data.success) {
          const formattedProducts = data.data.map((product) => ({
            id: product.id || product._id,
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image || (product.images?.[0] ? `/storage/product_images/${product.images[0]}` : '/images/no-image.png'),
            images: product.images || [],
            category: product.category,
            subcategory: product.subcategory,
            brand: product.brand,
            discount: product.discount || 0,
            description: product.description || '',
            specs: product.specs || {},
          }));
          console.log('SearchPage: Formatted products:', formattedProducts);
          setProducts(formattedProducts);
        } else {
          setError(data.error || 'Ошибка при поиске');
          console.log('SearchPage: API error:', data.error);
        }
      })
      .catch((err) => {
        setError('Ошибка сети: ' + err.message);
        console.error('SearchPage: Fetch error:', err);
      })
      .finally(() => {
        console.log('SearchPage: Fetch completed');
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="search-page page">
      <h1>{t('search.mainTitle')}</h1>
      <Breadcrumbs /> 
      <h2>Результаты поиска по запросу: {query || 'Ничего не введено'}</h2>
      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : error ? (
        <div className="error">Ошибка: {error}</div>
      ) : (
        <ProductsList
          products={products}
          emptyMessage={`Ничего не найдено по запросу "${query}"`}
          isSearchPage={true}
          query={query}
        />
      )}
    </div>
  );
}

export default SearchPage;