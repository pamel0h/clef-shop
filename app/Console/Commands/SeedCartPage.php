<?php

namespace App\Console\Commands;

use App\Models\Page;
use Illuminate\Console\Command;

class SeedCartPage extends Command
{
    protected $signature = 'seed:cart-page';
    protected $description = 'Seed the Cart page content into MongoDB';

    public function handle()
    {
        $cartPage = [
            'pageId' => 'cart',
            'content' => [
                'ru' => [
                    'title' => 'Корзина',
                    'total' => 'Итого',
                    'empty' => 'Корзина пуста',
                    'clear_cart' => 'Очистить корзину',
                    'pickup' => 'Самовывоз',
                    'delivery' => 'Доставка',
                    'phone_label' => 'Телефон',
                    'phone_placeholder' => 'Введите ваш телефон',
                    'address_label' => 'Адрес доставки',
                    'address_placeholder' => 'Введите адрес доставки',
                    'order' => 'Оформить заказ',
                    'please_login' => 'Пожалуйста, войдите в аккаунт',
                    'phone_required' => 'Укажите телефон',
                    'address_required' => 'Укажите адрес доставки',
                    'order_error' => 'Ошибка при оформлении заказа',
                    'loading' => 'Загрузка...'
                ],
                'en' => [
                    'title' => 'Cart',
                    'total' => 'Total',
                    'empty' => 'Cart is empty',
                    'clear_cart' => 'Clear Cart',
                    'pickup' => 'Pickup',
                    'delivery' => 'Delivery',
                    'phone_label' => 'Phone',
                    'phone_placeholder' => 'Enter your phone',
                    'address_label' => 'Delivery Address',
                    'address_placeholder' => 'Enter delivery address',
                    'order' => 'Place Order',
                    'please_login' => 'Please log in',
                    'phone_required' => 'Phone is required',
                    'address_required' => 'Delivery address is required',
                    'order_error' => 'Error placing order',
                    'loading' => 'Loading...'
                ]
            ]
        ];

        Page::updateOrCreate(
            ['pageId' => 'cart'],
            ['content' => $cartPage['content']]
        );

        $this->info('Cart page content seeded successfully!');
    }
}