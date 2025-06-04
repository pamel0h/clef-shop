<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize()
    {
        return true; 
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'description_en' => 'nullable|string',
            'description_ru' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string',
            'subcategory' => 'required|string',
            'brand' => 'required|string',
            'discount' => 'nullable|numeric|min:0|max:100',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'specs' => 'nullable|array',
            'specs.*.key' => 'required_with:specs|string',
            'specs.*.value' => 'required_with:specs|string',
        ];
    }
}