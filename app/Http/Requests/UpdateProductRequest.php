<?php

namespace App\Http\Requests;

use App\Rules\RequiredFieldsGroup;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'category' => [
                Rule::requiredIf(function () {
                    return !$this->input('is_new_category');
                }),
                'nullable',
                'string',
            ],
            'subcategory' => [
                Rule::requiredIf(function () {
                    return !$this->input('is_new_subcategory');
                }),
                'nullable',
                'string',
            ],
            'brand' => 'required|string',
            'discount' => 'nullable|numeric|min:0|max:100',
            'description_en' => 'nullable|string',
            'description_ru' => 'nullable|string',
            'images' => 'nullable|array|max:1',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_new_category' => 'nullable|boolean',
            'is_new_subcategory' => 'nullable|boolean',
            'new_category' => [
                Rule::requiredIf(function () {
                    return $this->input('is_new_category') == 1;
                }),
                new RequiredFieldsGroup(
                    ['slug', 'ru', 'en'],
                    'Все поля новой категории (slug, русский, английский) должны быть заполнены.',
                    false // Не разрешаем пустые поля
                ),
            ],
            'new_subcategory' => [
                Rule::requiredIf(function () {
                    return $this->input('is_new_subcategory') == 1;
                }),
                new RequiredFieldsGroup(
                    ['slug', 'ru', 'en'],
                    'Все поля новой подкатегории (slug, русский, английский) должны быть заполнены.',
                    false // Не разрешаем пустые поля
                ),
            ],
            'specs' => 'nullable|array',
            'specs.*.key' => [
                Rule::requiredIf(function () {
                    $index = $this->getValidationIndex('specs.*.key');
                    return !$this->input("specs.$index.isNewSpec");
                }),
                'string',
            ],
            'specs.*.value' => [
                Rule::requiredIf(function () {
                    $index = $this->getValidationIndex('specs.*.value');
                    return !$this->input("specs.$index.isNewSpec");
                }),
                'string',
            ],
            'specs.*.isNewSpec' => 'nullable|boolean',
            'specs.*.newSpec' => [
                Rule::requiredIf(function () {
                    $index = $this->getValidationIndex('specs.*.newSpec');
                    return $this->input("specs.$index.isNewSpec") == 1;
                }),
                new RequiredFieldsGroup(
                    ['slug', 'ru', 'en', 'value'],
                    'Все поля новой характеристики (slug, русский, английский, значение) должны быть заполнены.',
                    false // Не разрешаем пустые поля
                ),
            ],
            'specs_data' => 'nullable|json',
        ];
    }

    public function messages()
    {
        return [
            'category.required' => 'The category field must be selected.',
            'subcategory.required' => 'The subcategory field must be selected.',
            'new_category.required' => 'Все поля новой категории (slug, русский, английский) должны быть заполнены.',
            'new_subcategory.required' => 'Все поля новой подкатегории (slug, русский, английский) должны быть заполнены.',
            'specs.*.key.required' => 'Ключ характеристики обязателен, если не создается новая характеристика.',
            'specs.*.value.required' => 'Значение характеристики обязательно, если не создается новая характеристика.',
            'specs.*.newSpec.required' => 'Все поля новой характеристики (slug, русский, английский, значение) должны быть заполнены.',
        ];
    }

    protected function getValidationIndex($field)
    {
        preg_match('/specs\.(\d+)\./', $field, $matches);
        return $matches[1] ?? 0;
    }
}