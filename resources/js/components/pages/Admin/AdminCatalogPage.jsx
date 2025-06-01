import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useCatalogData from '../../../hooks/useCatalogData';
import Button from '../../UI/Button';
import AdminProductFilter from './AdminProductFilter';
// import '../../../../css/components/AdminCatalog.css';

const AdminCatalogPage = () => {
  const { t } = useTranslation();
  const { data: products, loading, error } = useCatalogData('admin_catalog');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Инициализация отфильтрованных товаров
  useEffect(() => {
    if (products && products.length > 0) {
      setFilteredProducts(products);
      console.log('AdminCatalogPage: Initialized filteredProducts', products);
    }
  }, [products]);

  // Функция обработки изменений фильтров
  const handleFilterChange = (newFilters) => {
    if (!products) {
      console.warn('AdminCatalogPage: No products available for filtering');
      return;
    }

    console.log('AdminCatalogPage: Applying filters', newFilters);

    const filtered = products.filter((product) => {
      const price = Number(product.price) || 0;
      const discountPrice = product.discount ? price * (1 - product.discount / 100) : price;

      // Фильтр по цене
      if (newFilters.priceRange && (discountPrice < newFilters.priceRange[0] || discountPrice > newFilters.priceRange[1])) {
        return false;
      }

      // Фильтр по бренду
      if (newFilters.brand !== 'all' && product.brand !== newFilters.brand) {
        return false;
      }

      // Фильтр по категории
      if (newFilters.category !== 'all' && product.category !== newFilters.category) {
        return false;
      }

      // Фильтр по подкатегории
      if (newFilters.subcategory !== 'all' && product.subcategory !== newFilters.subcategory) {
        return false;
      }

      return true;
    });

    console.log('AdminCatalogPage: Filtered products', filtered);
    setFilteredProducts(filtered);
  };

  // Функция для удаления товара (заглушка)
  const handleDeleteProduct = (id) => {
    console.log('Delete product with id:', id);
    // Реализуем позже с методом destroy
  };

  if (loading) return <div className="loading">{t('Loading')}...</div>;
  if (error) return <div>{t('Error')}: {error.message}</div>;
  if (!products || products.length === 0) return <div>{t('admin.catalog.noProducts')}</div>;

  return (
    <div className="admin-catalog-page">
      <h1>{t('admin.catalog.title')}</h1>
      <div className="admin-catalog-layout">
        <div className="filter-column">
          <AdminProductFilter
            initialProducts={products}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div className="table-column">
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>№</th>
                <th>{t('admin.catalog.name')}</th>
                <th>{t('admin.catalog.price')}</th>
                <th>{t('admin.catalog.discount')}</th>
                <th>{t('admin.catalog.category')}</th>
                <th>{t('admin.catalog.subcategory')}</th>
                <th>{t('admin.catalog.brand')}</th>
                <th>{t('admin.catalog.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td>{product.name || '-'}</td>
                    <td>{product.price ? `${product.price} ₽` : '-'}</td>
                    <td>{product.discount ? `${product.discount}%` : '-'}</td>
                    <td>{t(`category.${product.category}`) || '-'}</td>
                    <td>{t(`subcategory.${product.category}.${product.subcategory}`) || '-'}</td>
                    <td>{product.brand || '-'}</td>
                    <td>
                      <Button
                        className="delete-button"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        {t('admin.catalog.delete')}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>
                    {t('admin.catalog.noFilteredProducts')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCatalogPage;