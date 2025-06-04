import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Button from '../../UI/Button';
import Banner from './Banner';
import BrandCarousel from './BrandCarousel';
import sanitizeHtml from 'sanitize-html';
import '../../../../css/components/HomePage.css';

const HomePage = () => {
    const { t, i18n } = useTranslation();
    const [content, setContent] = useState({
        mainTitle: '',
        image: '/images/mainphoto.jpg',
        mainButton: '',
        brandsTitle: '',
        whyTitle: '',
        qualityTitle: '',
        qualityText: '',
        serviceTitle: '',
        serviceText: '',
        deliveryTitle: '',
        deliveryText: '',
        banners: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/pages/home');
                
                if (response.data.success && response.data.data) {
                    const pageContent = response.data.data.content?.[i18n.language] || {};
                    setContent({
                        mainTitle: pageContent.mainTitle || t('home.mainTitle'),
                        image: pageContent.image || '/images/mainphoto.jpg',
                        mainButton: pageContent.mainButton || t('home.mainButton'),
                        brandsTitle: pageContent.brandsTitle || t('home.brandsTitle'),
                        whyTitle: pageContent.whyTitle || t('home.whyTitle'),
                        qualityTitle: pageContent.qualityTitle || t('home.qualityTitle'),
                        qualityText: pageContent.qualityText || t('home.qualityText'),
                        serviceTitle: pageContent.serviceTitle || t('home.serviceTitle'),
                        serviceText: pageContent.serviceText || t('home.serviceText'),
                        deliveryTitle: pageContent.deliveryTitle || t('home.deliveryTitle'),
                        deliveryText: pageContent.deliveryText || t('home.deliveryText'),
                        banners: pageContent.banners || [
                            {
                                id: 1,
                                variant: 'line',
                                title: 'NAME OF ACTION %%%',
                                content: '',
                                visible: true
                            },
                            {
                                id: 2,
                                variant: 'main',
                                title: 'NAME',
                                content: 'desroptionfodofdofdododdofdofosfosfs',
                                visible: true
                            },
                            {
                                id: 3,
                                variant: 'mini',
                                title: 'NAME1',
                                content: 'desroptionfodofdofdododdofdofosfosfs',
                                visible: true
                            },
                            {
                                id: 4,
                                variant: 'mini',
                                title: 'NAME2',
                                content: 'desroptionfodofdofdododdofdofosfosfs',
                                visible: true
                            }
                        ]
                    });
                } else {
                    // Fallback к переводам
                    setContent({
                        mainTitle: t('home.mainTitle'),
                        image: '/images/mainphoto.jpg',
                        mainButton: t('home.mainButton'),
                        brandsTitle: t('home.brandsTitle'),
                        whyTitle: t('home.whyTitle'),
                        qualityTitle: t('home.qualityTitle'),
                        qualityText: t('home.qualityText'),
                        serviceTitle: t('home.serviceTitle'),
                        serviceText: t('home.serviceText'),
                        deliveryTitle: t('home.deliveryTitle'),
                        deliveryText: t('home.deliveryText'),
                        banners: [
                            {
                                id: 1,
                                variant: 'line',
                                title: 'NAME OF ACTION %%%',
                                content: '',
                                visible: true
                            },
                            {
                                id: 2,
                                variant: 'main',
                                title: 'NAME',
                                content: 'desroptionfodofdofdododdofdofosfosfs',
                                visible: true
                            },
                            {
                                id: 3,
                                variant: 'mini',
                                title: 'NAME1',
                                content: 'desroptionfodofdofdododdofdofosfosfs',
                                visible: true
                            },
                            {
                                id: 4,
                                variant: 'mini',
                                title: 'NAME2',
                                content: 'desroptionfodofdofdododdofdofosfosfs',
                                visible: true
                            }
                        ]
                    });
                }
            } catch (error) {
                console.error('Error loading home page content:', error);
                // Fallback к переводам при ошибке
                setContent({
                    mainTitle: t('home.mainTitle'),
                    image: '/images/mainphoto.jpg',
                    mainButton: t('home.mainButton'),
                    brandsTitle: t('home.brandsTitle'),
                    whyTitle: t('home.whyTitle'),
                    qualityTitle: t('home.qualityTitle'),
                    qualityText: t('home.qualityText'),
                    serviceTitle: t('home.serviceTitle'),
                    serviceText: t('home.serviceText'),
                    deliveryTitle: t('home.deliveryTitle'),
                    deliveryText: t('home.deliveryText'),
                    banners: []
                });
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [i18n.language, t]);

    // Функция для очистки HTML
    const sanitizeContent = (html) => {
        return sanitizeHtml(html || '', {
            allowedTags: ['p', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br', 'span', 'div'],
            allowedAttributes: {
                a: ['href', 'target'],
                span: ['style'],
            },
        });
    };

    if (loading) {
        return <div className="page-loading">Загрузка...</div>;
    }

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
            <div className='content'>
                <h1 className='mainTitle'>{content.mainTitle}</h1>
            </div>   
            <div className='notes'>
                <img src={content.image} alt="Main" />
            </div>
            <div className='mainButton'>
                <Link to="/catalog">
                    <Button size='large'>{content.mainButton}</Button>
                </Link>
            </div>
            
            {content.banners
                .filter(banner => banner.visible !== false)
                .map(banner => (
                    <Banner 
                    key={banner.id}
                    variant={banner.variant}
                    title={banner.title}
                    backgroundImage={banner.image} // Передаем image как backgroundImage
                    >
                    <div dangerouslySetInnerHTML={{ __html: sanitizeContent(banner.content) }} />
                    </Banner>
                ))
            }
            
            <h1 className='titleBrands'>{content.brandsTitle}</h1>
            <BrandCarousel />
            <h1 className='titleWhy'>{content.whyTitle}</h1>
            
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
                <h3>{content.qualityTitle}</h3>
                <div dangerouslySetInnerHTML={{ __html: sanitizeContent(content.qualityText) }} />
            </div>
            <div className='service text-block'>
                <h3>{content.serviceTitle}</h3>
                <div dangerouslySetInnerHTML={{ __html: sanitizeContent(content.serviceText) }} />
            </div>
            <div className='delivery text-block'>
                <h3>{content.deliveryTitle}</h3>
                <div dangerouslySetInnerHTML={{ __html: sanitizeContent(content.deliveryText) }} />
            </div>
        </div>
    );
};

export default HomePage;