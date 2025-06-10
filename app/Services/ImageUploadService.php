<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadService
{
    public function uploadImage(UploadedFile $image, string $folder = 'pages'): array
    {
        $fileName = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
        $path = "images/{$folder}";
        $savedPath = $image->storeAs($path, $fileName, 'public');
        $publicPath = '/storage/' . $savedPath;

        return [
            'path' => $publicPath,
            'filename' => $fileName,
            'size' => $image->getSize(),
            'mime_type' => $image->getMimeType()
        ];
    }

    public function deleteImage(string $path): bool
    {
        $storagePath = str_replace('/storage/', '', $path);
        
        if (Storage::disk('public')->exists($storagePath)) {
            return Storage::disk('public')->delete($storagePath);
        }
        
        return false;
    }

    public function getImages(string $folder = 'pages'): array
    {
        $path = "images/{$folder}";
        $files = Storage::disk('public')->files($path);
        $images = [];
        
        foreach ($files as $file) {
            $images[] = [
                'path' => '/storage/' . $file,
                'name' => basename($file),
                'size' => Storage::disk('public')->size($file),
                'modified' => Storage::disk('public')->lastModified($file)
            ];
        }
        
        return $images;
    }
}