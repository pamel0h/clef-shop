import { Link } from 'react-router-dom';
import '../../../../css/components/News.css';

const News = ({
  title,
  to,
  className = '',
  variant = 'small',
  icon = null,
  backgroundImage = null,
  overlay = true,
  description = '' // Новое проп
}) => {
  const baseClass = 'news';
  const variantClass = `news--${variant}`;

  const style = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  } : {};

  return (
    <Link
      to={to}
      className={`${baseClass} ${className} ${variantClass} ${backgroundImage ? 'has-background' : ''}`}
      style={style}
    >
      {overlay && backgroundImage && <div className="news-overlay"></div>}

      {icon && (
        <div className="news--icon">
          {icon}
        </div>
      )}
      <h3>{title}</h3>
      {description && <p className="news-description">{description}</p>}
    </Link>
  );
};

export default News;