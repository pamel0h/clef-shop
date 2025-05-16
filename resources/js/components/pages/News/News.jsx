
import '../../../../css/components/News.css'; 

const News = ({ 
  children,
  onClick,
  className,
  variant ='small',
  icon = null,//потом добавить добавление фона
}) => {
  // Формируем классы
  const baseClass = 'news';
  const variantClass = `news--${variant}`;

  return (
    <div
      onClick={onClick}
      className={`${baseClass} ${className} ${variantClass}`}
    >
      <h3>{children}</h3>
    </div>
  );
};

export default News;