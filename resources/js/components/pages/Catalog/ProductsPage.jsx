import { useOutletContext } from 'react-router-dom';
import ProductsList from './ProductsList';
import '../../../../css/components/Products.css';
import useCatalogData from '../../../hooks/useCatalogData';

const ProductsPage = () => {
  const { query } = useOutletContext(); // Получаем query из SearchPage
  const isSearchPage = !!query; // Определяем, что это страница поиска
  const { data: products, loading, error } = useCatalogData(
    'search',
    { query },
    !isSearchPage || !query
  );

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ProductsList
      products={products}
      emptyMessage={`Ничего не найдено по запросу "${query}"`}
      isSearchPage={isSearchPage}
      query={query}
    />
  );
};

export default ProductsPage;