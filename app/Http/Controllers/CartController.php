<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        // Получаем корзину пользователя
        $cart = Cart::where('user_id', $user->id)->first();
        if (!$cart) {
            return response()->json(['items' => []]);  // Если корзина пустая, возвращаем пустой массив
        }

        // Формируем массив товаров с дополнительной информацией о продукте
        $cartItems = collect($cart->items)->map(function ($item) {
            $product = Item::find($item['product_id']);
            return [
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'attributes' => $item['attributes'] ?? [],
                'product' => $product ? [
                    'name' => $product->name,
                    'price' => $product->price,
                    'image_url' => $product->image_url,
                    'discount' => $product->discount,
                ] : null,
            ];
        })->filter(function ($item) {
            return $item['product'] !== null;
        })->values();

        return response()->json(['items' => $cartItems]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:items,_id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $userId = $user->id;
        $cart = Cart::firstOrCreate(// Получаем корзину или создаём новую
            ['user_id' => $userId],
            ['items' => []]
        );

        $items = collect($cart->items ?? []); // Получаем текущие товары из корзины как коллекцию

        $productId = $request->input('product_id');
        $quantity = $request->input('quantity');

        // Ищем товар в корзине
        $existingItemKey = $items->search(function ($item) use ($productId) {
            return $item['product_id'] == $productId;
        });

        if ($existingItemKey !== false) {
            $items[$existingItemKey]['quantity'] += $quantity;
        } else {
            $items->push([
                'product_id' => $productId,
                'quantity' => $quantity,
                'attributes' => [],
            ]);
        }

        $cart->items = $items->toArray(); // Обновляем поле items в корзине, приводя к массиву
        $cart->save();

        $cart->refresh(); // Возвращаем обновлённую корзину

        $cartItems = collect($cart->items)->map(function ($item) {
            $product = Item::find($item['product_id']);
            return [
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'attributes' => $item['attributes'] ?? [],
                'product' => $product ? [
                    'name' => $product->name,
                    'price' => $product->price,
                    'image_url' => $product->image_url,
                    'discount' => $product->discount,
                ] : null,
            ];
        })->filter(function ($item) {
            return $item['product'] !== null;
        })->values();

        return response()->json([
            'message' => 'Item added to cart',
            'cart' => ['items' => $cartItems->toArray()],
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:items,_id',
            'quantity' => 'required|integer|min:0',
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userId = $user->id;
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity');

        $cart = Cart::firstOrCreate(// Получаем корзину или создаём новую
            ['user_id' => $userId],
            ['items' => []]
        );

        $items = collect($cart->items ?? []);

        $itemIndex = $items->search(function ($item) use ($productId) { // Ищем индекс товара в корзине
            return $item['product_id'] == $productId;
        });
        
        $items[$itemIndex]['quantity'] = $quantity; //изменяем количество товара
        $cart->items = $items->toArray();
        $cart->save();

        // Формируем ответ с актуальными данными
        $cart->refresh();

        $cartItems = collect($cart->items)->map(function ($item) {
            $product = Item::find($item['product_id']);
            if (!$product) {
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
                ]
            ];
        })->filter()->values();

        return response()->json([
            'message' => 'Cart updated successfully',
            'cart' => ['items' => $cartItems->toArray()],
        ]);
    }

public function removeItem($productId, Request $request)
{
    $user = $request->user();
    if (!$user) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $cart = Cart::where('user_id', $user->id)->first();
    if (!$cart) {
        return response()->json(['message' => 'Cart not found'], 404);
    }

    $items = collect($cart->items);
    $filteredItems = $items->filter(fn($item) => $item['product_id'] != $productId)->values()->toArray();

    $cart->items = $filteredItems;
    $cart->save();

    return response()->json([
        'message' => 'Item removed from cart',
        'cart' => $cart
    ]);
}

    // Очистить корзину
    public function clear(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $cart = $user ? Cart::where('user_id', $user->id)->first() : null;
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }

        if ($cart) {
            $cart->items = [];
            $cart->save();
        }

        return response()->json(['message' => 'Cart cleared']);
    }

    // Синхронизировать корзину после логина
    public function sync(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:items,_id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.attributes' => 'nullable|array',
        ]);

        $user = $request->user();
        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart) {
            $cart = Cart::create([
                'user_id' => $user->id,
                'items' => $request->input('items')
            ]);
        } else {
            $existingItems = $cart->items;
            $newItems = $request->input('items');

            foreach ($newItems as $newItem) {
                $existingItemIndex = array_search($newItem['product_id'], array_column($existingItems, 'product_id'));
                if ($existingItemIndex !== false) {
                    $existingItems[$existingItemIndex]['quantity'] += $newItem['quantity'];
                } else {
                    $existingItems[] = $newItem;
                }
            }
            $cart->items = $existingItems;
            $cart->save();
        }

        return response()->json([
            'message' => 'Cart synchronized successfully',
            'cart' => $cart
        ]);
    }
}