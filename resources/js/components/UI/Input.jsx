import { useState } from 'react';
import SearchIcon from "../icons/SearchIcon";
import Eye from "../icons/Eye";
import EyeClosed from "../icons/EyeClosed";
import Button from './Button';
import '../../../css/components/Input.css'; 

const Input = ({
    placeholder,
    variant = null, // "search" или "password"
    disabled = false,
    type = "text", // "text", "password", "email" и т.д.
    value = "",   
    onChange = () => {}, // Колбэк для обновления значения
    onKeyDown = () => {}, // Добавляем пропс для обработки нажатия клавиш
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const eye_password = showPassword ? <Eye/> : <EyeClosed /> ;
  const baseClass = 'input';
  const variantClass = variant ? `input--${variant}` : '';

  // Определяем тип инпута в зависимости от настроек
  const inputType = variant === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type;

  return (
    <div className={`${baseClass} ${variantClass}`}>
      <input
        type={inputType}
        placeholder={placeholder}
        value={value} 
        onChange={onChange} 
        onKeyDown={onKeyDown} // Передаем onKeyDown в <input>
        disabled={disabled}
        className={disabled ? 'input--disabled' : ''}
      />

      {/* Иконка поиска (если variant="search") */}
      {variant === 'search' && (
        <div className="input__icon">{<SearchIcon />}</div>
      )}

      {/* Кнопка показа/скрытия пароля (если variant="password") */}
      {variant === 'password' && (
        <Button size='small' variant='icon' icon={eye_password} 
          onClick={() => setShowPassword(!showPassword)}
        >
        </Button>
      )}
    </div>
  );
};

export default Input;