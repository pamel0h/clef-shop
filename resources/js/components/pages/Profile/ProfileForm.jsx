import { useState } from 'react';
import Input from '../../UI/Input';
import Button from '../../UI/Button';
import "../../../../css/components/ProfileForm.css"

const ProfileForm = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [login, setLogin] = useState("user123");
  const [password, setPassword] = useState("qwerty123");
  const [savedLogin, setSavedLogin] = useState("user123");
  const [savedPassword, setSavedPassword] = useState("qwerty123");

  const handleCancel = () => {
    setLogin(savedLogin);
    setPassword(savedPassword);
    setIsEditing(false);
  };

  const handleSave = () => {
    setSavedLogin(login);
    setSavedPassword(password);
    setIsEditing(false);
  };

  return (
    <div className='profile--form'>
      <Input
        label="Логин"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        disabled={!isEditing}
      />
      <Input
        label="Пароль"
        type="password"
        variant="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={!isEditing}
      />

      {isEditing ? (
        <div className='form--buttons'>
          <Button onClick={handleSave}>Сохранить</Button>
          <Button onClick={handleCancel}>Отмена</Button>
        </div>
      ) : (
        <Button onClick={() => setIsEditing(true)}>Редактировать</Button>
      )}
    </div>
  );
};

export default ProfileForm;