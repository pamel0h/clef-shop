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
                        ['id' => '1', 'image' => '/images/mainphoto.jpg', 'title' => 'Новость 1', 'description' => 'Краткое описание новости', 'content' => '<p>Полный текст новости...</p>', 'to' => '/news/1'],
                        ['id' => '2', 'image' => '/images/mainphoto.jpg', 'title' => 'Новость 2', 'description' => 'Краткое описание новости', 'content' => '<p>Полный текст новости...</p>', 'to' => '/news/2'],
                        ['id' => '3', 'image' => '/images/mainphoto.jpg', 'title' => 'Новость 3', 'description' => 'Краткое описание новости', 'content' => '<p>Полный текст новости...</p>', 'to' => '/news/3'],
                        ['id' => '4', 'image' => '/images/mainphoto.jpg', 'title' => 'Новость 4', 'description' => 'Краткое описание новости', 'content' => '<p>Полный текст новости...</p>', 'to' => '/news/4'],
                        ['id' => '5', 'image' => '/images/mainphoto.jpg', 'title' => 'Новость 5', 'description' => 'Краткое описание новости', 'content' => '<p>Полный текст новости...</p>', 'to' => '/news/5'],
                        ['id' => '6', 'image' => '/images/mainphoto.jpg', 'title' => 'Новость 6', 'description' => 'Краткое описание новости', 'content' => '<p>Полный текст новости...</p>', 'to' => '/news/6'],
                        ['id' => '7', 'image' => '/images/mainphoto.jpg', 'title' => 'Новость 7', 'description' => 'Краткое описание новости', 'content' => '<p>Полный текст новости...</p>', 'to' => '/news/7'],
                        ['id' => '8', 'image' => '/images/mainphoto.jpg', 'title' => 'Новость 8', 'description' => 'Краткое описание новости', 'content' => '<p>Полный текст новости...</p>', 'to' => '/news/8'],
                        ['id' => '9', 'image' => '/images/mainphoto.jpg', 'title' => 'Новость 9', 'description' => 'Краткое описание новости', 'content' => '<p>Полный текст новости...</p>', 'to' => '/news/9'],
                        ['id' => '10', 'image' => '/images/mainphoto.jpg', 'title' => 'Новость 10', 'description' => 'Краткое описание новости', 'content' => '<p>Полный текст новости...</p>', 'to' => '/news/10'],
                        ['id' => '11', 'image' => '/images/mainphoto.jpg', 'title' => 'Новость 11', 'description' => 'Краткое описание новости', 'content' => '<p>Полный текст новости...</p>', 'to' => '/news/11'],
                        ['id' => '12', 'image' => '/images/mainphoto.jpg', 'title' => 'Новость 12', 'description' => 'Краткое описание новости', 'content' => '<p>Полный текст новости...</p>', 'to' => '/news/12']
                    ]
                ],
                'en' => [
                    'mainTitle' => 'News',
                    'description' => '<p>Stay updated with the latest events from our store!</p>',
                    'archiveTitle' => 'News Archive',
                    'news' => [
                        ['id' => '1', 'image' => '/images/mainphoto.jpg', 'title' => 'News 1', 'description' => 'Description of news', 'content' => '<p>Full text of news...</p>', 'to' => '/news/1'],
                        ['id' => '2', 'image' => '/images/mainphoto.jpg', 'title' => 'News 2', 'description' => 'Description of news', 'content' => '<p>Full text of news...</p>', 'to' => '/news/2'],
                        ['id' => '3', 'image' => '/images/mainphoto.jpg', 'title' => 'News 3', 'description' => 'Description of news', 'content' => '<p>Full text of news...</p>', 'to' => '/news/3'],
                        ['id' => '4', 'image' => '/images/mainphoto.jpg', 'title' => 'News 4', 'description' => 'Description of news', 'content' => '<p>Full text of news...</p>', 'to' => '/news/4'],
                        ['id' => '5', 'image' => '/images/mainphoto.jpg', 'title' => 'News 5', 'description' => 'Description of news', 'content' => '<p>Full text of news...</p>', 'to' => '/news/5'],
                        ['id' => '6', 'image' => '/images/mainphoto.jpg', 'title' => 'News 6', 'description' => 'Description of news', 'content' => '<p>Full text of news...</p>', 'to' => '/news/6'],
                        ['id' => '7', 'image' => '/images/mainphoto.jpg', 'title' => 'News 7', 'description' => 'Description of news', 'content' => '<p>Full text of news...</p>', 'to' => '/news/7'],
                        ['id' => '8', 'image' => '/images/mainphoto.jpg', 'title' => 'News 8', 'description' => 'Description of news', 'content' => '<p>Full text of news...</p>', 'to' => '/news/8'],
                        ['id' => '9', 'image' => '/images/mainphoto.jpg', 'title' => 'News 9', 'description' => 'Description of news', 'content' => '<p>Full text of news...</p>', 'to' => '/news/9'],
                        ['id' => '10', 'image' => '/images/mainphoto.jpg', 'title' => 'News 10', 'description' => 'Description of news', 'content' => '<p>Full text of news...</p>', 'to' => '/news/10'],
                        ['id' => '11', 'image' => '/images/mainphoto.jpg', 'title' => 'News 11', 'description' => 'Description of news', 'content' => '<p>Full text of news...</p>', 'to' => '/news/11'],
                        ['id' => '12', 'image' => '/images/mainphoto.jpg', 'title' => 'News 12', 'description' => 'Description of news', 'content' => '<p>Full text of news...</p>', 'to' => '/news/12']
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