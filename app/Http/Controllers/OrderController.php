<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Item;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function getOrder(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Получаем все заказы пользователя
        $orders = Order::where('user_id', $user->id)->get();

        // Формируем ответ с полной информацией о товарах
        $formattedOrders = $orders->map(function ($order) {
            $items = collect($order->items)->map(function ($item) {
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
        });

        return response()->json(['orders' => $formattedOrders]);
    }

    public function createOrder(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:items,_id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.attributes' => 'nullable|array',
            'phone' => 'required|string|min:5',
            'delivery_type' => 'required|in:pickup,delivery',
            'address' => 'required_if:delivery_type,delivery|string|min:5',
        ]);

        $cart = Cart::where('user_id', $user->id)->first();
        if (!$cart || empty($cart->items)) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        // Рассчитываем общую стоимость
        $totalAmount = collect($request->items)->reduce(function ($sum, $item) {
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
            'items' => $request->items,
            'total_amount' => $totalAmount,
            'phone' => $request->phone,
            'delivery_type' => $request->delivery_type,
            'address' => $request->delivery_type === 'delivery' ? $request->address : null,
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Очищаем корзину
        $cart->items = [];
        $cart->save();

        return response()->json([
            'success' => true,
            'message' => 'Order created successfully',
            'order' => $order,
        ]);
    }
}