<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadImageRequest;
use App\Http\Requests\DeleteImageRequest;
use App\Http\Requests\GetImagesRequest;
use App\Services\ImageUploadService;
use Illuminate\Http\JsonResponse;

class ImageUploadController extends Controller
{
    public function __construct(
        private ImageUploadService $imageService
    ) {}

    public function uploadImage(UploadImageRequest $request): JsonResponse
    {
        try {
            $result = $this->imageService->uploadImage(
                $request->file('image'),
                $request->input('folder', 'pages')
            );

            return response()->json([
                'success' => true,
                ...$result
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка загрузки файла: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteImage(DeleteImageRequest $request): JsonResponse
    {
        try {
            $deleted = $this->imageService->deleteImage($request->input('path'));
            
            if ($deleted) {
                return response()->json([
                    'success' => true,
                    'message' => 'Файл успешно удален'
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Файл не найден'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка удаления файла: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getImages(GetImagesRequest $request): JsonResponse
    {
        try {
            $images = $this->imageService->getImages(
                $request->query('folder', 'pages')
            );
            
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