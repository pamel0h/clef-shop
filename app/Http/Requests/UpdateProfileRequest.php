<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->check();
    }

    public function rules()
    {
        return [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,',
            'phone' => 'sometimes|string|nullable|max:20',
            'address' => 'sometimes|string|nullable|max:255',
            'password' => 'sometimes|string|min:8',
        ];
    }
}