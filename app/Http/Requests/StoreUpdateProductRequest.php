<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUpdateProductRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $id = $this->route('id'); // Получаем ID из маршрута
        return [
            // 'name' => 'required|string|max:255|unique:items',
            'name' => [
            'required',
            'string',
            'max:255',
            Rule::unique('items')->ignore($id), // Игнорируем текущий товар при обновлении
        ],
            'description_en' => 'nullable|string',
            'description_ru' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category' => 'required_unless:is_new_category,1|string|nullable',
            'subcategory' => 'required_unless:is_new_subcategory,1|string|nullable',
            'brand' => 'required|string',
            'discount' => 'nullable|numeric|min:0|max:100',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_new_category' => 'nullable|boolean',
            'is_new_subcategory' => 'nullable|boolean',
            'new_category' => [
                'required_if:is_new_category,1',
                'array',
                'nullable',
            ],

            'new_subcategory' => [
                'required_if:is_new_subcategory,1',
                'array',
                'nullable',
            ],

        'specs' => 'nullable|array',
            'specs.*.isNewSpec' => 'nullable|boolean',
            'specs.*.key' => 'nullable|string',  
            'specs.*.value' => 'nullable|string', 
            'specs.*.newSpec' => [
                'nullable',
                'array',
            ],
            'specs.*.newSpec.slug' => 'nullable|string',
            'specs.*.newSpec.ru' => 'nullable|string',
            'specs.*.newSpec.en' => 'nullable|string', 
            'specs.*.newSpec.value' => 'nullable|string', 
        
        ];
    }

protected function withValidator($validator)
{
    $validator->after(function ($validator) {
        if ($this->input('specs')) {
            foreach ($this->input('specs') as $key => $spec) {
                if (isset($spec['isNewSpec']) && $spec['isNewSpec'] == 0) {
                    // Валидация для существующих характеристик
                    if (empty($spec['key']) || empty($spec['value'])) {
                        $validator->errors()->add("Specification " . ($key + 1), 'Please fill in all specification fields.');
                    }
                } elseif (isset($spec['isNewSpec']) && $spec['isNewSpec'] == 1) {
                    // Валидация для новых характеристик
                    if (empty($spec['newSpec']['slug']) || empty($spec['newSpec']['ru']) || empty($spec['newSpec']['en']) || empty($spec['newSpec']['value'])) {
                        $validator->errors()->add("Specification " . ($key + 1), 'Please fill in all fields for the new specification.');
                    }
                }
            }
        }
    });
}

    public function messages()
    {
        return [
            'category.required_unless' => 'The category field is not selected.',
            'subcategory.required_unless' => 'The subcategory field is not selected.',
            'new_category.required_if' => 'Please fill in all fields for the new category.',
            'new_subcategory.required_if' => 'Please fill in all fields for the new subcategory.',
        ];
    }
}