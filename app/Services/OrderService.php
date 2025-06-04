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
     * Получить все заказы
     */
    public function getAllOrders(): array
    {
        $orders = Order::all();
        $formattedOrders = $orders->map(function ($order) {
            $items = $this->formatOrderItems($order->items);
            return [
                'id' => $order->_id,
                'user_id' => $order->user_id,
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
     * Получить заказы пользователя
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

        foreach ($data['items'] as $item) {
            $product = Item::find($item['product_id']);
            if (!$product) {
                Log::error('Product not found for product_id: ' . $item['product_id']);
                throw new \Exception('Product with ID ' . $item['product_id'] . ' not found', 422);
            }
        }

        $totalAmount = collect($data['items'])->reduce(function ($sum, $item) {
            $product = Item::find($item['product_id']);
            if (!$product) {
                return $sum;
            }
            $itemPrice = $product->price * (1 - ($product->discount ?? 0) / 100);
            return $sum + ($itemPrice * $item['quantity']);
        }, 0);

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

        $cart->items = [];
        $cart->save();

        Log::info('Order created successfully', ['order_id' => $order->_id, 'user_id' => $user->id]);

        return $order;
    }

    /**
     * Обновить заказ
     */
    public function updateOrder(string $orderId, array $data): Order
    {
        $order = Order::find($orderId);
        if (!$order) {
            Log::error('Order not found for order_id: ' . $orderId);
            throw new \Exception('Order not found', 404);
        }

        // Проверяем товары, если они переданы
        if (isset($data['items'])) {
            foreach ($data['items'] as $item) {
                $product = Item::find($item['product_id']);
                if (!$product) {
                    Log::error('Product not found for product_id: ' . $item['product_id']);
                    throw new \Exception('Product with ID ' . $item['product_id'] . ' not found', 422);
                }
            }

            // Пересчитываем total_amount, если items обновлены
            $data['total_amount'] = collect($data['items'])->reduce(function ($sum, $item) {
                $product = Item::find($item['product_id']);
                $itemPrice = $product->price * (1 - ($product->discount ?? 0) / 100);
                return $sum + ($itemPrice * $item['quantity']);
            }, 0);
        }

        // Обновляем только переданные поля
        $order->fill(array_filter($data, fn($value) => !is_null($value)));
        $order->updated_at = now();
        $order->save();

        Log::info('Order updated successfully', ['order_id' => $order->_id]);

        return $order;
    }

    /**
     * Удалить заказ
     */
    public function deleteOrder(string $orderId): void
    {
        $order = Order::find($orderId);
        if (!$order) {
            Log::error('Order not found for order_id: ' . $orderId);
            throw new \Exception('Order not found', 404);
        }

        $order->delete();

        Log::info('Order deleted successfully', ['order_id' => $orderId]);
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