<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->check(); // Только аутентифицированные пользователи
    }

    public function rules()
    {
        return [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:items,_id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.attributes' => 'nullable|array',
            'phone' => 'required|string|min:5',
            'delivery_type' => 'required|in:pickup,delivery',
            'address' => 'required_if:delivery_type,delivery|string|min:5',
        ];
    }
}
