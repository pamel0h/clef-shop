import { useParams } from 'react-router-dom';
import ProductsList from './ProductsList';
import '../../../../css/components/Products.css';

const ProductsPage = () => {
  const { categorySlug, subcategorySlug } = useParams();

  return (
      <ProductsList 
        categorySlug={categorySlug} 
        subcategorySlug={subcategorySlug} 
      />
  );
};

export default ProductsPage;