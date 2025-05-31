<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Formatters\ProductFormatter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdminCatalogController extends Controller
{
    public function __construct(
        private ProductFormatter $productFormatter
    ) {}

    // Получение всех товаров для таблицы администратора
    public function fetchData(Request $request)
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

    // Создание нового товара
    public function store(Request $request)
    {
   
    }

    // Обновление товара
    public function update(Request $request, $id)
    {
   
    }

    // Удаление товара
    public function destroy($id)
    {
   
    }
}