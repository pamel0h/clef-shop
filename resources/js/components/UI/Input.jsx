import { useState } from 'react';
import SearchIcon from "../icons/SearchIcon";
import Eye from "../icons/Eye";
import EyeClosed from "../icons/EyeClosed";
import Button from './Button';
import '../../../css/components/UI/Input.css';

const Input = ({
    placeholder,
    variant = null, // "search" или "password"
    disabled = false,
    type = "text", // "text", "password", "email", "textarea" и т.д.
    value = "",
    name,
    onChange = () => {},
    onKeyDown = () => {},
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const eye_password = showPassword ? <Eye /> : <EyeClosed />;
    const baseClass = 'input';
    const variantClass = variant ? `input--${variant}` : '';

    // Определяем тип инпута для пароля
    const inputType = variant === 'password' 
        ? (showPassword ? 'text' : 'password') 
        : type;

    return (
        <div className={`${baseClass} ${variantClass}`}>
            {type === 'textarea' ? (
                <textarea
                    placeholder={placeholder}
                    value={value}
                    name={name}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    disabled={disabled}
                    className={disabled ? 'input--disabled' : ''}
                />
            ) : (
                <input
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    name={name}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    disabled={disabled}
                    className={disabled ? 'input--disabled' : ''}
                />
            )}

            {/* Иконка поиска (если variant="search") */}
            {variant === 'search' && (
                <div className="input__icon"><SearchIcon /></div>
            )}

            {/* Кнопка показа/скрытия пароля (если variant="password") */}
            {variant === 'password' && (
                <Button
                    type="button"
                    size="small"
                    variant="icon"
                    icon={eye_password}
                    onClick={() => setShowPassword(!showPassword)}
                />
            )}
        </div>
    );
};

export default Input;