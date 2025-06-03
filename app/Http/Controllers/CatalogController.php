<?php
namespace App\Http\Controllers;

use App\Services\CatalogService;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
                'subcategories' => $this->catalogService->getSubcategories($request->category),
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

    // public function lastUpdated(Request $request)
    // {
    //     try {
    //         $latestItem = Item::orderBy('updated_at', 'desc')->first();
    //         $lastUpdated = $latestItem ? $latestItem->updated_at->toIso8601String() : null;

    //         Log::info('CatalogController: Время последнего обновления', ['last_updated' => $lastUpdated]);

    //         return response()->json([
    //             'success' => true,
    //             'last_updated' => $lastUpdated
    //         ]);
    //     } catch (\Exception $e) {
    //         Log::error('CatalogController: Ошибка получения времени обновления', ['error' => $e->getMessage()]);
    //         return response()->json([
    //             'success' => false,
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }
}