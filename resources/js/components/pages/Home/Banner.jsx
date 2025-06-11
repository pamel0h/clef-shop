import { useNavigate } from 'react-router-dom';
import Button from '../../UI/Button';
import '../../../../css/components/UI/Banner.css';
import sanitizeHtml from 'sanitize-html';

const Banner = ({
  children,
  title = '',
  variant = 'line', // 'line' | 'main' | 'mini'
  icon = null,
  backgroundImage = null,
  overlay = true,
  link = '' // Добавляем проп link
}) => {
  const navigate = useNavigate();
  const baseClass = 'banner';
  const variantClass = `ban--${variant}`;

  const sanitizeContent = (html) => {
          return sanitizeHtml(html || '', {
              allowedTags: ['p', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br', 'span', 'div'],
              allowedAttributes: {
                  a: ['href', 'target'],
                  span: ['style'],
              },
          });
      };

  const style = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  } : {};

  const handleClick = () => {
    
      navigate(link); // Переход по ссылке
    
  };

  return (
    <div
      onClick={handleClick}
      className={`${baseClass} ${variantClass} ${backgroundImage ? 'has-background' : ''} ${link ? 'clickable' : ''}`}
      style={style}
    >
     
      <div className='banner-text'>
        <h3 dangerouslySetInnerHTML={{ __html: sanitizeContent(title) }}></h3>
        <div className="banner-content">{children}</div>
      </div>
      {variant === 'line' && (
        <Button variant='success' size='large'>{t('banner.about')}</Button>
      )}
    </div>
  );
};

export default Banner;