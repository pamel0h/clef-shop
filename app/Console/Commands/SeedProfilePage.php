<?php

namespace App\Console\Commands;

use App\Models\Page;
use Illuminate\Console\Command;

class SeedProfilePage extends Command
{
    protected $signature = 'seed:profile-page';
    protected $description = 'Seed the Profile page content into MongoDB';

    public function handle()
    {
        $profilePage = [
            'pageId' => 'profile',
            'content' => [
                'ru' => [
                    'title' => 'Личный кабинет',
                    'my_data' => 'Мои данные',
                    'orders' => 'Мои заказы',
                    'purchases' => 'Мои покупки',
                    'messages' => 'Сообщения',
                    'logout' => 'Выйти',
                    'loading' => 'Загрузка...',
                    'orders_error' => 'Ошибка загрузки заказов',
                    'messages_error' => 'Ошибка загрузки сообщений',
                    'no_orders' => 'Нет текущих заказов',
                    'no_purchases' => 'Нет завершенных покупок',
                    'no_messages' => 'Нет сообщений'
                ],
                'en' => [
                    'title' => 'Profile',
                    'my_data' => 'My Data',
                    'orders' => 'My Orders',
                    'purchases' => 'My Purchases',
                    'messages' => 'Messages',
                    'logout' => 'Logout',
                    'loading' => 'Loading...',
                    'orders_error' => 'Error loading orders',
                    'messages_error' => 'Error loading messages',
                    'no_orders' => 'No current orders',
                    'no_purchases' => 'No completed purchases',
                    'no_messages' => 'No messages'
                ]
            ]
        ];

        Page::updateOrCreate(
            ['pageId' => 'profile'],
            ['content' => $profilePage['content']]
        );

        $this->info('Profile page content seeded successfully!');
    }
}