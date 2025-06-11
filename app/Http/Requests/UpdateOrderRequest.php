<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['sometimes', 'exists:users,id'],
            'items' => ['sometimes', 'array'],
            'items.*.product_id' => ['required_with:items', 'exists:items,_id'],
            'items.*.quantity' => ['required_with:items', 'integer', 'min:1'],
            'items.*.attributes' => ['nullable', 'array'],
            'total_amount' => ['sometimes', 'numeric', 'min:0'],
            'status' => ['sometimes', Rule::in(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])],
            'phone' => ['sometimes', 'string', 'regex:/^[\+]?[0-9\s\-\(\)]{10,}$/'],
            'delivery_type' => ['sometimes', Rule::in(['pickup', 'delivery'])],
            'address' => ['required_if:delivery_type,delivery', 'nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.exists' => 'The user with the specified ID was not found.',
            'items.*.product_id.exists' => 'The product with the specified ID was not found.',
            'items.*.quantity.min' => 'The quantity must be at least 1.',
            'status.in' => 'Invalid order status.',
            'phone.regex' => 'Invalid phone number format.',
            'delivery_type.in' => 'Invalid delivery type.',
            'address.required_if' => 'The address is required when the delivery type is "delivery".',
        ];
    }
}