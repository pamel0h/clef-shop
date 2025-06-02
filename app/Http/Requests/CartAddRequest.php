<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CartAddRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->check(); // Только аутентифицированные пользователи
    }

    public function rules()
    {
        return [
            'product_id' => 'required|exists:items,_id',
            'quantity' => 'required|integer|min:1',
        ];
    }
}