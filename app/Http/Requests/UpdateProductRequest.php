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
            'price' => 'required|numeric|min:0',
            'category' => 'required|string',
            'subcategory' => 'required|string',
            'brand' => 'required|string',
            'discount' => 'nullable|numeric|min:0|max:100',
            'description_en' => 'nullable|string',
            'description_ru' => 'nullable|string',
            'images' => 'nullable|array|max:1',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'new_category' => 'nullable|array', 
            'new_category.slug' => 'required_if:is_new_category,1|string|min:1',
            'new_category.ru' => 'required_if:is_new_category,1|string|min:1',
            'new_category.en' => 'required_if:is_new_category,1|string|min:1',
            'new_subcategory' => 'nullable|array', 
            'new_subcategory.slug' => 'required_if:is_new_subcategory,1|string|min:1',
            'new_subcategory.ru' => 'required_if:is_new_subcategory,1|string|min:1',
            'new_subcategory.en' => 'required_if:is_new_subcategory,1|string|min:1',
            'specs' => 'nullable|array',
            'specs.*.key' => 'required_with:specs|string',
            'specs.*.value' => 'required_with:specs|string',
            'specs_data' => 'nullable|json',
            'is_new_category' => 'nullable|boolean',
            'is_new_subcategory' => 'nullable|boolean',
        ];
    }

    public function messages()
    {
        return [
            'new_category.slug.required_if' => 'The new category slug is required when creating a new category.',
            'new_category.ru.required_if' => 'The new category Russian translation is required when creating a new category.',
            'new_category.en.required_if' => 'The new category English translation is required when creating a new category.',
            'new_subcategory.slug.required_if' => 'The new subcategory slug is required when creating a new subcategory.',
            'new_subcategory.ru.required_if' => 'The new subcategory Russian translation is required when creating a new subcategory.',
            'new_subcategory.en.required_if' => 'The new subcategory English translation is required when creating a new subcategory.',
        ];
    }
}