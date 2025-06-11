<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->check();
    }

    public function rules()
    {
        $id = $this->route('id');

        return [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'phone' => [
                'sometimes',
                'nullable',
                'string',
                'min:10',
                'max:20',
                'unique:users,phone,' . $id,
                'regex:/^\+[0-9]+$/',
            ],
            'address' => 'sometimes|string|nullable|max:255',
            'password' => 'sometimes|string|min:8',
            'role' => [
                'sometimes',
                'string',
                'max:25',
                // Запрещаем изменение роли для текущего пользователя
                Rule::prohibitedIf((string) auth()->id() === (string) $id),
            ],
        ];

        return $rules;
    }

    public function messages()
    {
        return [
            'name.string' => 'Name must be a valid string.',
            'name.max' => 'Name cannot exceed 255 characters.',
            'email.string' => 'Email must be a valid string.',
            'email.email' => 'Email must be a valid email address.',
            'email.max' => 'Email cannot exceed 255 characters.',
            'email.unique' => 'This email is already taken.',
            'phone.string' => 'Phone must be a valid string.',
            'phone.max' => 'Phone cannot exceed 20 characters.',
            'phone.min' => 'Phone number must be at least 10 characters.',
            'phone.unique' => 'This phone number is already taken.',
            'phone.regex' => 'Phone number must start with "+" followed by digits only.',
            'address.string' => 'Address must be a valid string.',
            'address.max' => 'Address cannot exceed 255 characters.',
            'password.string' => 'Password must be a valid string.',
            'password.min' => 'Password must be at least 8 characters.',
            'role.string' => 'Role must be a valid string.',
            'role.max' => 'Role cannot exceed 25 characters.',
            'role.prohibited' => 'You cannot change your own role.'
        ];
    }
}