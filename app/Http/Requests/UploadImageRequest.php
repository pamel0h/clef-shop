<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'folder' => 'sometimes|string|max:50'
        ];
    }
}

class DeleteImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'path' => 'required|string'
        ];
    }
}

class GetImagesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [];
    }
}