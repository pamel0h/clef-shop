import { useParams } from 'react-router-dom';

export const ProductsList = () => {
  const { categorySlug, subcategorySlug } = useParams();
  console.log('Params:', { categorySlug, subcategorySlug }); // Для отладки

  return (
    <div>
      <h2>Товары: {categorySlug} → {subcategorySlug}</h2>
      <p>Список товаров будет здесь</p>
    </div>
  );
};