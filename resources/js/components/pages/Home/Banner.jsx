import Button from '../../UI/Button';
import '../../../../css/components/Banner.css'; 

const Banner = ({ 
  children,
  onClick,
  title = '',
  variant = 'line', // 'line' | 'main' | 'mini' 
  icon = null,//потом добавить добавление фона
}) => {
  // Формируем классы
  const baseClass = 'banner';
  const variantClass = `ban--${variant}`;

  return (
    <div
      onClick={onClick}
      className={`${baseClass} ${variantClass}`}
    >
      <h3>{title}</h3>
      <p>{children}</p>
      {variant=='line' && (
        <Button variant='secondary'size='large'>подробнее</Button>
      )}
    </div>
  );
};

export default Banner;