<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Item;
use App\Services\ProductService;
use App\Formatters\ProductFormatter;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;

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

    public function export()
    {
        // Имя файла для скачивания
        $filename = 'catalog_export_' . date('Y-m-d_H-i-s') . '.csv';

        // Заголовки ответа
        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ];

        // Потоковая генерация CSV
        return Response::stream(function () {
            // Открываем поток вывода
            $handle = fopen('php://output', 'w');

            // Добавляем UTF-8 BOM для корректной кодировки
            fwrite($handle, "\xEF\xBB\xBF");

            // Заголовки CSV
            $columns = [
                'id',
                'name',
                'description',
                'price',
                'category',
                'subcategory',
                'brand',
                'images',
                'specs',
                'discount',
                'created_at',
                'updated_at',
            ];
            fputcsv($handle, $columns);

            // Получаем все товары
            $items = Item::all();

            // Записываем данные для каждого товара
            foreach ($items as $item) {
                $row = [
                    (string) $item->_id, // MongoDB ObjectId как строка
                    $item->name ?? '',
                    json_encode($item->description ?? [], JSON_UNESCAPED_UNICODE), // Сохраняем кириллицу как есть
                    $item->price ?? 0,
                    $item->category ?? '',
                    $item->subcategory ?? '',
                    $item->brand ?? '',
                    !empty($item->images) ? implode(',', $item->images) : '', // Массив images в строку
                    json_encode($item->specs ?? [], JSON_UNESCAPED_UNICODE), // Сохраняем кириллицу как есть
                    $item->discount ?? 0,
                    $item->created_at ? $item->created_at->toIso8601String() : '',
                    $item->updated_at ? $item->updated_at->toIso8601String() : '',
                ];
                fputcsv($handle, $row);
            }

            // Закрываем поток
            fclose($handle);
        }, 200, $headers);
    }

}