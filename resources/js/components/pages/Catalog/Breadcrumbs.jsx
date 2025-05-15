
import { Link, useLocation } from 'react-router-dom';

export const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const paths = pathname.split('/').filter(Boolean); // Разбиваем URL на части

  return (
    <div className="breadcrumbs">
      <Link to="/">Главная</Link>
      {paths.map((path, i) => (
        <span key={i}>
          › <Link to={`/${paths.slice(0, i+1).join('/')}`}>{path}</Link>
        </span>
      ))}
    </div>
  );
};