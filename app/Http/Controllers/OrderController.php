<?php


namespace App\Http\Controllers;

use App\Http\Requests\CreateOrderRequest;
use App\Services\OrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function getAllOrders(Request $request)
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

    public function getOrder(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            $orders = $this->orderService->getOrders($user);
            return response()->json($orders);
        } catch (\Exception $e) {
            \Log::error('Failed to get orders', ['user_id' => $user->id, 'error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    public function createOrder(CreateOrderRequest $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            $order = $this->orderService->createOrder($user, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'order' => [
                    'id' => $order->_id,
                    'items' => $this->orderService->formatOrderItems($order->items),
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'phone' => $order->phone,
                    'delivery_type' => $order->delivery_type,
                    'address' => $order->address,
                    'created_at' => $order->created_at,
                    'updated_at' => $order->updated_at,
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to create order', ['user_id' => $user->id, 'error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }
}
