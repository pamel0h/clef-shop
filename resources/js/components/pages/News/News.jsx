import { Link } from 'react-router-dom';
import '../../../../css/components/News.css'; 

const News = ({ 
  title,
  to,
  className,
  variant ='small',
  icon = null,//потом добавить добавление фона
}) => {
  // Формируем классы
  const baseClass = 'news';
  const variantClass = `news--${variant}`;

  return (
    <Link
      to={to} 
      className={`${baseClass} ${className} ${variantClass}`}
    >
      {icon && (
          <div className="news--icon">
            {icon}
          </div>
        )}
      <h3>{title}</h3>
    </Link>
    
  );
};

export default News;