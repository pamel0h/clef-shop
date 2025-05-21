import '../../../../css/components/ContactPage.css'; 
import ContactForm from './ContactForm';

const ContactPage = () => {
    return (
        <div className='page page--contact'>
            <h1 className='titleContact'>Contacts</h1>
            <h2>Our phone numbers</h2>
            <div className='numbers'>
                <ul>
                    <li>+79780453769</li>
                    <li>+79785901565</li>
                </ul>
                <p>Reception by phone from 10 am to 7 pm</p>
            </div>
            
            <h2>How to get to us?</h2>
            <div className='cardShop'></div>
            <p>We are located at the address .... You need to go... blah blah</p>
            <h2>Still have questions?</h2>
            <p>Fill out the feedback form!</p>
            <ContactForm />
        </div>
    );
};

export default ContactPage; 