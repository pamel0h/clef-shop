import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../context/AuthContext';
import axios from 'axios';
import "../../../../css/components/ContactForm.css";
import Button from '../../UI/Button';
import Input from '../../UI/Input';
import AuthModal from '../../UI/AuthModal';
import SuccessModal from '../../UI/SuccessModal';

const ContactForm = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [pendingSubmit, setPendingSubmit] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    // Проверяем, пустое ли поле сообщения
    const isMessageEmpty = message.trim() === '';

    // Обработка отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            setPendingSubmit(true);
            setIsAuthModalOpen(true);
            return;
        }

        setError('');
        setLoading(true);

        try {
            await axios.post('/api/messages', {
                userId: user.id,
                message,
                createdAt: new Date(),
            });
            setMessage('');
            setIsSuccessModalOpen(true);
        } catch (err) {
            setError(t('contactForm.error'));
        } finally {
            setLoading(false);
            setPendingSubmit(false);
        }
    };

    // Эффект для автоматической отправки после авторизации
    useEffect(() => {
        if (user && pendingSubmit && !isMessageEmpty) {
            handleSubmit({ preventDefault: () => {} });
        }
    }, [user, pendingSubmit]);

    // Коллбэк для обработки успешной авторизации
    const handleAuthSuccess = () => {
        setIsAuthModalOpen(false);
        if (!isMessageEmpty) {
            setPendingSubmit(true);
        }
    };

    return (
        <>
            <form className="form" onSubmit={handleSubmit}>
                <h2>{t('contactForm.title')}</h2>
                <label>{t('contactForm.message')}</label>
                <Input
                    type="textarea"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('contactForm.message_placeholder')}
                    required
                />
                {error && <p className="error">{error}</p>}
                <div className="buttons">
                    <Button 
                        type="submit" 
                        disabled={loading || isMessageEmpty}
                    >
                        {loading ? t('contactForm.sending') : t('contactForm.send')}
                    </Button>
                    <Button 
                        type="button" 
                        onClick={() => setMessage('')}
                        disabled={isMessageEmpty}
                    >
                        {t('contactForm.reset')}
                    </Button>
                </div>
            </form>
            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => {
                    setIsAuthModalOpen(false);
                    setPendingSubmit(false);
                }}
                onAuthSuccess={handleAuthSuccess}
                redirectToProfile={false}
            />
            <SuccessModal 
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={t('contactForm.success_title')}
                message={t('contactForm.success')}
            />
        </>
    );
};

export default ContactForm;