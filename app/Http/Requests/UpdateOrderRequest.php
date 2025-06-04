<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Авторизация будет проверяться в контроллере или middleware
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
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

    /**
     * Get custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'user_id.exists' => 'Пользователь с указанным ID не найден.',
            'items.*.product_id.exists' => 'Товар с указанным ID не найден.',
            'items.*.quantity.min' => 'Количество должно быть не менее 1.',
            'status.in' => 'Недопустимый статус заказа.',
            'phone.regex' => 'Недопустимый формат номера телефона.',
            'delivery_type.in' => 'Недопустимый тип доставки.',
            'address.required_if' => 'Адрес обязателен при типе доставки "delivery".',
        ];
    }
}