import "../../../../css/components/ContactForm.css"
import Button from "../../UI/Button"
import Input from "../../UI/Input"
import { useTranslation } from 'react-i18next';

const ContactForm = () =>{
    const { t } = useTranslation();
    return(
        <form className='form'>
            <label>{t('contactForm.name')}</label>
            <Input/>
            <label>{t('contactForm.email')}</label>
            <Input/>
            <label>{t('contactForm.message')}</label>
            <Input/>
            <div className="buttons">
                <Button>{t('contactForm.send')}</Button>
                <Button>{t('contactForm.reset')}</Button>
            </div>
           
        </form>
    )
}

export default ContactForm;