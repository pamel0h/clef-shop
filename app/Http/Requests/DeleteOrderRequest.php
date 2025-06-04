<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DeleteOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'orderId' => ['required', Rule::exists('orders', '_id')],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        // Добавляем параметр маршрута 'orderId' в данные для валидации
        $this->merge([
            'orderId' => $this->route('orderId'),
        ]);
    }

    /**
     * Get custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'orderId.required' => 'ID заказа обязателен.',
            'orderId.exists' => 'Заказ с указанным ID не найден.',
        ];
    }
}