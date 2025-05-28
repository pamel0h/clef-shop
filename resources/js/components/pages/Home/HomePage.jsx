import { Link } from 'react-router-dom';
import Button from '../../UI/Button';
import Banner from './Banner';
import BrandCarousel from './BrandCarousel';
import '../../../../css/components/HomePage.css'; 
import { useTranslation } from 'react-i18next';


const HomePage = () => {
    const { t } = useTranslation();

    return (
        <div className='page page--home'>
            <div className='lines lines-top'>
                <div className='lineItem'></div>
                <div className='lineItem'></div>
                <div className='lineItem'></div>
                <div className='lineItem'></div>
                <div className='lineItem'></div>
                <div className='lineItem'></div>
                <div className='lineItem'></div>
            </div>
            <div className='content '>
                <h1 className='mainTitle'>
                    {t('home.mainTitle')}
                    </h1>
             </div>   
            <div className='notes '>
                {/* <p>🎶</p> найти нормальные картинки*/}
                <img src='/images/mainphoto.jpg'></img>
            </div>
            <div className='mainButton'>
                        <Link to="/catalog">
                            <Button size = 'large'>{t('home.mainButton')}</Button>
                        </Link>
                    
                </div>
            <Banner title='NAME OF ACTION %%%'></Banner>
            <Banner variant='main' title='NAME'>desroptionfodofdofdododdofdofosfosfs</Banner>
            <Banner variant='mini' title='NAME1'>desroptionfodofdofdododdofdofosfosfs</Banner>
            <Banner variant='mini' title='NAME2'>desroptionfodofdofdododdofdofosfosfs</Banner>
            <h1 className='titleBrands'>{t('home.brandsTitle')}</h1>
            <BrandCarousel></BrandCarousel>
            <h1 className='titleWhy'>{t('home.whyTitle')}</h1>
            {/* сюда тоже добавить картинки бы */}
            <div className='lines lines-bottom'>
                <div className='lineItem'></div>
                <div className='lineItem'></div>
                <div className='lineItem'></div>
                <div className='lineItem'></div>
                <div className='lineItem'></div>
                <div className='lineItem'></div>
                <div className='lineItem'></div>
            </div>
            <div className='quality text-block'> 
                <h3>{t('home.qualityTitle')}</h3>
                <p>{t('home.qualityText')}</p>
            </div>
            <div className='service text-block'>
                <h3>{t('home.serviceTitle')}</h3>
                <p>{t('home.serviceText')}</p>
            </div>
            <div className='delivery text-block'>
                <h3>{t('home.deliveryTitle')}</h3>
                <p>{t('home.deliveryText')}</p>
            </div>
   
        </div>
    );
};

export default HomePage; 