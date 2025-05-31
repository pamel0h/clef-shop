import { useParams, useLocation } from 'react-router-dom';
import useCatalogData from '../../../hooks/useCatalogData';
import ProductsList from './ProductsList';
// import '../../../../css/components.css';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';

const ProductsPage = () => {
  const { t } = useTranslation();
  const { categorySlug, subcategorySlug } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query') || '';
  const context = useOutletContext();
  const query = context?.query || searchQuery;
  const filters = context?.filters || location.state?.filters || {};
  const sortOption = context?.sortOption || location.state?.sortOption || {};
  const isSearchPage = location.pathname.startsWith('/search');

  const { data: products, loading, error } = useCatalogData(
    isSearchPage ? 'search' : 'products',
    isSearchPage
      ? { query }
      : { 
          category: categorySlug, 
          subcategory: subcategorySlug 
        }
  );

  console.log('ProductsPage: State', {
    isSearchPage,
    query,
    categorySlug,
    subcategorySlug,
    loading,
    error,
    products,
    location: location.pathname + location.search,
    filters,
    sortOption,
  });

  if (loading) return <div className="loading">{t('Loading')}...</div>;
  if (error) return <div>{t('Error')}: {error.message}</div>;
  console.log('ProductsPage: Extracted from location.state', { filters, sortOption });

  return (
    <>
    {isSearchPage && <h2>{t('search.result')}: {query}</h2>}
    <ProductsList
      products={products}
      emptyMessage={t('No products found')}
      isSearchPage={isSearchPage}
      query={query}
      initialFilters={filters} // Передаем фильтры
      initialSortOption={sortOption} // Передаем сортировку
    />
    </>
  );
};

export default ProductsPage;