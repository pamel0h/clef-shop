import { useTranslation } from 'react-i18next';
import AddEditCatalogForm from './AddEditCatalogForm';

const AddProductModal = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useTranslation();

  return (
    <AddEditCatalogForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={null}
      title={t('admin.catalog.add')}
    />
  );
};

export default AddProductModal;