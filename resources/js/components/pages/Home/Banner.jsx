import Button from '../../UI/Button';
import '../../../../css/components/UI/Banner.css'; 

const Banner = ({ 
  children,
  onClick,
  title = '',
  variant = 'line', // 'line' | 'main' | 'mini' 
  icon = null,
  backgroundImage = null,
  overlay = true
}) => {
  const baseClass = 'banner';
  const variantClass = `ban--${variant}`;
  
  const style = backgroundImage ? { 
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  } : {};

  return (
    <div
      onClick={onClick}
      className={`${baseClass} ${variantClass} ${backgroundImage ? 'has-background' : ''}`}
      style={style}
    >
      {overlay && backgroundImage && <div className="banner-overlay"></div>}
      <div className='banner-text'>
        <h3>{title}</h3>
        <div className="banner-content">{children}</div>
      </div>
      {variant === 'line' && (
        <Button variant='success' size='large'>Подробнее</Button>
      )}
      </div>
  );
};

export default Banner;