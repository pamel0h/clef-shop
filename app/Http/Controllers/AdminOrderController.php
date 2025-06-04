<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateOrderRequest;
use App\Http\Requests\DeleteOrderRequest;
use App\Services\OrderService;
use App\Http\Requests\CreateOrderRequest;
use Illuminate\Http\Request;



class AdminOrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    /**
     * Получить все заказы
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }


        try {
            $orders = $this->orderService->getAllOrders();
            return response()->json($orders);
        } catch (\Exception $e) {
            \Log::error('Failed to get all orders', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    /**
     * Обновить заказ
     */
    public function update(UpdateOrderRequest $request, string $id)
    {
        try {
            $order = $this->orderService->updateOrder($id, $request->validated());
            return response()->json([
                'id' => $order->_id,
                'user_id' => $order->user_id,
                'items' => $this->orderService->formatOrderItems($order->items),
                'total_amount' => $order->total_amount,
                'status' => $order->status,
                'phone' => $order->phone,
                'delivery_type' => $order->delivery_type,
                'address' => $order->address,
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }

    /**
     * Удалить заказ
     */
    public function destroy(DeleteOrderRequest $request, string $orderId)
    {
        try {
            \Log::info('Attempting to delete order', ['orderId' => $orderId]);
            $this->orderService->deleteOrder($orderId);
            return response()->json(null, 204);
        } catch (\Exception $e) {
            \Log::error('Failed to delete order', ['orderId' => $orderId, 'error' => $e->getMessage()]);
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }
}