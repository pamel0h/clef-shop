import '../../../../css/components/ContactPage.css'; 
import ContactForm from './ContactForm';
import { useTranslation } from 'react-i18next';

const ContactPage = () => {
    const { t } = useTranslation();
    return (
        <div className='page page--contact'>
            <h1 className='titleContact'>{t('contacts.mainTitle')}</h1>
            <h2>{t('contacts.phones')}</h2>
            <div className='numbers'>
                <ul>
                    <li>+79780453769</li>
                    <li>+79785901565</li>
                </ul>
                <p>{t('contacts.aviable')}</p>
            </div>
            
            <h2>{t('contacts.howTitle')}</h2>
            <div className='cardShop'></div>
            <p>{t('contacts.howText')}</p>
            <h2>{t('contacts.questionsTitle')}</h2>
            <p>{t('contacts.questionsText')}</p>
            <ContactForm />
        </div>
    );
};

export default ContactPage; 