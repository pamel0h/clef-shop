<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Item;
use App\Services\ProductService;
use App\Formatters\ProductFormatter;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use App\Services\CatalogExportService;

class AdminCatalogController extends Controller
{
    private $productService;
    private $productFormatter;
    private $catalogExportService;

    public function __construct(ProductService $productService, ProductFormatter $productFormatter, CatalogExportService $catalogExportService)
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
        return $this->catalogExportService->exportCatalog();
    }

    // public function import(Request $request)
    // {
    //     Log::info('AdminCatalogController: Import started', [
    //         'files' => array_keys($request->allFiles()),
    //         'headers' => $request->headers->all(),
    //         'input' => $request->all()
    //     ]);

    //     try {
    //         // Проверяем наличие CSV файла
    //         if (!$request->hasFile('csv')) {
    //             Log::error('AdminCatalogController: No CSV file provided');
    //             return response()->json([
    //                 'success' => false,
    //                 'error' => 'CSV файл не предоставлен'
    //             ], 400);
    //         }

    //         $csvFile = $request->file('csv');
    //         $imageFiles = $request->file('images') ?? [];
    //         Log::info('AdminCatalogController: Files received', [
    //             'csv' => $csvFile->getClientOriginalName(),
    //             'images' => array_map(fn($file) => $file->getClientOriginalName(), $imageFiles)
    //         ]);

    //         // Открываем CSV файл
    //         $handle = fopen($csvFile->getRealPath(), 'r');
    //         $header = fgetcsv($handle);
    //         $expectedHeaders = [
    //             'id', 'name', 'description', 'price', 'category', 'subcategory', 
    //             'brand', 'images', 'specs', 'discount', 'created_at', 'updated_at'
    //         ];

    //         if ($header !== $expectedHeaders) {
    //             fclose($handle);
    //             Log::error('AdminCatalogController: Invalid CSV headers', ['header' => $header]);
    //             return response()->json([
    //                 'success' => false,
    //                 'error' => 'Неверный формат CSV файла. Ожидаются заголовки: ' . implode(',', $expectedHeaders)
    //             ], 400);
    //         }

    //         $importedCount = 0;
    //         $errors = [];

    //         // Правила валидации
    //         $rules = [
    //             'name' => 'required|string|max:255',
    //             'description' => 'required|string',
    //             'price' => 'required|numeric|min:0',
    //             'category' => 'required|string',
    //             'subcategory' => 'required|string',
    //             'brand' => 'required|string',
    //             'discount' => 'nullable|numeric|min:0|max:100',
    //             'images' => 'nullable|string',
    //             'specs' => 'required|string',
    //             'created_at' => 'nullable|date',
    //             'updated_at' => 'nullable|date',
    //         ];

    //         while (($row = fgetcsv($handle)) !== false) {
    //             try {
    //                 $data = array_combine($header, $row);
    //                 Log::info('AdminCatalogController: Processing row', ['data' => $data]);

    //                 // Валидация
    //                 $validator = Validator::make($data, $rules);
    //                 if ($validator->fails()) {
    //                     Log::error('AdminCatalogController: Validation failed', [
    //                         'data' => $data,
    //                         'errors' => $validator->errors()->all()
    //                     ]);
    //                     $errors[] = "Ошибка валидации для ID {$data['id']}: " . implode(', ', $validator->errors()->all());
    //                     continue;
    //                 }

    //                 // Проверяем ID
    //                 if (!preg_match('/^[0-9a-fA-F]{24}$/', $data['id'])) {
    //                     $errors[] = "Неверный формат ID в строке с ID {$data['id']}";
    //                     continue;
    //                 }

    //                 // Проверяем существование товара
    //                 if (Item::find($data['id'])) {
    //                     $errors[] = "Товар с ID {$data['id']} уже существует";
    //                     continue;
    //                 }

    //                 // Декодируем JSON
    //                 $description = json_decode($data['description'], true);
    //                 $specs = json_decode($data['specs'], true);
    //                 if (json_last_error() !== JSON_ERROR_NONE || !is_array($description) || !is_array($specs)) {
    //                     $errors[] = "Ошибка JSON в строке с ID {$data['id']}";
    //                     continue;
    //                 }

    //                 if (!isset($description['en']) || !isset($description['ru'])) {
    //                     $errors[] = "Поля description.en или description.ru отсутствуют для ID {$data['id']}";
    //                     continue;
    //                 }

    //                 // Обрабатываем изображение
    //                 $imagePath = null;
    //                 if (!empty($data['images'])) {
    //                     foreach ($imageFiles as $image) {
    //                         if (basename($image->getClientOriginalName()) === basename($data['images'])) {
    //                             $imagePath = $image->store('product_images', 'public');
    //                             break;
    //                         }
    //                     }
    //                 }

    //                 // Создаем товар
    //                 $item = Item::create([
    //                     '_id' => $data['id'],
    //                     'name' => $data['name'],
    //                     'description' => [
    //                         'en' => $description['en'],
    //                         'ru' => $description['ru']
    //                     ],
    //                     'price' => (float)$data['price'],
    //                     'category' => $data['category'],
    //                     'subcategory' => $data['subcategory'],
    //                     'brand' => $data['brand'],
    //                     'images' => $imagePath ? [$imagePath] : [],
    //                     'specs' => $specs,
    //                     'discount' => (float)$data['discount'],
    //                     'created_at' => $data['created_at'] ? new \DateTime($data['created_at']) : now(),
    //                     'updated_at' => $data['updated_at'] ? new \DateTime($data['updated_at']) : now(),
    //                 ]);

    //                 // Сохраняем переводы
    //                 $this->productService->saveTranslation('category', $data['category'], $data['category'], $data['category']);
    //                 $this->productService->saveTranslation('subcategory', $data['subcategory'], $data['subcategory'], $data['subcategory'], $data['category']);
    //                 foreach ($specs as $key => $value) {
    //                     $this->productService->saveTranslation('specs', $key, $key, $key);
    //                 }

    //                 $importedCount++;
    //             } catch (\Exception $e) {
    //                 Log::error('AdminCatalogController: Error processing row', [
    //                     'id' => $data['id'] ?? 'unknown',
    //                     'error' => $e->getMessage()
    //                 ]);
    //                 $errors[] = "Ошибка при импорте товара с ID {$data['id']}: {$e->getMessage()}";
    //             }
    //         }

    //         fclose($handle);

    //         Log::info('AdminCatalogController: Import completed', [
    //             'imported' => $importedCount,
    //             'errors' => $errors
    //         ]);

    //         return response()->json([
    //             'success' => true,
    //             'imported' => $importedCount,
    //             'errors' => $errors
    //         ]);

    //     } catch (\Exception $e) {
    //         Log::error('AdminCatalogController: Error importing CSV', ['error' => $e->getMessage()]);
    //         return response()->json([
    //             'success' => false,
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }
}
