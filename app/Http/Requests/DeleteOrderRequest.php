<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DeleteOrderRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'orderId' => ['required', Rule::exists('orders', '_id')],
        ];
    }

    protected function prepareForValidation()
    {
        // Добавляем параметр маршрута 'orderId' в данные для валидации
        $this->merge([
            'orderId' => $this->route('orderId'),
        ]);
    }

    public function messages(): array
    {
        return [
            'orderId.required' => 'Order ID is required.',
            'orderId.exists' => 'Order with ID was not found.',
        ];
    }
}