import "../../../../css/components/ContactForm.css"
import Button from "../../UI/Button"
import Input from "../../UI/Input"

const ContactForm = () =>{
    return(
        <form className='form'>
            <label>Ваше имя</label>
            <Input/>
            <label>Ваша почта</label>
            <Input/>
            <label>Сообщение</label>
            <Input/>
            <div className="buttons">
                <Button>Отправить</Button>
                <Button>Сбросить</Button>
            </div>
           
        </form>
    )
}

export default ContactForm;