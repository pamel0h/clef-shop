<?php

namespace App\Http\Controllers;

use App\Services\CatalogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class CatalogController extends Controller
{
    public function __construct(private CatalogService $catalogService)
    {
    }

    public function fetchData(Request $request)
    {
        try {
            Log::info('Запрос fetchData:', $request->all());

            $data = match ($request->type) {
                'categories' => $this->catalogService->getAllCategories(),
                'subcategories' => $request->category
                    ? $this->catalogService->getSubcategories($request->category)
                    : [],
                'products' => $this->catalogService->getProducts($request->category, $request->subcategory),
                'product_details' => $this->catalogService->getProductDetails(
                    $request->id,
                    $request->category,
                    $request->subcategory
                ),
                default => []
            };

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            Log::error('Ошибка каталога:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function lastUpdated(Request $request)
    {
        try {
            $response = $this->catalogService->getLastUpdated();
            return response()->json([
                'success' => true,
                'last_updated' => $response['last_updated'],
                'translations_last_updated' => $response['translations_last_updated']
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}