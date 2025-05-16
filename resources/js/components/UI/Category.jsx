import '../../../css/components/Category.css';
import { Link } from 'react-router-dom';

const Category = ({
  title,
  to,
  icon = null,
  className = ''
}) => {
  return (
    <Link 
      to={to} 
      className={`category ${className}`}
    >
      {icon && (
        <div className="category__icon">
          {icon}
        </div>
      )}
      <h3 className="category__title">{title}</h3>
    </Link>
  );
};

export default Category;