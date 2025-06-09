<?php

namespace App\Http\Requests;

use App\Rules\RequiredFieldsGroup;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
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
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'specs_data' => 'nullable|string',
            'is_new_category' => 'nullable|boolean',
            'is_new_subcategory' => 'nullable|boolean',
            'new_category' => [
                // Проверяем new_category как группу, если is_new_category = 1
                Rule::requiredIf(function () {
                    return $this->input('is_new_category') == 1;
                }),
                new RequiredFieldsGroup(
                    ['slug', 'ru', 'en'],
                    'Все поля новой категории (slug, русский, английский) должны быть заполнены.'
                ),
            ],
            'new_subcategory' => [
                Rule::requiredIf(function () {
                    return $this->input('is_new_subcategory') == 1;
                }),
                new RequiredFieldsGroup(
                    ['slug', 'ru', 'en'],
                    'Все поля новой подкатегории (slug, русский, английский) должны быть заполнены.'
                ),
            ],
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
                    return $this->input("specs.$index.key") || $this->input("specs.$index.newSpec.slug");
                }),
                'string',
            ],
            'specs.*.newSpec' => [
                Rule::requiredIf(function () {
                    $index = $this->getValidationIndex('specs.*.newSpec');
                    return $this->input("specs.$index.isNewSpec");
                }),
                new RequiredFieldsGroup(
                    ['slug', 'ru', 'en'],
                    'Все поля новой характеристики (slug, русский, английский, значение) должны быть заполнены.'
                ),
            ],
        ];
    }

    public function messages()
    {
        return [
            'category.required' => 'Категория должна быть выбрана, если не создается новая категория.',
            'subcategory.required' => 'Подкатегория должна быть выбрана, если не создается новая подкатегория.',
            'specs.*.key.required' => 'Ключ характеристики обязателен, если не создается новая характеристика.',
            'specs.*.value.required' => 'Значение характеристики обязательно, если указан ключ или новая характеристика.',
        ];
    }

    protected function getValidationIndex($field)
    {
        preg_match('/specs\.(\d+)\./', $field, $matches);
        return $matches[1] ?? 0;
    }
}