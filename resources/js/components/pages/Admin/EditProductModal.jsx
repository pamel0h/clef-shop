import { useTranslation } from 'react-i18next';
import AddEditCatalogForm from './AddEditCatalogForm';

const EditProductModal = ({ isOpen, onClose, onSubmit, product }) => {
  const { t } = useTranslation();

  return (
    <AddEditCatalogForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={product}
      title={t('admin.catalog.edit')}
    />
  );
};

export default EditProductModal;