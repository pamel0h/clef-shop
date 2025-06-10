<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUpdateProductRequest;
// use App\Http\Requests\StoreUpdateProductRequest;
use App\Models\Item;
use App\Services\ProductService;
use App\Formatters\ProductFormatter;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use Illuminate\Http\Request;
use App\Services\CatalogExportImportService;

class AdminCatalogController extends Controller
{
    private $productService;
    private $productFormatter;
    private $catalogExportService;

    public function __construct(ProductService $productService, ProductFormatter $productFormatter, CatalogExportImportService $catalogExportService)
    {
        $this->productService = $productService;
        $this->productFormatter = $productFormatter;
        $this->catalogExportService = $catalogExportService;
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

    public function store(StoreUpdateProductRequest $request)
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

    public function update(StoreUpdateProductRequest $request, $id)
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
        return $this->catalogExportService->exportCatalog();
    }

    public function import(Request $request)
    {
        Log::info('AdminCatalogController: Импорт запрос получен', [
            'hasFile' => $request->hasFile('csv'),
            'files' => $request->allFiles(),
            'content_type' => $request->header('Content-Type'),
        ]);

        try {
            // Валидируем файл
            if (!$request->hasFile('csv')) {
                Log::warning('AdminCatalogController: CSV файл не предоставлен');
                return response()->json([
                    'success' => false,
                    'error' => 'CSV файл не предоставлен',
                ], 400);
            }

            $csvFile = $request->file('csv');

            if (!$csvFile->isValid()) {
                Log::warning('AdminCatalogController: Неверный файл', [
                    'error' => $csvFile->getError(),
                    'errorMessage' => $csvFile->getErrorMessage()
                ]);
                return response()->json([
                    'success' => false,
                    'error' => 'Неверный файл: ' . $csvFile->getErrorMessage(),
                ], 400);
            }

            $allowedMimeTypes = ['text/csv', 'text/plain', 'application/csv'];
            $fileExtension = strtolower($csvFile->getClientOriginalExtension());
            $mimeType = $csvFile->getMimeType();

            if ($fileExtension !== 'csv' && !in_array($mimeType, $allowedMimeTypes)) {
                Log::warning('AdminCatalogController: Неверный формат файла', [
                    'extension' => $fileExtension,
                    'mimeType' => $mimeType,
                    'originalName' => $csvFile->getClientOriginalName()
                ]);
                return response()->json([
                    'success' => false,
                    'error' => 'Неверный формат файла. Ожидается CSV.',
                ], 400);
            }

            Log::info('AdminCatalogController: Запуск импорта CSV', [
                'file' => $csvFile->getClientOriginalName(),
                'size' => $csvFile->getSize(),
                'mimeType' => $mimeType,
                'extension' => $fileExtension
            ]);

            $result = $this->catalogExportService->importCatalog($csvFile);

            Log::info('AdminCatalogController: Результат импорта', $result);

            return response()->json($result, $result['success'] ? 200 : 500);

        } catch (\Exception $e) {
            Log::error('AdminCatalogController: Ошибка импорта каталога', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'imported' => 0,
                'errors' => [],
            ], 500);
        }
    }
}