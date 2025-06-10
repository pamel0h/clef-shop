import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../context/AuthContext';
import axios from 'axios';
import "../../../../css/components/Contact/ContactForm.css";
import Button from '../../UI/Button';
import Input from '../../UI/Input';
import AuthModal from '../../UI/AuthModal';
import SuccessModal from '../../UI/SuccessModal';

const ContactForm = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [messageText, setMessageText] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [pendingSubmit, setPendingSubmit] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const isMessageEmpty = messageText.trim() === '';

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
            const response = await axios.post('/api/messages', {
                message: messageText
            });
            
            setMessageText('');
            setIsSuccessModalOpen(true);
        } catch (err) {
            setError(err.response?.data?.message || t('contactForm.error'));
        } finally {
            setLoading(false);
            setPendingSubmit(false);
        }
    };

    useEffect(() => {
        if (user && pendingSubmit && !isMessageEmpty) {
            handleSubmit({ preventDefault: () => {} });
        }
    }, [user, pendingSubmit]);

    const handleAuthSuccess = () => {
        setIsAuthModalOpen(false);
        if (!isMessageEmpty) {
            setPendingSubmit(true);
        }
    };

    return (
        <>
            <form className="form" onSubmit={handleSubmit}>
            <div>
                <h2>{t('contactForm.title')}</h2>
                <label>{t('contactForm.message')}</label>
            </div>
                
                <Input
                    type="textarea"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
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
                        onClick={() => setMessageText('')}
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