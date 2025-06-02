<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Item;
use App\Models\Order;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class OrderService
{
    /**
     * Получить все заказы пользователя
     */
    public function getOrders($user): array
    {
        $orders = Order::where('user_id', $user->id)->get();

        $formattedOrders = $orders->map(function ($order) {
            $items = $this->formatOrderItems($order->items);
            return [
                'id' => $order->_id,
                'items' => $items,
                'total_amount' => $order->total_amount,
                'status' => $order->status,
                'phone' => $order->phone,
                'delivery_type' => $order->delivery_type,
                'address' => $order->address,
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
            ];
        })->toArray();

        return ['orders' => $formattedOrders];
    }

    /**
     * Создать заказ
     */
    public function createOrder($user, array $data): Order
    {
        $cart = Cart::where('user_id', $user->id)->first();
        if (!$cart || empty($cart->items)) {
            Log::error('Cart is empty for user_id: ' . $user->id);
            throw new \Exception('Cart is empty', 400);
        }

        // Проверяем, что все товары в запросе существуют
        foreach ($data['items'] as $item) {
            $product = Item::find($item['product_id']);
            if (!$product) {
                Log::error('Product not found for product_id: ' . $item['product_id']);
                throw new \Exception('Product with ID ' . $item['product_id'] . ' not found', 422);
            }
        }

        // Рассчитываем общую стоимость
        $totalAmount = collect($data['items'])->reduce(function ($sum, $item) {
            $product = Item::find($item['product_id']);
            if (!$product) {
                return $sum;
            }
            $itemPrice = $product->price * (1 - ($product->discount ?? 0) / 100);
            return $sum + ($itemPrice * $item['quantity']);
        }, 0);

        // Создаем заказ
        $order = Order::create([
            'user_id' => $user->id,
            'items' => $data['items'],
            'total_amount' => $totalAmount,
            'phone' => $data['phone'],
            'delivery_type' => $data['delivery_type'],
            'address' => $data['delivery_type'] === 'delivery' ? $data['address'] : null,
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Очищаем корзину
        $cart->items = [];
        $cart->save();

        Log::info('Order created successfully', ['order_id' => $order->_id, 'user_id' => $user->id]);

        return $order;
    }

    /**
     * Форматировать товары заказа для ответа
     */
    public function formatOrderItems(array $items): array
    {
        return collect($items)->map(function ($item) {
            $product = Item::find($item['product_id']);
            if (!$product) {
                Log::warning('Product not found for product_id: ' . $item['product_id']);
                return null;
            }
            return [
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'attributes' => $item['attributes'] ?? [],
                'product' => [
                    'name' => $product->name,
                    'price' => $product->price,
                    'image_url' => $product->image_url,
                    'discount' => $product->discount,
                ],
            ];
        })->filter()->values()->toArray();
    }
}
