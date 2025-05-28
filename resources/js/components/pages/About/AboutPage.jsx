import '../../../../css/components/AboutPage.css'; 
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
    const { t } = useTranslation();
    return (
        <div className="page page--about">
            <h1 className='titleAbout'>{t('about.mainTitle')}</h1>
            <div className='imageAbout'>
                <img src='/images/mainphoto.jpg'></img>
            </div>
            <h1 className='titleAbout1'>{t('about.title1')}</h1>
            <div className='text1'>{t('about.text1')}</div>
            <div className='text2'>{t('about.text2')}</div>
            <h1 className='titleAbout2'>{t('about.title2')}</h1>
            <div className='imageAbout1'></div>
            <div className='imageAbout2'>{t('about.text3')}</div>
            <h1 className='titleAbout3'>{t('about.title3')}</h1>
            <div className='media1'></div>
            <div className='media2'></div>
            <div className='media3'></div>
            <p className='sign'>Clef 2025 ❤️</p>


        </div>
    );
};

export default AboutPage; 