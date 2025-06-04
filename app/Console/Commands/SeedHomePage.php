<?php

namespace App\Console\Commands;

use App\Models\Page;
use Illuminate\Console\Command;

class SeedHomePage extends Command
{
    protected $signature = 'seed:home-page';
    protected $description = 'Seed the Home page content into MongoDB';

    public function handle()
    {
        $homePage = [
            'pageId' => 'home',
            'content' => [
                    'ru' => [
                        'mainTitle' => 'ВАШ ИДЕАЛЬНЫЙ ЗВУК НАЧИНАЕТСЯ ЗДЕСЬ',
                        'image' => '/images/mainphoto.jpg',
                        'mainButton' => 'перейти в каталог',
                        'brandsTitle' => 'НАШИ БРЕНДЫ',
                        'whyTitle' => 'ПОЧЕМУ КЛЕФ?',
                        'qualityTitle' => 'Гарантия качества',
                        'qualityText' => 'Прямые поставки от производителя и гарантийное обслуживание после покупки',
                        'serviceTitle' => 'Сервис',
                        'serviceText' => 'Консультации квалифицированного персонала, доставка в удобное для вас время и возможность возврата товара, если он вас не устроит.',
                        'deliveryTitle' => 'Доставка',
                        'deliveryText' => 'Вы можете выбрать удобную для вас схему оплаты и удобный способ доставки: курьером или самовывозом.',
                        'banners' => [
                            [
                                'id' => 1,
                                'variant' => 'line',
                                'title' => 'СПЕЦИАЛЬНАЯ АКЦИЯ 50%',
                                'content' => 'Успей купить со скидкой до конца месяца!',
                                'image' => '/images/mainphoto.jpg',
                                'visible' => true
                            ],
                            [
                                'id' => 2,
                                'variant' => 'main',
                                'title' => 'НОВИНКИ',
                                'content' => 'Ознакомьтесь с новыми поступлениями в нашем каталоге',
                                'image' => '/images/mainphoto.jpg',
                                'visible' => true
                            ],
                            [
                                'id' => 3,
                                'variant' => 'mini',
                                'title' => 'БЫСТРАЯ ДОСТАВКА',
                                'content' => 'Доставим ваш заказ в течение 24 часов',
                                'image' => '/images/mainphoto.jpg',
                                'visible' => true
                            ],
                            [
                                'id' => 4,
                                'variant' => 'mini',
                                'title' => 'ГАРАНТИЯ КАЧЕСТВА',
                                'content' => 'Официальная гарантия на все товары',
                                'image' => '/images/mainphoto.jpg',
                                'visible' => true
                            ]
                        ]
                    ],
                    'en' => [
                        'mainTitle' => 'YOUR PERFECT SOUND STARTS HERE',
                        'image' => '/images/mainphoto.jpg',
                        'mainButton' => 'Product Catalog',
                        'brandsTitle' => 'OUR BRANDS',
                        'whyTitle' => 'WHY CLEF?',
                        'qualityTitle' => 'Quality assurance',
                        'qualityText' => 'Direct deliveries from the manufacturer and warranty service after purchase',
                        'serviceTitle' => 'Service',
                        'serviceText' => 'Consultations with qualified personnel, delivery at a time convenient for you and the possibility of returning the goods if you are not satisfied with them',
                        'deliveryTitle' => 'Delivery',
                        'deliveryText' => 'You can choose a payment scheme that suits you and a convenient delivery method: courier or pick-up',
                        'banners' => [
                            [
                                'id' => 1,
                                'variant' => 'line',
                                'title' => 'SPECIAL OFFER 50%',
                                'content' => 'Hurry up to buy with a discount until the end of the month!',
                                'image' => '/images/mainphoto.jpg',
                                'visible' => true
                            ],
                            [
                                'id' => 2,
                                'variant' => 'main',
                                'title' => 'NEW ARRIVALS',
                                'content' => 'Check out new arrivals in our catalog',
                                'image' => '/images/mainphoto.jpg',
                                'visible' => true
                            ],
                            [
                                'id' => 3,
                                'variant' => 'mini',
                                'title' => 'FAST DELIVERY',
                                'content' => 'We will deliver your order within 24 hours',
                                'image' => '/images/mainphoto.jpg',
                                'visible' => true
                            ],
                            [
                                'id' => 4,
                                'variant' => 'mini',
                                'title' => 'QUALITY GUARANTEE',
                                'content' => 'Official guarantee for all products',
                                'image' => '/images/mainphoto.jpg',
                                'visible' => true
                            ]
                        ]
                    ]
                ]
            ];

        Page::updateOrCreate(
            ['pageId' => 'home'],
            ['content' => $homePage['content']]
        );

        $this->info('Home page content seeded successfully!');
    }
}