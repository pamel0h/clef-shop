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
                                'title' => 'Аудиоинтерфейсы для домашней студии',
                                'content' => 'Focusrite, PreSonus — записывай как профи!',
                                'image' => '',
                                'visible' => true,
                                'link' => '/catalog/audio_equipment/audio_interfaces' 
                            ],
                            [
                                'id' => 2,
                                'variant' => 'main',
                                'title' => 'Аксессуары по выгодным ценам',
                                'content' => 'Струны, медиаторы, чехлы и многое другое',
                                'image' => '/storage/product_images/accessories/evans_g2.jpg',
                                'visible' => true,
                                'link' => '/catalog/accessories'
                            ],
                            [
                                'id' => 3,
                                'variant' => 'mini',
                                'title' => 'Электронные барабаны в наличии',
                                'content' => 'Тихие репетиции без соседей!',
                                'image' => '/storage/product_images/drums/alesis_nitro_mesh.jpg',
                                'visible' => true,
                                'link' => '/catalog/drums/electronic_drums'
                            ],
                            [
                                'id' => 4,
                                'variant' => 'mini',
                                'title' => 'Топовые микрофоны AKG – спеццена',
                                'content' => 'Эталон живого звука',
                                'image' => '/storage/product_images/audio/akg_d112.jpg',
                                'visible' => true,
                                'link' => '/catalog/audio_equipment/microphones/68283ecc144c62cab70df135'
                            ]
                            ],
                            
                    'brands' => [
                        [
                            'id' => 1,
                            'image' => '/storage/logo_images/110.png',
                        ],
                        [
                            'id' => 2,
                            'image' => '/storage/logo_images/KAWAI-Logo-AI-cu_s9999x200.png',
                        ],
                        [
                            'id' => 3,
                            'image' => '/storage/logo_images/Martin_guitar_logo.png',
                        ],
                        [
                            'id' => 4,
                            'image' => '/storage/logo_images/avantone.jpg',
                        ],
                        [
                            'id' => 5,
                            'image' => '/storage/logo_images/5736608673_f3dde1cd43_h.jpg',
                        ],
                        [
                            'id' => 6,
                            'image' => '/storage/logo_images/yamaha-black-logo-on-transparent-background-free-vector.jpg',
                        ],
                    ],
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
                                    'title' => 'Audio interfaces for home studio',
                                    'content' => 'Focusrite, PreSonus - record like a pro!',
                                    'image' => '',
                                    'visible' => true,
                                    'link' => '/catalog/audio_equipment/audio_interfaces' 
                                ],
                                [
                                    'id' => 2,
                                    'variant' => 'main',
                                    'title' => 'Accessories at great prices',
                                    'content' => 'Strings, picks, cases and much more',
                                    'image' => '/storage/product_images/accessories/evans_g2.jpg',
                                    'visible' => true,
                                    'link' => '/catalog/accessories'
                                ],
                                [
                                    'id' => 3,
                                    'variant' => 'mini',
                                    'title' => 'Electronic drums in stock',
                                    'content' => 'Quiet rehearsals without neighbors!',
                                    'image' => '/storage/product_images/drums/alesis_nitro_mesh.jpg',
                                    'visible' => true,
                                    'link' => '/catalog/drums/electronic_drums'
                                ],
                                [
                                    'id' => 4,
                                    'variant' => 'mini',
                                    'title' => 'Top AKG microphones - special price',
                                    'content' => 'The gold standard of live sound',
                                    'image' => '/storage/product_images/audio/akg_d112.jpg',
                                    'visible' => true,
                                    'link' => '/catalog/audio_equipment/microphones/68283ecc144c62cab70df135'
                                ]
                            ],
                             
                    'brands' => [
                        [
                            'id' => 1,
                            'image' => '/storage/logo_images/110.png',
                        ],
                        [
                            'id' => 2,
                            'image' => '/storage/logo_images/KAWAI-Logo-AI-cu_s9999x200.png',
                        ],
                        [
                            'id' => 3,
                            'image' => '/storage/logo_images/Martin_guitar_logo.png',
                        ],
                        [
                            'id' => 4,
                            'image' => '/storage/logo_images/avantone.jpg',
                        ],
                        [
                            'id' => 5,
                            'image' => '/storage/logo_images/5736608673_f3dde1cd43_h.jpg',
                        ],
                        [
                            'id' => 6,
                            'image' => '/storage/logo_images/yamaha-black-logo-on-transparent-background-free-vector.jpg',
                        ],
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