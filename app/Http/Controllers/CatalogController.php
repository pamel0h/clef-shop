<?php

namespace App\Http\Controllers;

use App\Services\CatalogService;
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
            Log::info('FetchData request:', $request->all());
    
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
            Log::error('Catalog error:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

}