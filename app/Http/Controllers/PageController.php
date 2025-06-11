<?php

namespace App\Http\Controllers;

use App\Services\PageService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PageController extends Controller
{
    public function __construct(private PageService $pageService)
    {
    }

    public function show(string $pageId): JsonResponse
    {
        try {
            $response = $this->pageService->getPage($pageId);
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function update(Request $request, string $pageId): JsonResponse
    {
        try {
            $response = $this->pageService->updatePage($request, $pageId);
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $response = $this->pageService->getAllPages($request);
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }
}