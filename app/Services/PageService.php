<?php

namespace App\Services;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PageService
{
    public function getPage(string $pageId): array
    {
        $page = Page::where('pageId', $pageId)->first();

        if (!$page) {
            throw new \Exception('Page not found', 404);
        }

        return [
            'success' => true,
            'data' => $page
        ];
    }

    public function updatePage(Request $request, string $pageId): array
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            throw new \Exception('Unauthorized', 403);
        }

        $request->validate([
            'content' => 'required|array',
            'content.*' => 'array',
        ]);

        $page = Page::updateOrCreate(
            ['pageId' => $pageId],
            ['content' => $request->input('content')]
        );

        return [
            'success' => true,
            'message' => 'Page updated successfully',
            'data' => $page
        ];
    }

    public function getAllPages(Request $request): array
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            throw new \Exception('Unauthorized', 403);
        }

        $pages = Page::all();

        return [
            'success' => true,
            'data' => $pages
        ];
    }
}