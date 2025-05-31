// src/components/pages/Profile/ProfileForm.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../context/AuthContext';
import Button from '../../UI/Button';
import Input from '../../UI/Input';
import "../../../../css/components/ProfileForm.css"
import { useNavigate } from 'react-router-dom';

const ProfileForm = ({ user }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: ''
    });
    const [originalData, setOriginalData] = useState({}); // Храним исходные данные
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            const initialData = {
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                password: ''
            };
            setFormData(initialData);
            setOriginalData(initialData); // Сохраняем исходные данные для сравнения
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log('Changing:', name, value); // Отладочный вывод
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Собираем только изменённые поля
        const changedData = {};
        Object.keys(formData).forEach(key => {
            if (formData[key] !== originalData[key] && formData[key] !== '') {
                changedData[key] = formData[key];
            }
        });

        // Если ничего не изменилось, показываем сообщение и выходим
        if (Object.keys(changedData).length === 0) {
            setMessage(t('profile.no_changes'));
            setLoading(false);
            return;
        }

        try {
            const response = await axios.put('/api/user/profile', changedData);
            setMessage(t('profile.update_success'));
            // Обновляем originalData для отражения новых значений
            setOriginalData(prev => ({
                ...prev,
                ...changedData
            }));
           window.location.reload(); // Редирект на страницу профиля
        } catch (error) {
            setMessage(t('profile.update_error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
                <label>{t('auth.name')}</label>
                <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('auth.name_placeholder')}
                    required
                />
            </div>

            <div className="form-group">
                <label>{t('auth.email')}</label>
                <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('auth.email_placeholder')}
                    required
                />
            </div>

            <div className="form-group">
                <label>{t('profile.phone')}</label>
                <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t('profile.phone_placeholder')}
                />
            </div>

            <div className="form-group">
                <label>{t('profile.address')}</label>
                <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder={t('profile.address_placeholder')}
                />
            </div>
            <div className="form-group">
                <label>Пароль</label>
                <Input
                    type="password"
                    name="password"
                    variant="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Пароль"
                />
            </div>

            {message && (
                <div className={`message ${message.includes('error') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            <Button className='submit--btn' type="submit" disabled={loading}>
                {loading ? t('profile.updating') : t('profile.update')}
            </Button>
        </form>
    );
};

export default ProfileForm;