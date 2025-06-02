<?php

namespace App\Http\Controllers;

use App\Http\Requests\CartAddRequest;
use App\Http\Requests\CartUpdateRequest;
use App\Http\Requests\CartSyncRequest;
use App\Services\CartService;
use Illuminate\Http\Request;

class CartController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $cartItems = $this->cartService->getCart($user);

        return response()->json($cartItems);
    }

    public function add(CartAddRequest $request)
    {
        $user = $request->user();
        try {
            $cart = $this->cartService->addItem($user, $request->validated());

            return response()->json([
                'message' => 'Item added to cart',
                'cart' => $this->cartService->formatCartItems($cart->items),
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 422);
        }
    }

    public function update(CartUpdateRequest $request)
    {
        $user = $request->user();
        try {
            $cart = $this->cartService->updateItem($user, $request->validated());

            return response()->json([
                'message' => 'Cart updated successfully',
                'cart' => $this->cartService->formatCartItems($cart->items),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 422);
        }
    }

    public function removeItem(Request $request, $productId)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        try {
            $cart = $this->cartService->removeItem($user, $productId);

            return response()->json([
                'message' => 'Item removed from cart',
                'cart' => $this->cartService->formatCartItems($cart->items),
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 404);
        }
    }

    public function clear(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        try {
            $this->cartService->clearCart($user);

            return response()->json(['message' => 'Cart cleared']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 422);
        }
    }

    public function sync(CartSyncRequest $request)
    {
        $user = $request->user();
        try {
            $cart = $this->cartService->syncCart($user, $request->validated()['items']);

            return response()->json([
                'message' => 'Cart synchronized successfully',
                'cart' => $this->cartService->formatCartItems($cart->items),
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 422);
        }
    }
}
