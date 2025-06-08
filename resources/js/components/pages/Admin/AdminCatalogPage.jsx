import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useCatalogData from '../../../hooks/useCatalogData';
import Button from '../../UI/Button';
import { ProductFilter } from '../Catalog/ProductFilter';
import useProductFilteringAndSorting from '../../../hooks/useProductFilteringAndSorting';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import '../../../../css/components/AdminCatalog.css';

const AdminCatalogPage = () => {
  const { t } = useTranslation();
  const { data: products, loading, error, refetch, reloadTranslations } = useCatalogData('admin_catalog');
  const isAdminPage = true;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Сохраняем фильтры и сортировку
  const [savedFilters, setSavedFilters] = useState(null);
  const [savedSortOption, setSavedSortOption] = useState({ field: 'name', direction: 'asc' });

  const { filteredProducts, sortOption, handleFilterChange, handleSortChange } = useProductFilteringAndSorting(
    products || [],
    savedSortOption,
    isAdminPage
  );

  const getCSRFToken = () => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute('content') : null;
  };

  const handleAddProduct = async () => {
    console.log('Product added successfully');
    await refetch(true);
    if (savedFilters) {
      handleFilterChange(savedFilters);
    }
    if (savedSortOption) {
      handleSortChange(savedSortOption.field, savedSortOption.direction);
    }
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    console.log('Product updated successfully');
    await refetch(true);
    if (savedFilters) {
      handleFilterChange(savedFilters);
    }
    if (savedSortOption) {
      handleSortChange(savedSortOption.field, savedSortOption.direction);
    }
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');

      const headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/admin/catalog/${productToDelete.id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setShowDeleteModal(false);
        setProductToDelete(null);
        // Обновляем переводы и данные
        await reloadTranslations();
        await refetch(true);
        // Восстанавливаем фильтры и сортировку
        if (savedFilters) {
          handleFilterChange(savedFilters);
        }
        if (savedSortOption) {
          handleSortChange(savedSortOption.field, savedSortOption.direction);
        }
        console.log('Product deleted successfully');
      } else {
        throw new Error(data.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Ошибка при удалении товара: ' + error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');

      const headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/admin/catalog/export', {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'catalog_export.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      console.log('CSV exported successfully');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert(t('admin.catalog.exportError') + error.message);
    }
  };

  const handleImportCSV = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      const formData = new FormData();
      const csvFile = Array.from(files).find(file => file.type === 'text/csv' || file.type === 'text/plain');

      if (!csvFile) {
        throw new Error(t('admin.catalog.noCsvFile'));
      }

      formData.append('csv', csvFile);

      const response = await fetch('/api/admin/catalog/import', {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.errors
          ? Object.values(data.errors).flat().join(', ')
          : data.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      if (data.success) {
        await reloadTranslations();
        await refetch(true);
        if (savedFilters) {
          setTimeout(() => handleFilterChange(savedFilters), 100);
        }
        if (savedSortOption) {
          handleSortChange(savedSortOption.field, savedSortOption.direction);
        }
        alert(t('admin.catalog.importSuccess', { count: data.imported }));
        if (data.errors && data.errors.length > 0) {
          alert(t('admin.catalog.importErrors', { errors: data.errors.join('; ') }));
        }
      } else {
        throw new Error(data.error || 'Не удалось импортировать товары');
      }
    } catch (error) {
      console.error('Ошибка импорта CSV:', error);
      alert(t('admin.catalog.uploadError') + ': ' + error.message);
    } finally {
      event.target.value = '';
    }
  };

  // Сохраняем фильтры и сортировку
  const handleFilterChangeWithSave = (newFilters) => {
    setSavedFilters(newFilters);
    handleFilterChange(newFilters);
  };

  const handleSortChangeWithSave = (field, direction) => {
    const newSortOption = { field, direction };
    setSavedSortOption(newSortOption);
    handleSortChange(field, direction);
  };

  if (loading) return <div className="loading">{t('Loading')}</div>;
  if (error) return <div>{t('Error')}: {error.message}</div>;
  if (!products || products.length === 0) return <div>{t('admin.catalog.noProducts')}</div>;

  return (
    <div className="admin-catalog-page">
      <meta name="csrf-token" content="{{ csrf_token() }}" />
      <div className="admin-catalog-layout">
        <div className="filter-column">
          <ProductFilter
            initialProducts={products}
            filteredByMainFilters={products}
            filteredProducts={filteredProducts}
            onFilterChange={handleFilterChangeWithSave}
            onSortChange={handleSortChangeWithSave}
            sortOption={sortOption}
            isAdminPage={isAdminPage}
            savedFilters={savedFilters} 
            savedSortOption={savedSortOption}
          />
        </div>
        <div className="table-column">
          <Button
            onClick={() => setShowAddModal(true)}
            className="add-product-btn"
          >
            + {t('admin.catalog.add')}
          </Button>
          <Button
            onClick={handleExport}
            className="export-csv-btn"
          >
            {t('admin.catalog.export')}
          </Button>
          <Button
            onClick={() => fileInputRef.current.click()}
            className="import-csv-btn"
          >
            {t('admin.catalog.import')}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".csv,image/jpeg,image/png"
            multiple
            onChange={handleImportCSV}
          />
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
                    <td>{t(`category.${product.category}`) || product.category || '-'}</td>
                    <td>{t(`subcategory.${product.category}.${product.subcategory}`) || product.subcategory || '-'}</td>
                    <td>{product.brand || '-'}</td>
                    <td>
                      <Button
                        className="edit-button"
                        onClick={() => handleEditProduct(product)}
                      >
                        {t('admin.catalog.edit')}
                      </Button>
                      <Button
                        className="delete-button"
                        onClick={() => handleDeleteProduct(product)}
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

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddProduct}
      />
      <EditProductModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setProductToEdit(null);
        }}
        onSubmit={handleUpdateProduct}
        product={productToEdit}
      />
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDelete}
        productName={productToDelete?.name || ''}
        loading={deleteLoading}
      />
    </div>
  );
};

export default AdminCatalogPage;