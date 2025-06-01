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
                // 'specs' => 'nullable|array',
                // 'specs.*.key' => 'required|string',
                // 'specs.*.value' => 'required|string',
            ]);
            Log::info('AdminCatalogController: Validation passed', ['validated' => $validated]);

            // Обработка изображений
            $imagesPaths = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('product_images', 'public');
                    $imagesPaths[] = basename($path);
                }
            }
            Log::info('AdminCatalogController: Images processed', ['images' => $imagesPaths]);

            // Формируем specs как объект
            // $specs = new \stdClass();
            // if ($request->has('specs')) {
            //     foreach ($request->specs as $spec) {
            //         if (!empty($spec['key']) && !empty($spec['value'])) {
            //             $specs->{$spec['key']} = $spec['value'];
            //         }
            //     }
            // }

            // $item = Item::create([
            //     'name' => $validated['name'],
            //     'description' => [
            //         'en' => $validated['description_en'] ?? '',
            //         'ru' => $validated['description_ru'] ?? ''
            //     ],
            //     'price' => (float)$validated['price'],
            //     'category' => $validated['category'],
            //     'subcategory' => $validated['subcategory'],
            //     'brand' => $validated['brand'],
            //     'discount' => (float)($validated['discount'] ?? 0),
            //     'images' => $imagesPaths,
            //     'specs' => new \stdClass() 
            //     // 'specs' => $specs
            // ]);
// Проверяем подключение к MongoDB
        // Подготовка данных для сохранения
        $itemData = [
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
            'specs' => new \stdClass() 
        ];

        Log::info('AdminCatalogController: Data prepared for creation', ['item_data' => $itemData]);

try {
    $connection = \DB::connection('mongodb');
    Log::info('AdminCatalogController: MongoDB connection status', [
        'connection' => get_class($connection),
        'database_name' => $connection->getMongoDB()->getDatabaseName()
    ]);
} catch (\Exception $e) {
    Log::error('AdminCatalogController: MongoDB connection error', ['error' => $e->getMessage()]);
    throw new \Exception('Database connection failed: ' . $e->getMessage());
}

// Создаем товар
$item = Item::create($itemData);

Log::info('AdminCatalogController: Item created', [
    'item_id' => $item->id ?? 'NO_ID',
    'item_data' => $item->toArray()
]);

// Проверяем, действительно ли товар сохранился
$savedItem = Item::find($item->id);
if (!$savedItem) {
    Log::error('AdminCatalogController: Item not found after creation', ['item_id' => $item->id]);
    throw new \Exception('Failed to save item to database');
}

Log::info('AdminCatalogController: Item verified in database', [
    'saved_item' => $savedItem->toArray()
]);

// Также проверим общее количество товаров в БД
$totalItems = Item::count();
Log::info('AdminCatalogController: Total items in database', ['count' => $totalItems]);

return response()->json([
    'success' => true,
    'data' => $this->productFormatter->formatProduct($item),
    'message' => 'Product created successfully',
    'debug' => [
        'item_id' => $item->id,
        'total_items' => $totalItems
    ]
]);
            // return response()->json([
            //     'success' => true,
            //     'data' => $this->productFormatter->formatProduct($item),
            //     'message' => 'Product created successfully'
            // ]);

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

    // Обновление товара
    public function update(Request $request, $id)
    {
   
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
   public function getSpecKeys()
   {
       try {
           $specKeys = Item::raw(function ($collection) {
               return $collection->aggregate([
                   ['$project' => ['specs' => ['$objectToArray' => '$specs']]],
                   ['$unwind' => '$specs'],
                   ['$group' => ['_id' => '$specs.k']],
                   ['$sort' => ['_id' => 1]]
               ]);
           });

           $keys = $specKeys->pluck('_id')->filter()->values()->toArray();

           return response()->json([
               'success' => true,
               'data' => $keys
           ]);

       } catch (\Exception $e) {
           Log::error('AdminCatalogController: Error fetching spec keys', ['error' => $e->getMessage()]);
           return response()->json([
               'success' => false,
               'error' => $e->getMessage()
           ], 500);
       }
    }

}