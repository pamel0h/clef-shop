import { Link } from 'react-router-dom';
import Button from '../../UI/Button';

const HomePage = () => {
    return (
        <div className='page'>

            <div className='content '>
                <h1 className='mainTitle'>YOUR PERFECT SOUND STARTS HERE</h1>
                <div>
                    <Link to="/catalog">
                        <Button>Перейти в каталог</Button>
                    </Link>
                </div>
            </div>
            <div className='notes '>
                <p>🎶</p>
                {/* <img src='/images/mus.png'></img> */}
            </div>
            <div className='actionBanner block'></div>
            <div className='actionBig block'></div>
            <div className='action1 block'></div>
            <div className='action2 block'></div>
            <h1 className='titleBrands'>OUR BRANDS</h1>
            <div className='brands block'>
                <div className='brand'></div>
                <div className='brand'></div>
                <div className='brand'></div>
            </div>
            <h1 className='titleWhy'>WHY CLEF?</h1>
            <div className='quality'>
                <h3>Quality assurance</h3>
                <p>Direct deliveries from the manufacturer and warranty service after purchase</p>
            </div>
            <div className='service'>
                <h3>Service</h3>
                <p>Consultations with qualified personnel, delivery at a time convenient for you and the possibility of returning the goods if you are not satisfied with them</p>
            </div>
            <div className='delivery '>
                <h3>Delivery and payment</h3>
                <p>You can choose a payment scheme that suits you and a convenient delivery method: courier or pick-up</p>
            </div>
            
            



            
        </div>
    );
};

export default HomePage; // Не забываем экспортировать!