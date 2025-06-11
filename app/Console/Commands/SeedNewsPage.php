<?php

namespace App\Console\Commands;

use App\Models\Page;
use Illuminate\Console\Command;

class SeedNewsPage extends Command
{
    protected $signature = 'seed:news-page';
    protected $description = 'Seed the News page content into MongoDB';

    public function handle()
    {
        $newsPage = [
            'pageId' => 'news',
            'content' => [
                'ru' => [
                    'mainTitle' => 'Новости',
                    'description' => '<p>Будьте в курсе последних событий нашего магазина!</p>',
                    'archiveTitle' => 'Архив новостей',
                    'news' => [
                            [
                                'id' => '1', 
                                'image' => 'storage/images/news/1749597930_jQy3a7jfzm.jpg', 
                                'title' => 'Поступление новых бас-гитар Fender', 
                                'description' => 'Легендарные бас-гитары Fender уже в продаже!', 
                                'content' => 'В нашем магазине появились новые бас-гитары Fender Precision и Jazz Bass 2025 года. Улучшенная электроника и классический дизайн для мощного звучания. При покупке до конца июня — скидка 10% на аксессуары для баса!', 
                                'to' => '/news/1'
                            ],
                            [
                                'id' => '2', 
                                'image' => 'storage/images/news/1749597953_BZdumYNK6U.webp', 
                                'title' => 'Акция: Бесплатная доставка на все заказы от 5000 рублей', 
                                'description' => 'Экономьте на доставке с нашей акцией!', 
                                'content' => 'С 12 по 25 июня мы предлагаем бесплатную доставку на все заказы от 5000 рублей. Покупайте инструменты, аксессуары или оборудование и получайте их прямо к двери без дополнительных затрат. Успейте оформить заказ на сайте!', 
                                'to' => '/news/2'
                            ],
                            [
                                'id' => '3', 
                                'image' => 'storage/images/news/1749597969_1RmbcCeRrU.jpg', 
                                'title' => 'Мастер-класс по игре на барабанах', 
                                'description' => 'Освойте ритм с профессиональным барабанщиком!', 
                                'content' => 'Приглашаем на мастер-класс по игре на барабанах 18 июня в 17:00. Опытный музыкант поделится техниками и секретами мастерства. Мероприятие бесплатное, но необходима регистрация на нашем сайте. Присоединяйтесь!', 
                                'to' => '/news/3'
                            ],
                            [
                                'id' => '4', 
                                'image' => 'storage/images/news/1749597991_PNBnuUgMAQ.webp', 
                                'title' => 'Скидка 25% на гитарные усилители Ampeg', 
                                'description' => 'Усилите свой звук с Ampeg по выгодной цене!', 
                                'content' => 'Только до 20 июня скидка 25% на все гитарные усилители Ampeg. От компактных моделей для дома до мощных комбо для сцены — найдите свой идеальный звук. Заходите в магазин или заказывайте онлайн.', 
                                'to' => '/news/4'
                            ],
                            [
                                'id' => '5', 
                                'image' => 'storage/images/news/1749598009_FYmKVcQbTP.jpg', 
                                'title' => 'Новое поступление скрипок и виолончелей', 
                                'description' => 'Струнные инструменты для классической музыки в наличии!', 
                                'content' => 'Встречайте новую коллекцию скрипок и виолончелей от Yamaha и Stentor. Высокое качество и доступные цены для начинающих и профессионалов. При покупке до конца месяца — бесплатный набор струн в подарок!', 
                                'to' => '/news/5'
                            ],
                            [
                                'id' => '6', 
                                'image' => 'storage/images/news/1749598024_JgmOwLP6PH.jpg', 
                                'title' => 'Розыгрыш гитарного процессора Line 6', 
                                'description' => 'Участвуйте в розыгрыше и выиграйте процессор эффектов!', 
                                'content' => 'С 15 июня по 1 июля участвуйте в нашем розыгрыше гитарного процессора Line 6 Helix. Для участия сделайте покупку на сумму от 10 000 рублей и зарегистрируйтесь на сайте. Победитель будет объявлен 2 июля!', 
                                'to' => '/news/6'
                            ],
                            [
                                'id' => '7', 
                                'image' => 'storage/images/news/1749598041_JPRlEb5nMc.jpg', 
                                'title' => 'Акция: Скидка 30% на наушники для музыкантов', 
                                'description' => 'Лучший звук для записи и прослушивания!', 
                                'content' => 'До конца июня скидка 30% на профессиональные наушники Beyerdynamic и Audio-Technica. Идеальны для студийной работы и живых выступлений. Спешите обновить свое оборудование по выгодной цене!', 
                                'to' => '/news/7'
                            ],
                            [
                                'id' => '8', 
                                'image' => 'storage/images/news/1749598052_br1b6sM3xH.webp', 
                                'title' => 'Презентация новых акустических систем Bose', 
                                'description' => 'Протестируйте новые акустические системы Bose!', 
                                'content' => '22 июня в 16:00 приглашаем на презентацию акустических систем Bose S1 Pro+. Компактные, мощные и идеальные для выступлений. Участники смогут протестировать оборудование и получить скидку 15% на покупку в день мероприятия.', 
                                'to' => '/news/8'
                            ],
                            [
                                'id' => '9', 
                                'image' => 'storage/images/news/1749598064_tPopnrlFOu.jpeg', 
                                'title' => 'Поступление аксессуаров для клавишных', 
                                'description' => 'Обновите свои клавишные с новыми аксессуарами!', 
                                'content' => 'В магазине появились новые стойки, педали и чехлы для клавишных инструментов от Korg и Yamaha. Надежные и стильные аксессуары для удобства игры и транспортировки. При покупке двух аксессуаров — скидка 10%!', 
                                'to' => '/news/9'
                            ],
                            [
                                'id' => '10', 
                                'image' => 'storage/images/news/1749598078_LZqkDOvjmO.png', 
                                'title' => 'Скидка на уроки музыки при покупке инструмента', 
                                'description' => 'Начните учиться с выгодой!', 
                                'content' => 'При покупке любого музыкального инструмента до 30 июня получите скидку 50% на первый месяц уроков в нашей музыкальной школе. Гитара, фортепиано, скрипка — выбирайте свой инструмент и учитесь у профессионалов!', 
                                'to' => '/news/10'
                            ],
                            [
                                'id' => '11', 
                                'image' => 'storage/images/news/1749598090_Shi8jhxf67.jpg', 
                                'title' => 'Новое поступление гитарных педалей Boss', 
                                'description' => 'Расширьте свое звучание с педалями Boss!', 
                                'content' => 'Встречайте новую коллекцию гитарных педалей Boss: от дисторшна до дилея. Компактные и надежные, они подойдут для сцены и студии. При покупке двух педалей до конца июня — кабель в подарок!', 
                                'to' => '/news/11'
                            ],
                            [
                                'id' => '12', 
                                'image' => 'storage/images/news/1749598103_pNYoA7soKH.jpg', 
                                'title' => 'Конкурс каверов в нашем магазине', 
                                'description' => 'Покажите свой талант и выиграйте призы!', 
                                'content' => '28 июня в 18:00 приглашаем на конкурс каверов в нашем магазине. Запишите кавер на любимую песню, выступите на сцене и поборитесь за главный приз — сертификат на 15 000 рублей для покупок в нашем магазине. Регистрация открыта на сайте!', 
                                'to' => '/news/12'
                            ]
                        ]
                ],
                'en' => [
                    'mainTitle' => 'News',
                    'description' => '<p>Stay updated with the latest events from our store!</p>',
                    'archiveTitle' => 'News Archive',
                    'news' => [
                        [
                            'id' => '1', 
                            'image' => 'storage/images/news/1749597930_jQy3a7jfzm.jpg', 
                            'title' => 'New Fender Bass Guitars Arrival', 
                            'description' => 'Legendary Fender bass guitars now available!', 
                            'content' => 'Our store has received new Fender Precision and Jazz Bass 2025 models. Featuring improved electronics and classic design for powerful sound. Get 10% off bass accessories when purchased before the end of June!', 
                            'to' => '/news/1'
                        ],
                        [
                            'id' => '2', 
                            'image' => 'storage/images/news/1749597953_BZdumYNK6U.webp', 
                            'title' => 'Promotion: Free Shipping on Orders Over 5000 RUB', 
                            'description' => 'Save on delivery with our special offer!', 
                            'content' => 'From June 12 to 25, we offer free shipping on all orders over 5000 RUB. Buy instruments, accessories or equipment and get them delivered to your door at no extra cost. Order now on our website!', 
                            'to' => '/news/2'
                        ],
                        [
                            'id' => '3', 
                            'image' => 'storage/images/news/1749597969_1RmbcCeRrU.jpg', 
                            'title' => 'Drum Playing Masterclass', 
                            'description' => 'Master rhythm with a professional drummer!', 
                            'content' => 'Join our drumming masterclass on June 18 at 5 PM. An experienced musician will share techniques and professional secrets. The event is free but requires registration on our website. Don\'t miss out!', 
                            'to' => '/news/3'
                        ],
                        [
                            'id' => '4', 
                            'image' => 'storage/images/news/1749597991_PNBnuUgMAQ.webp', 
                            'title' => '25% Discount on Ampeg Guitar Amplifiers', 
                            'description' => 'Power up your sound with Ampeg at a great price!', 
                            'content' => 'Until June 20, get 25% off all Ampeg guitar amplifiers. From compact home models to powerful stage combos - find your perfect sound. Visit our store or order online.', 
                            'to' => '/news/4'
                        ],
                        [
                            'id' => '5', 
                            'image' => 'storage/images/news/1749598009_FYmKVcQbTP.jpg', 
                            'title' => 'New Violins and Cellos in Stock', 
                            'description' => 'String instruments for classical music now available!', 
                            'content' => 'Discover our new collection of violins and cellos from Yamaha and Stentor. High quality at affordable prices for beginners and professionals. Get a free set of strings with any purchase before month end!', 
                            'to' => '/news/5'
                        ],
                        [
                            'id' => '6', 
                            'image' => 'storage/images/news/1749598024_JgmOwLP6PH.jpg', 
                            'title' => 'Line 6 Guitar Processor Giveaway', 
                            'description' => 'Enter to win an effects processor!', 
                            'content' => 'From June 15 to July 1, participate in our Line 6 Helix guitar processor giveaway. To enter, make a purchase over 10,000 RUB and register on our website. Winner will be announced July 2!', 
                            'to' => '/news/6'
                        ],
                        [
                            'id' => '7', 
                            'image' => 'storage/images/news/1749598041_JPRlEb5nMc.jpg', 
                            'title' => '30% Off Professional Headphones', 
                            'description' => 'Premium sound for recording and listening!', 
                            'content' => 'Until the end of June, get 30% off professional headphones from Beyerdynamic and Audio-Technica. Perfect for studio work and live performances. Upgrade your equipment at a great price!', 
                            'to' => '/news/7'
                        ],
                        [
                            'id' => '8', 
                            'image' => 'storage/images/news/1749598052_br1b6sM3xH.webp', 
                            'title' => 'Bose Speaker System Presentation', 
                            'description' => 'Test the new Bose acoustic systems!', 
                            'content' => 'Join us June 22 at 4 PM for the Bose S1 Pro+ speaker system presentation. Compact, powerful and perfect for performances. Participants can test the equipment and get 15% discount on purchases made during the event.', 
                            'to' => '/news/8'
                        ],
                        [
                            'id' => '9', 
                            'image' => 'storage/images/news/1749598064_tPopnrlFOu.jpeg', 
                            'title' => 'New Keyboard Accessories', 
                            'description' => 'Upgrade your keyboard setup!', 
                            'content' => 'We\'ve received new stands, pedals and cases for keyboard instruments from Korg and Yamaha. Reliable and stylish accessories for comfortable playing and transportation. Get 10% off when buying two accessories!', 
                            'to' => '/news/9'
                        ],
                        [
                            'id' => '10', 
                            'image' => 'storage/images/news/1749598078_LZqkDOvjmO.png', 
                            'title' => 'Music Lessons Discount with Instrument Purchase', 
                            'description' => 'Start learning with a special offer!', 
                            'content' => 'Purchase any musical instrument before June 30 and get 50% off your first month of lessons at our music school. Guitar, piano, violin - choose your instrument and learn from professionals!', 
                            'to' => '/news/10'
                        ],
                        [
                            'id' => '11', 
                            'image' => 'storage/images/news/1749598090_Shi8jhxf67.jpg', 
                            'title' => 'New Boss Guitar Pedals', 
                            'description' => 'Expand your sound with Boss effects!', 
                            'content' => 'Check out our new collection of Boss guitar pedals - from distortion to delay. Compact and reliable, perfect for stage and studio. Buy two pedals before June ends and get a free cable!', 
                            'to' => '/news/11'
                        ],
                        [
                            'id' => '12', 
                            'image' => 'storage/images/news/1749598103_pNYoA7soKH.jpg', 
                            'title' => 'Cover Song Competition', 
                            'description' => 'Show your talent and win prizes!', 
                            'content' => 'Join our cover song competition on June 28 at 6 PM. Record a cover of your favorite song, perform live and compete for the grand prize - a 15,000 RUB gift certificate for our store. Register now on our website!', 
                            'to' => '/news/12'
                        ]
                    ]
                ]
            ]
        ];

        Page::updateOrCreate(
            ['pageId' => 'news'],
            ['content' => $newsPage['content']]
        );

        $this->info('News page content seeded successfully!');
    }
}