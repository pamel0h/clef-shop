<?php
namespace App\Http\Controllers;

use App\Services\CatalogService;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class CatalogController extends Controller
{
    public function __construct(
        private CatalogService $catalogService
    ) {}

    public function fetchData(Request $request)
    {
        try {
            Log::info('Запрос fetchData:', $request->all());
    
            $data = match($request->type) {
                'categories' => $this->catalogService->getAllCategories(),
                'subcategories' => $request->category
                ? $this->catalogService->getSubcategories($request->category)
                : [], // Возвращаем пустой массив, если category не указан
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
            $latestItem = Item::orderBy('updated_at', 'desc')->first();
            $lastUpdated = $latestItem ? $latestItem->updated_at->toIso8601String() : null;
            // Получаем время последнего обновления переводов из кэша
            $translationsLastUpdated = Cache::get('translations_last_updated', now()->toIso8601String());

            return response()->json([
                'success' => true,
                'last_updated' => $lastUpdated,
                'translations_last_updated' => $translationsLastUpdated
            ]);
        } catch (\Exception $e) {
            Log::error('CatalogController: Ошибка получения времени обновления', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}