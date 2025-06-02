<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Item;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class CartService
{
    /**
     * Получить корзину пользователя
     */
    public function getCart($user): array
    {
        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart || empty($cart->items)) {
            return ['items' => []];
        }

        return $this->formatCartItems($cart->items);
    }

    /**
     * Добавить товар в корзину
     */
    public function addItem($user, array $data): Cart
    {
        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id],
            ['items' => []]
        );

        $items = collect($cart->items ?? []);
        $productId = (string) $data['product_id'];
        $quantity = $data['quantity'];

        $existingItemIndex = $items->search(fn($item) => (string) $item['product_id'] === $productId);

        if ($existingItemIndex !== false) {
            $items = $items->map(function ($item, $index) use ($existingItemIndex, $quantity) {
                if ($index === $existingItemIndex) {
                    $item['quantity'] += $quantity;
                }
                return $item;
            });
        } else {
            $items->push([
                'product_id' => $productId,
                'quantity' => $quantity,
                'attributes' => $data['attributes'] ?? [],
            ]);
        }

        $cart->items = $items->values()->toArray();
        $cart->save();
        $cart->refresh();

        return $cart;
    }

    /**
     * Обновить количество товара в корзине
     */
    public function updateItem($user, array $data): Cart
    {
        $cart = Cart::where('user_id', $user->id)->first();
        if (!$cart) {
            Log::error('Cart not found for user_id: ' . $user->id);
            throw new \Exception('Cart not found', 404);
        }

        $items = collect($cart->items ?? []);
        $productId = (string) $data['product_id'];
        $quantity = $data['quantity'];

        Log::info('Updating item in cart', ['product_id' => $productId, 'quantity' => $quantity, 'items' => $items->toArray()]);

        $itemIndex = $items->search(fn($item) => (string) $item['product_id'] === $productId);

        if ($itemIndex === false) {
            Log::error('Item not found in cart', ['product_id' => $productId, 'user_id' => $user->id]);
            throw new \Exception('Item with product_id ' . $productId . ' not found in cart', 422);
        }

        if ($quantity === 0) {
            $items = $items->filter(fn($item) => (string) $item['product_id'] !== $productId);
        } else {
            $items = $items->map(function ($item, $index) use ($itemIndex, $quantity) {
                if ($index === $itemIndex) {
                    $item['quantity'] = $quantity;
                }
                return $item;
            });
        }

        $cart->items = $items->values()->toArray();
        $cart->save();
        $cart->refresh();

        return $cart;
    }

    /**
     * Удалить товар из корзины
     */
    public function removeItem($user, string $productId): Cart
    {
        $cart = Cart::where('user_id', $user->id)->first();
        if (!$cart) {
            Log::error('Cart not found for user_id: ' . $user->id);
            throw new \Exception('Cart not found', 404);
        }

        $items = collect($cart->items ?? []);
        $filteredItems = $items->filter(fn($item) => (string) $item['product_id'] !== (string) $productId)->values()->toArray();

        $cart->items = $filteredItems;
        $cart->save();
        $cart->refresh();

        return $cart;
    }

    /**
     * Очистить корзину
     */
    public function clearCart($user): void
    {
        $cart = Cart::where('user_id', $user->id)->first();
        if ($cart) {
            $cart->items = [];
            $cart->save();
        }
    }

    /**
     * Синхронизировать корзину
     */
    public function syncCart($user, array $items): Cart
    {
        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id],
            ['items' => []]
        );

        $existingItems = collect($cart->items ?? []);

        foreach ($items as $newItem) {
            $productId = (string) $newItem['product_id'];
            $existingItemIndex = $existingItems->search(fn($item) => (string) $item['product_id'] === $productId);

            if ($existingItemIndex !== false) {
                $existingItems = $existingItems->map(function ($item, $index) use ($existingItemIndex, $newItem) {
                    if ($index === $existingItemIndex) {
                        $item['quantity'] += $newItem['quantity'];
                        $item['attributes'] = $newItem['attributes'] ?? [];
                    }
                    return $item;
                });
            } else {
                $existingItems->push([
                    'product_id' => $productId,
                    'quantity' => $newItem['quantity'],
                    'attributes' => $newItem['attributes'] ?? [],
                ]);
            }
        }

        $cart->items = $existingItems->values()->toArray();
        $cart->save();
        $cart->refresh();

        return $cart;
    }

    /**
     * Форматировать товары корзины для ответа
     */
    public function formatCartItems(array $items): array
    {
        $cartItems = collect($items)->map(function ($item) {
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

        return ['items' => $cartItems];
    }
}
