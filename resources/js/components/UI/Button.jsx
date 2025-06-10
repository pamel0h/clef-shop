// resources/js/components/ui/Button.jsx
import React from 'react';
import '../../../css/components/UI/Button.css'; 

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'icon' 
  size = 'medium',     // 'small' | 'medium' | 'large'
  disabled = false,
  className = '',
  icon = null,
}) => {
  // Формируем классы
  const baseClass = 'btn';
  const variantClass = `btn--${variant}`;
  const sizeClass = `btn--${size}`;
  const disabledClass = disabled ? 'btn--disabled' : '';


  return (
    <button
      type= {type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variantClass} ${sizeClass} ${disabledClass} ${className}`}
    >
      {icon && (
        <span>{icon}</span>
      )}
      {children}
    </button>
  );
};

export default Button;