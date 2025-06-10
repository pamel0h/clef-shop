<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{

    public function uploadImage(Request $request): JsonResponse
    {
        // Проверяем права администратора
        if (!$request->user() || !$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // максимум 5MB
            'folder' => 'sometimes|string|max:50'
        ]);

        try {
            $image = $request->file('image');
            $folder = $request->input('folder', 'pages');
            
            // Генерируем уникальное имя файла
            $fileName = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            
            // Определяем путь для сохранения
            $path = "images/{$folder}";
            
            // Сохраняем файл в public диск
            $savedPath = $image->storeAs($path, $fileName, 'public');
            
            // Возвращаем путь, доступный для браузера
            $publicPath = '/storage/' . $savedPath;

            return response()->json([
                'success' => true,
                'path' => $publicPath,
                'filename' => $fileName,
                'size' => $image->getSize(),
                'mime_type' => $image->getMimeType()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка загрузки файла: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteImage(Request $request): JsonResponse
    {
        // Проверяем права администратора
        if (!$request->user() || !$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'path' => 'required|string'
        ]);

        try {
            $path = $request->input('path');
            
            // Убираем /storage/ из пути для работы с Storage
            $storagePath = str_replace('/storage/', '', $path);
            
            if (Storage::disk('public')->exists($storagePath)) {
                Storage::disk('public')->delete($storagePath);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Файл успешно удален'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Файл не найден'
                ], 404);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка удаления файла: ' . $e->getMessage()
            ], 500);
        }
    }


    public function getImages(Request $request): JsonResponse
    {
        // Проверяем права администратора
        if (!$request->user() || !$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $folder = $request->query('folder', 'pages');
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
            
            return response()->json([
                'success' => true,
                'images' => $images
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка получения списка файлов: ' . $e->getMessage()
            ], 500);
        }
    }
}