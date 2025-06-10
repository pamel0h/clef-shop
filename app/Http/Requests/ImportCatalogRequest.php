<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImportCatalogRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'csv' => [
                'required',
                'file',
                'mimes:csv,txt',
                'mimetypes:text/csv,text/plain,application/csv',
                'max:10240' // 10MB
            ]
        ];
    }

    public function messages()
    {
        return [
            'csv.required' => 'CSV файл не предоставлен',
            'csv.file' => 'Неверный файл',
            'csv.mimes' => 'Неверный формат файла. Ожидается CSV.',
            'csv.max' => 'Файл слишком большой (максимум 10MB)',
        ];
    }
}