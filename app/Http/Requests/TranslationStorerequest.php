<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TranslationStoreRequest extends FormRequest
{

    public function authorize()
    {
        return true; 
    }

    public function rules()
    {
        return [
            'namespace' => ['required', 'string', Rule::in(['specs', 'categories', 'subcategories'])],
            'key' => 'required|string',
            'ru' => 'required|string',
            'en' => 'required|string',
        ];
    }


    public function messages()
    {
        return [
            'namespace.in' => 'The namespace must be one of: specs, categories, subcategories.',
        ];
    }
}