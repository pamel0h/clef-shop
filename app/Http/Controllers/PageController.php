<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PageController extends Controller
{
    /**
     * Получить содержимое страницы
     */
    public function show(string $pageId): JsonResponse
    {
        $page = Page::where('pageId', $pageId)->first();
        
        if (!$page) {
            return response()->json([
                'success' => false,
                'message' => 'Page not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $page
        ]);
    }

    /**
     * Обновить содержимое страницы (только для администраторов)
     */
    public function update(Request $request, string $pageId): JsonResponse
    {
        // Проверяем права администратора
        if (!$request->user() || !$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'content' => 'required|array',
            'content.*' => 'array', // каждый язык - это массив
        ]);

        // Находим или создаем страницу
        $page = Page::updateOrCreate(
            ['pageId' => $pageId],
            ['content' => $request->input('content')]
        );

        return response()->json([
            'success' => true,
            'message' => 'Page updated successfully',
            'data' => $page
        ]);
    }

    /**
     * Получить список всех страниц (только для администраторов)
     */
    public function index(Request $request): JsonResponse
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $pages = Page::all();

        return response()->json([
            'success' => true,
            'data' => $pages
        ]);
    }
}