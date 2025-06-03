
import { useTranslation } from 'react-i18next';
import AddEditCatalogForm from './AddEditCatalogForm';

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const { t } = useTranslation();

  const handleSubmit = async (productData) => {
    if (onProductAdded) {
      onProductAdded(productData);
    }
  };

  return (
    <AddEditCatalogForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      product={null}
      title={t('admin.catalog.add')}
    />
  );
};

export default AddProductModal;