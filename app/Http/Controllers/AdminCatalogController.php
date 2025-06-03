<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Item;
use App\Services\ProductService;
use App\Formatters\ProductFormatter;
use Illuminate\Support\Facades\Log;

class AdminCatalogController extends Controller
{
    private $productService;
    private $productFormatter;

    public function __construct(ProductService $productService, ProductFormatter $productFormatter)
    {
        $this->productService = $productService;
        $this->productFormatter = $productFormatter;
    }

    public function fetchData()
    {
        try {
            Log::info('AdminCatalogController: Fetching all products');
            $items = Item::orderBy('name')->get()->map(function ($item) {
                return $this->productFormatter->formatProduct($item);
            });

            return response()->json([
                'success' => true,
                'data' => $items->toArray()
            ]);
        } catch (\Exception $e) {
            Log::error('AdminCatalogController: Error fetching products', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(StoreProductRequest $request)
    {
        try {
            $validated = $request->validated();
            $result = $this->productService->storeProduct($validated, $request, $this->productFormatter);
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(UpdateProductRequest $request, $id)
    {
        try {
            $validated = $request->validated();
            $result = $this->productService->updateProduct($id, $validated, $request, $this->productFormatter);
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $result = $this->productService->deleteProduct($id);
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getSpecKeysAndValues()
    {
        try {
            $result = $this->productService->getSpecKeysAndValues();
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getBrands()
    {
        try {
            $brands = Item::getAllBrands();
            return response()->json([
                'success' => true,
                'data' => $brands
            ]);
        } catch (\Exception $e) {
            Log::error('AdminCatalogController: Error fetching brands', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}