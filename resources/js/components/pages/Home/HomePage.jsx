import { Link } from 'react-router-dom';
import Button from '../../UI/Button';
import Banner from './Banner';
import BrandCarousel from './BrandCarousel';
import '../../../../css/components/HomePage.css'; 

const HomePage = () => {
    return (
        <div className='page'>

            <div className='content '>
                <h1 className='mainTitle'>
                    YOUR PERFECT
                    SOUND STARTS
                    HERE
                    </h1>
             </div>   
            <div className='notes '>
                {/* <p>🎶</p> найти нормальные картинки*/}
                <img src='/images/mainphoto.jpg'></img>
            </div>
            <div className='mainButton'>
                        <Link to="/catalog">
                            <Button size = 'large'>перейти в каталог</Button>
                        </Link>
                    
                </div>
            <Banner title='NAME OF ACTION %%%'></Banner>
            <Banner variant='main' title='NAME'>desroptionfodofdofdododdofdofosfosfs</Banner>
            <Banner variant='mini' title='NAME1'>desroptionfodofdofdododdofdofosfosfs</Banner>
            <Banner variant='mini' title='NAME2'>desroptionfodofdofdododdofdofosfosfs</Banner>
            <h1 className='titleBrands'>OUR BRANDS</h1>
            <BrandCarousel></BrandCarousel>
            <h1 className='titleWhy'>WHY CLEF?</h1>
            {/* сюда тоже добавить картинки бы */}
            <div className='quality text-block'> 
                <h3>Quality assurance</h3>
                <p>Direct deliveries from the manufacturer and warranty service after purchase</p>
            </div>
            <div className='service text-block'>
                <h3>Service</h3>
                <p>Consultations with qualified personnel, delivery at a time convenient for you and the possibility of returning the goods if you are not satisfied with them</p>
            </div>
            <div className='delivery text-block'>
                <h3>Delivery and payment</h3>
                <p>You can choose a payment scheme that suits you and a convenient delivery method: courier or pick-up</p>
            </div>
   
        </div>
    );
};

export default HomePage; 