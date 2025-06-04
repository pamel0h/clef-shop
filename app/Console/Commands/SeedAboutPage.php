<?php

namespace App\Console\Commands;

use App\Models\Page;
use Illuminate\Console\Command;

class SeedAboutPage extends Command
{
    protected $signature = 'seed:about-page';
    protected $description = 'Seed the About page content into MongoDB';

    public function handle()
    {
        $aboutPage = [
            'pageId' => 'about',
            'content' => [
                'ru' => [
                    'mainTitle' => 'О нас',
                    'title1' => 'Музыка для всех',
                    'text1' => '<p>Мы верим, что музыка — это универсальный язык, который объединяет людей. Наш магазин создан для того, чтобы каждый, от начинающего музыканта до профессионала, мог найти инструмент по душе. У нас есть всё: гитары, клавишные, ударные, духовые и многое другое. Качество, доступные цены и индивидуальный подход — вот что делает нас лучшим выбором для вашего музыкального пути.</p>',
                    'text2' => '<p>Неважно, в каком стиле вы играете и какой у вас уровень — музыка должна приносить радость. Мы помогаем музыкантам находить идеальные инструменты, аксессуары и оборудование, чтобы творчество было вдохновляющим и комфортным. Присоединяйтесь к нашему сообществу и откройте для себя мир звуков!</p>',
                    'title2' => 'С вами более 10 лет',
                    'text3' => '<p>С 2013 года наш магазин помогает музыкантам воплощать их творческие идеи в жизнь. За это время мы прошли большой путь: начинали с небольшого ассортимента, а сегодня предлагаем тысячи товаров — от бюджетных вариантов для новичков до профессионального оборудования для студий и сцены. Нас выбирают за честность, экспертный подход и внимание к деталям. Мы не просто продаём инструменты — мы помогаем подобрать то, что действительно подходит вам по звуку, стилю и бюджету. Наши клиенты возвращаются к нам снова и снова, и это лучшая оценка нашей работы. Благодаря вашему доверию мы растем и развиваемся: расширяем ассортимент, улучшаем сервис и поддерживаем музыкальное сообщество. Для нас важно, чтобы каждый, кто заходит в наш магазин — онлайн или оффлайн — чувствовал, что музыка доступна каждому. Спасибо, что остаётесь с нами! Впереди ещё больше новых возможностей, и мы будем рады разделить их с вами. 🎶</p>',
                    'title3' => 'Подписывайтесь на нас в социальных сетях',
                    'image' => '/images/mainphoto.jpg',
                    'sign' => 'Clef 2025 ❤️',
                    'media1' => '',
                    'media2' => '',
                    'media3' => ''
                ],
                'en' => [
                    'mainTitle' => 'About us',
                    'title1' => 'Music for everyone',
                    'text1' => '<p>We believe that music is a universal language that unites people. Our store is designed to help everyone, from beginners to professionals, find an instrument to their liking. We have everything: guitars, keyboards, drums, brass instruments and more. Quality, affordable prices and an individual approach - that\'s what makes us the best choice for your musical journey.</p>',
                    'text2' => '<p>No matter what style you play or what level you are, music should be fun. We help musicians find the perfect instruments, accessories, and gear to make creativity inspiring and comfortable. Join our community and discover a world of sounds!</p>',
                    'title2' => 'With you for more than 10 years',
                    'text3' => '<p>Since 2013, our store has been helping musicians bring their creative ideas to life. During this time, we have come a long way: we started with a small assortment, and today we offer thousands of products - from budget options for beginners to professional equipment for studios and stages. People choose us for our honesty, expert approach and attention to detail. We do not just sell instruments - we help you choose what really suits your sound, style and budget. Our customers come back to us again and again, and this is the best assessment of our work. Thanks to your trust, we grow and develop: we expand our range, improve service and support the music community. It is important to us that everyone who comes to our store - online or offline - feels that music is available to everyone. Thank you for staying with us! There are more new opportunities ahead, and we look forward to sharing them with you. 🎶</p>',
                    'title3' => 'Follow us on our social networks',
                    'image' => '/images/mainphoto.jpg',
                    'sign' => 'Clef 2025 ❤️',
                    'media1' => '',
                    'media2' => '',
                    'media3' => ''
                ]
            ]
        ];

        Page::updateOrCreate(
            ['pageId' => 'about'],
            ['content' => $aboutPage['content']]
        );

        $this->info('About page content seeded successfully!');
    }
}