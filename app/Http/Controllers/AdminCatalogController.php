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
    try {
        Log::info('AdminCatalogController: Starting product creation', ['request_data' => $request->all()]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description_en' => 'nullable|string',
            'description_ru' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string',
            'subcategory' => 'required|string',
            'brand' => 'nullable|string',
            'discount' => 'nullable|numeric|min:0|max:100',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        
        // Обрабатываем характеристики отдельно, чтобы избежать конфликта валидации
        $specsString = $request->input('specs_data'); 
        Log::info('AdminCatalogController: Raw specs string', ['specs_string' => $specsString]);
        Log::info('AdminCatalogController: Validation passed', ['validated' => $validated]);

        // Обработка новых переводов для категорий
        if ($request->has('new_category')) {
            $newCategory = json_decode($request->input('new_category'), true);
            if ($newCategory && isset($newCategory['slug'], $newCategory['ru'], $newCategory['en'])) {
                $this->saveTranslation('category', $newCategory['slug'], $newCategory['ru'], $newCategory['en']);
                Log::info('AdminCatalogController: New category translation saved', ['category' => $newCategory]);
            }
        }

        // Обработка новых переводов для подкатегорий
        if ($request->has('new_subcategory')) {
            $newSubcategory = json_decode($request->input('new_subcategory'), true);
            if ($newSubcategory && isset($newSubcategory['slug'], $newSubcategory['ru'], $newSubcategory['en'])) {
                $this->saveTranslation('subcategory', $newSubcategory['slug'], $newSubcategory['ru'], $newSubcategory['en'], $validated['category']);
                Log::info('AdminCatalogController: New subcategory translation saved', ['subcategory' => $newSubcategory]);
            }
        }

        // Обработка изображений
        $imagesPaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('product_images', 'public');
                $imagesPaths[] = basename($path);
            }
        }
        Log::info('AdminCatalogController: Images processed', ['images' => $imagesPaths]);

        // Обработка характеристик
        $specs = new \stdClass();
        if (!empty($specsString)) {
            try {
                $specsArray = json_decode($specsString, true);
                Log::info('AdminCatalogController: Decoded specs', ['specs' => $specsArray]);
                
                if (is_array($specsArray)) {
                    foreach ($specsArray as $key => $value) {
                        if (!empty($key)) {
                            if (is_array($value) && isset($value['value'], $value['translations'])) {
                                // Новая характеристика с переводами
                                $specs->{$key} = $value['value'];
                                // Сохраняем перевод
                                $this->saveTranslation('specs', $key, $value['translations']['ru'], $value['translations']['en']);
                                Log::info('AdminCatalogController: New spec translation saved', ['spec' => $key, 'translations' => $value['translations']]);
                            } else if (!empty($value)) {
                                // Обычная характеристика
                                $specs->{$key} = $value;
                            }
                        }
                    }
                }
            } catch (\Exception $e) {
                Log::error('AdminCatalogController: Error parsing specs JSON', ['error' => $e->getMessage()]);
            }
        }
        Log::info('AdminCatalogController: Final specs object', ['specs' => $specs]);

        $item = Item::create([
            'name' => $validated['name'],
            'description' => [
                'en' => $validated['description_en'] ?? '',
                'ru' => $validated['description_ru'] ?? ''
            ],
            'price' => (float)$validated['price'],
            'category' => $validated['category'],
            'subcategory' => $validated['subcategory'],
            'brand' => $validated['brand'],
            'discount' => (float)($validated['discount'] ?? 0),
            'images' => $imagesPaths,
            'specs' => $specs
        ]);

        Log::info('AdminCatalogController: Product created successfully', ['item_id' => $item->id]);

        return response()->json([
            'success' => true,
            'data' => $this->productFormatter->formatProduct($item),
            'message' => 'Product created successfully'
        ]);

    } catch (\Exception $e) {
        Log::error('AdminCatalogController: Error creating product', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]);
        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
}

// Вспомогательный метод для сохранения переводов
// Вспомогательный метод для сохранения переводов
private function saveTranslation($namespace, $key, $ru, $en, $parentCategory = null)
{
    try {
        $ruPath = public_path('locales/ru/translation.json');
        $enPath = public_path('locales/en/translation.json');

        $ruTranslations = file_exists($ruPath) ? json_decode(file_get_contents($ruPath), true) : [];
        $enTranslations = file_exists($enPath) ? json_decode(file_get_contents($enPath), true) : [];

        if ($namespace === 'category') {
            // Для категорий: category.{key}
            $ruTranslations['category'][$key] = $ru;
            $enTranslations['category'][$key] = $en;
            
        } elseif ($namespace === 'subcategory') {
            // Для подкатегорий: subcategory.{parentCategory}.{key}
            if (!isset($ruTranslations['subcategory'])) {
                $ruTranslations['subcategory'] = [];
            }
            if (!isset($enTranslations['subcategory'])) {
                $enTranslations['subcategory'] = [];
            }

            if ($parentCategory) {
                // Если указана родительская категория, добавляем как вложенную подкатегорию
                if (!isset($ruTranslations['subcategory'][$parentCategory])) {
                    $ruTranslations['subcategory'][$parentCategory] = [];
                }
                if (!isset($enTranslations['subcategory'][$parentCategory])) {
                    $enTranslations['subcategory'][$parentCategory] = [];
                }

                $ruTranslations['subcategory'][$parentCategory][$key] = $ru;
                $enTranslations['subcategory'][$parentCategory][$key] = $en;
            } else {
                // Если родительская категория НЕ указана, добавляем как корневую подкатегорию
                $ruTranslations['subcategory'][$key] = $ru;
                $enTranslations['subcategory'][$key] = $en;
            }
            
        } else {
            // Для остальных (specs и т.д.)
            if (!isset($ruTranslations[$namespace])) {
                $ruTranslations[$namespace] = [];
            }
            if (!isset($enTranslations[$namespace])) {
                $enTranslations[$namespace] = [];
            }
            $ruTranslations[$namespace][$key] = $ru;
            $enTranslations[$namespace][$key] = $en;
        }

        file_put_contents($ruPath, json_encode($ruTranslations, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        file_put_contents($enPath, json_encode($enTranslations, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

        Log::info('Translation saved successfully', [
            'namespace' => $namespace,
            'key' => $key,
            'parent_category' => $parentCategory
        ]);

    } catch (\Exception $e) {
        Log::error('Error saving translation', ['error' => $e->getMessage()]);
    }
}

    // Обновление товара
    public function update(Request $request, $id)
    {
        try {
            Log::info('AdminCatalogController: Starting product update', [
                'id' => $id,
                'request_data' => $request->all()
            ]);
    
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description_en' => 'nullable|string',
                'description_ru' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'category' => 'required|string',
                'subcategory' => 'required|string',
                'brand' => 'nullable|string',
                'discount' => 'nullable|numeric|min:0|max:100',
                'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'specs' => 'nullable|array',
                'specs.*.key' => 'required_with:specs|string',
                'specs.*.value' => 'required_with:specs|string',
            ]);
    
            // Find the item
            $item = Item::findOrFail($id);
    
            // Handle images
            $imagesPaths = $item->images ?? [];
            if ($request->hasFile('images')) {
                $imagesPaths = [];
                foreach ($request->file('images') as $image) {
                    $path = $image->store('product_images', 'public');
                    $imagesPaths[] = basename($path);
                }
                Log::info('AdminCatalogController: New images processed', ['images' => $imagesPaths]);
            }
    
            // Format specs as object
            $specs = new \stdClass();
            if ($request->has('specs') && is_array($request->specs)) {
                foreach ($request->specs as $spec) {
                    if (!empty($spec['key']) && !empty($spec['value'])) {
                        $specs->{trim($spec['key'])} = trim($spec['value']);
                    }
                }
                Log::info('AdminCatalogController: Specs processed', ['specs' => $specs]);
            } else {
                // Keep existing specs if none provided
                $specs = $item->specs ?? new \stdClass();
                Log::info('AdminCatalogController: Keeping existing specs', ['specs' => $specs]);
            }
    
            // Update the item
            $item->update([
                'name' => $validated['name'],
                'description' => [
                    'en' => $validated['description_en'] ?? '',
                    'ru' => $validated['description_ru'] ?? ''
                ],
                'price' => (float)$validated['price'],
                'category' => $validated['category'],
                'subcategory' => $validated['subcategory'],
                'brand' => $validated['brand'],
                'discount' => (float)($validated['discount'] ?? 0),
                'images' => $imagesPaths,
                'specs' => $specs,
            ]);
    
            Log::info('AdminCatalogController: Product updated successfully', ['item_id' => $item->id]);
    
            return response()->json([
                'success' => true,
                'data' => $this->productFormatter->formatProductDetails($item), // Используем formatProductDetails
                'message' => 'Product updated successfully'
            ]);
    
        } catch (\Exception $e) {
            Log::error('AdminCatalogController: Error updating product', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Удаление товара
    public function destroy($id)
    {
        try {
            $item = Item::findOrFail($id);
            $item->delete();
    
            Log::info('AdminCatalogController: Product deleted', ['id' => $id]);
    
            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('AdminCatalogController: Error deleting product', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }


   // Получение уникальных ключей характеристик для автодополнения
//    public function getSpecKeys()
//    {
//     try {
//         Log::info('AdminCatalogController: getSpecKeys begin');
//         // Простой способ получения ключей спецификаций
//         $items = Item::whereNotNull('specs')->get();
//         Log::info('AdminCatalogController: Items with specs', [
//             'count' => $items->count(),
//             'specs' => $items->pluck('specs')->toArray()
//         ]);
//         $keys = collect();
        
//         foreach ($items as $item) {
//             if ($item->specs && is_object($item->specs)) {
//                 $specKeys = array_keys((array)$item->specs);
//                 $keys = $keys->merge($specKeys);
//             }
//         }
        
//         $uniqueKeys = $keys->unique()->sort()->values()->toArray();
//         Log::info('AdminCatalogController: ',$uniqueKeys );
//         return response()->json([
//             'success' => true,
//             'data' => $uniqueKeys
//         ]);

//     } catch (\Exception $e) {
//         Log::error('AdminCatalogController: Error fetching spec keys', ['error' => $e->getMessage()]);
//         return response()->json([
//             'success' => false,
//             'error' => $e->getMessage()
//         ], 500);
//     }
//     }
// public function getSpecKeys()
// {
//     try {
//         Log::info('AdminCatalogController: getSpecKeys begin');
//         $items = Item::whereNotNull('specs')->get();
//         Log::info('AdminCatalogController: Items with specs', [
//             'count' => $items->count(),
//             'specs' => $items->pluck('specs')->toArray()
//         ]);

//         $keys = collect();
//         foreach ($items as $item) {
//             Log::info('AdminCatalogController: Processing item', [
//                 'item_id' => $item->id,
//                 'specs_type' => gettype($item->specs),
//                 'specs_content' => $item->specs
//             ]);

//             // Обрабатываем specs как массив или объект
//             if ($item->specs && (is_array($item->specs) || is_object($item->specs))) {
//                 $specKeys = array_keys((array)$item->specs);
//                 Log::info('AdminCatalogController: Spec keys for item', [
//                     'item_id' => $item->id,
//                     'spec_keys' => $specKeys
//                 ]);
//                 $keys = $keys->merge($specKeys);
//             } else {
//                 Log::warning('AdminCatalogController: Invalid specs for item', [
//                     'item_id' => $item->id,
//                     'specs' => $item->specs
//                 ]);
//             }
//         }

//         $uniqueKeys = $keys->unique()->sort()->values()->toArray();

//         return response()->json([
//             'success' => true,
//             'data' => $uniqueKeys
//         ]);
//     } catch (\Exception $e) {
//         Log::error('AdminCatalogController: Error fetching spec keys', [
//             'error' => $e->getMessage(),
//             'trace' => $e->getTraceAsString()
//         ]);
//         return response()->json([
//             'success' => false,
//             'error' => $e->getMessage()
//         ], 500);
//     }
// }

public function getSpecKeysAndValues()
{
    try {
        Log::info('AdminCatalogController: getSpecKeysAndValues begin');
        $items = Item::whereNotNull('specs')->get();
        Log::info('AdminCatalogController: Items with specs', [
            'count' => $items->count(),
            'specs' => $items->pluck('specs')->toArray()
        ]);

        $specData = [];
        foreach ($items as $item) {
            $specs = $item->specs;
            // Если specs - строка, декодируем JSON
            if (is_string($item->specs)) {
                $specs = json_decode($item->specs, true);
                Log::info('AdminCatalogController: Decoded string specs for item', [
                    'item_id' => $item->id,
                    'specs' => $specs
                ]);
            }

            // Проверяем, что specs является массивом или объектом и не пуст
            if ($specs && (is_array($specs) || is_object($specs)) && !empty($specs)) {
                foreach ((array)$specs as $key => $value) {
                    if (!empty($key) && $value !== null) {
                        // Инициализируем массив для ключа, если его нет
                        if (!isset($specData[$key])) {
                            $specData[$key] = [];
                        }
                        // Добавляем значение, если оно еще не добавлено
                        if (!in_array($value, $specData[$key])) {
                            $specData[$key][] = $value;
                        }
                    }
                }
            } else {
                // Логируем только если specs вообще невалидный (не массив/объект/null).  Пустой массив не логируем.
                if ($specs !== null && !is_array($specs) && !is_object($specs)) {
                    Log::warning('AdminCatalogController: Invalid specs for item', [
                        'item_id' => $item->id,
                        'specs' => $specs
                    ]);
                }
            }
        }

        // Сортируем значения для каждого ключа
        foreach ($specData as $key => $values) {
            sort($specData[$key]);
        }

        Log::info('AdminCatalogController: Spec keys and values', ['spec_data' => $specData]);

        return response()->json([
            'success' => true,
            'data' => $specData
        ]);
    } catch (\Exception $e) {
        Log::error('AdminCatalogController: Error fetching spec keys and values', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
}


    
    // Получение уникальных брендов
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