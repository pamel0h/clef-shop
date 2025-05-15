// resources/js/components/ui/Button.jsx
import React from 'react';
import '../../../css/components/Button.css'; 

const Button = ({
  children,
  onClick,
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