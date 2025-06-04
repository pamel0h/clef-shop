<?php

namespace App\Console\Commands;

use App\Models\Page;
use Illuminate\Console\Command;

class SeedContactPage extends Command
{
    protected $signature = 'seed:contact-page';
    protected $description = 'Seed the Contact page content into MongoDB';

    public function handle()
    {
        $contactPage = [
            'pageId' => 'contacts',
            'content' => [
                'ru' => [
                    'mainTitle' => 'Контакты',
                    'phones' => 'Наши номера телефонов',
                    'phoneNumbers' => ['+1234566788', '+1234455567'],
                    'aviable' => 'Прием по телефону с 10:00 до 19:00',
                    'howTitle' => 'Как к нам добраться?',
                    'howText' => 'Мы находимся по адресу .... Вам нужно пройти...',
                    'questionsTitle' => 'Остались вопросы?',
                    'questionsText' => 'Заполните форму обратной связи!',
                ],
                'en' => [
                    'mainTitle' => 'Contacts',
                    'phones' => 'Our phone numbers',
                    'phoneNumbers' => ['+1234566788', '+1234455567'],
                    'aviable' => 'Reception by phone from 10 am to 7 pm',
                    'howTitle' => 'How to get to us?',
                    'howText' => 'We are located at the address .... You need to go...',
                    'questionsTitle' => 'Still have questions?',
                    'questionsText' => 'Fill out the feedback form!',
                ],
            ],
        ];

        Page::updateOrCreate(
            ['pageId' => 'contacts'],
            ['content' => $contactPage['content']]
        );

        $this->info('Contact page content seeded successfully!');
    }
}