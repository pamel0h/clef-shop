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
             
             // Обрабатываем характеристикик отдельно, чтобы избежать конфликта валидации
             $specsString = $request->input('specs_data'); 
             Log::info('AdminCatalogController: Raw specs string', ['specs_string' => $specsString]);
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
 
             // Обработка характеристик
             $specs = new \stdClass();
             if (!empty($specsString)) {
                 try {
                     $specsArray = json_decode($specsString, true);
                     Log::info('AdminCatalogController: Decoded specs', ['specs' => $specsArray]);
                     
                     if (is_array($specsArray)) {
                         foreach ($specsArray as $key => $value) {
                             if (!empty($key) && !empty($value)) {
                                 $specs->{$key} = $value;
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
                'specs' => $specs
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