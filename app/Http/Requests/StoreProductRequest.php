<?php

namespace App\Http\Requests;

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
            // 'new_category.slug' => 'required_if:is_new_category,1|string',
            // 'new_category.ru' => 'required_if:is_new_category,1|string',
            // 'new_category.en' => 'required_if:is_new_category,1|string',
            'new_subcategory' => [
                'required_if:is_new_subcategory,1',
                'array',
                'nullable',
            ],
            // 'new_subcategory.slug' => 'required_if:is_new_subcategory,1|string',
            // 'new_subcategory.ru' => 'required_if:is_new_subcategory,1|string',
            // 'new_subcategory.en' => 'required_if:is_new_subcategory,1|string',
            
            
            
            // 'specs' => 'nullable|array',
            // 'specs.*.isNewSpec' => 'nullable|boolean',
            // 'specs.*.key' => [
            //     'required_if:specs.*.isNewSpec,0', // Обязательно, если isNewSpec = false
            //     'string',
            //     'nullable',
            // ],
            // 'specs.*.value' => [
            //     'required_if:specs.*.isNewSpec,0', // Обязательно, если isNewSpec = false
            //     'string',
            //     'nullable',
            // ],
            // 'specs.*.newSpec' => [
            //     'required_if:specs.*.isNewSpec,1', // Обязательно, если isNewSpec = true
            //     'array',
            //     'nullable',
            // ],
            // 'specs.*.newSpec.slug' => 'required_if:specs.*.isNewSpec,1|string',
            // 'specs.*.newSpec.ru' => 'required_if:specs.*.isNewSpec,1|string',
            // 'specs.*.newSpec.en' => 'required_if:specs.*.isNewSpec,1|string',
            // 'specs.*.newSpec.value' => 'required_if:specs.*.isNewSpec,1|string',
        
        
        'specs' => 'nullable|array',
            'specs.*.isNewSpec' => 'nullable|boolean',
            'specs.*.key' => 'nullable|string',  // Убрали условную обязательность здесь
            'specs.*.value' => 'nullable|string', // Убрали условную обязательность здесь
            'specs.*.newSpec' => [
                'nullable',
                'array',
            ],
            'specs.*.newSpec.slug' => 'nullable|string', // Убрали условную обязательность здесь
            'specs.*.newSpec.ru' => 'nullable|string', // Убрали условную обязательность здесь
            'specs.*.newSpec.en' => 'nullable|string', // Убрали условную обязательность здесь
            'specs.*.newSpec.value' => 'nullable|string', // Убрали условную обязательность здесь
        
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
                            $validator->errors()->add("specs.{$key}", 'Заполните все поля характеристики.');
                        }
                    } elseif (isset($spec['isNewSpec']) && $spec['isNewSpec'] == 1) {
                        // Валидация для новых характеристик
                        if (empty($spec['newSpec']['slug']) || empty($spec['newSpec']['ru']) || empty($spec['newSpec']['en']) || empty($spec['newSpec']['value'])) {
                            $validator->errors()->add("specs.{$key}", 'Заполните все поля для новой характеристики.');
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
             'new_category.required_if' => 'Заполните все поля новой категории.',
            'new_subcategory.required_if' => 'Заполните все поля новой подкатегории.',
           'specs.*.key.required_if' => 'Ключ характеристики обязателен, если не создается новая характеристика.', //Удалено
            'specs.*.value.required_if' => 'Значение характеристики обязательно, если не создается новая характеристика.', //Удалено
            'specs.*.newSpec.required_if' => 'Заполните все поля новой характеристики.', //Удалено
            'specs.*.required' => 'Заполните все поля характеристики.',
        ];
    }
}