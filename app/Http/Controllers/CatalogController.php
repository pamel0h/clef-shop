<?php
/*
namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    public function fetchData(Request $request)
    {
        try {
            \Log::info('FetchData request:', $request->all());

            $data = match($request->type) {
                'categories' => $this->fetchCategories(),
                'subcategories' => $this->fetchSubcategories($request),
                'products' => $this->fetchProducts($request),
                default => []
            };

            \Log::info('Fetched data:', ['type' => $request->type, 'data' => $data]);

            return response()->json([
                'success' => true,
                'data' => array_values(array_filter($data))
            ]);

        } catch (\Exception $e) {
            \Log::error('Catalog error:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function fetchCategories()
    {
        $result = Item::raw(function($collection) {
            return $collection->aggregate([
                ['$group' => ['_id' => '$category']],
                ['$sort' => ['_id' => 1]]
            ])->toArray();
        });

        \Log::info('Categories aggregation result:', ['result' => $result]);
        return array_column($result, '_id');
    }

    private function fetchSubcategories(Request $request)
    {
        $category = $request->input('category');
        \Log::info('Searching subcategories for category:', ['category' => $category]);

        if (!$category) {
            \Log::warning('Category parameter is missing for subcategories request');
            return [];
        }

        $result = Item::raw(function($collection) use ($category) {
            return $collection->aggregate([
                ['$match' => ['category' => $category]],
                ['$group' => ['_id' => '$subcategory']],
                ['$sort' => ['_id' => 1]]
            ])->toArray();
        });

        \Log::info('Subcategories aggregation result:', ['result' => $result]);
        return array_column($result, '_id');
    }

    private function fetchProducts(Request $request)
    {
        $category = $request->input('category');
        $subcategory = $request->input('subcategory');

        \Log::info('Searching products:', ['category' => $category, 'subcategory' => $subcategory]);

        if (!$category || !$subcategory) {
            \Log::warning('Category or subcategory parameter is missing for products request');
            return [];
        }

        return Item::raw(function($collection) use ($category, $subcategory) {
            return $collection->aggregate([
                ['$match' => [
                    'category' => $category,
                    'subcategory' => $subcategory,
                ]],
                ['$project' => [
                    'id' => '$_id',
                    'name' => 1,
                    'price' => 1,
                    '_id' => 0,
                ]],
            ])->toArray();
        });
    }

}*/

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CatalogController extends Controller
{
    public function fetchData(Request $request)
    {
        try {
            Log::info('FetchData request:', $request->all());
    
            $data = match($request->type) {
                'categories' => $this->fetchCategories(),
                'subcategories' => $this->fetchSubcategories($request),
                'products' => $this->fetchProducts($request),
                'product_details' => $this->fetchProductDetails($request),
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
    
    private function fetchCategories()
    {
        $categories = Item::getAllCategories();
        Log::info('Categories fetched in controller:', ['categories' => $categories]);
        return $categories;
    }

    private function fetchSubcategories(Request $request)
    {
        $category = $request->input('category');
        if (!$category) {
            Log::warning('Category parameter is missing');
            return [];
        }

        return Item::getSubcategoriesOf($category);
    }

    private function fetchProducts(Request $request)
    {
        $category = $request->input('category');
        $subcategory = $request->input('subcategory');

        if (!$category || !$subcategory) {
            Log::warning('Missing category or subcategory');
            return [];
        }

        return Item::getItemsByCategory($category, $subcategory)
            ->map(function ($item) {
                return $this->formatProduct($item);
            })
            ->toArray();
    }

    // private function fetchProductDetails(Request $request)
    // {
    //     $id = $request->input('id');
    //     $category = $request->input('category');
    //     $subcategory = $request->input('subcategory');
    
    //     $product = Item::where('_id', $id)
    //                   ->where('category', $category)
    //                   ->where('subcategory', $subcategory)
    //                   ->first();
    //     Log::debug('Product images before formatting:', ['images' => $product ? $product->images : null]);
    //     if ($product && isset($product->images)) {
    //         // Преобразуем пути к изображениям
    //         $product->images = array_map(function ($image) {
    //             return asset($image); // или asset('storage/' . $image) для Laravel Storage
    //         }, $product->images);
    //     }
    
    //     Log::info('Fetched product details:', [
    //         'id' => $id,
    //         'category' => $category,
    //         'subcategory' => $subcategory,
    //         'product' => $product ? $product->toArray() : null
    //     ]);
    
    //     return $product ?: [];
    // }
    private function fetchProductDetails(Request $request)
    {
        $id = $request->input('id');
        $category = $request->input('category');
        $subcategory = $request->input('subcategory');
    
        $product = Item::where('_id', $id)
                      ->where('category', $category)
                      ->where('subcategory', $subcategory)
                      ->first();
    
        Log::debug('Product images before formatting:', ['images' => $product ? $product->images : null]);
    
        if ($product && isset($product->images)) {
            // Ensure images are processed correctly
            $product->image = $this->getFirstImageUrl($product->images);
            Log::debug('Formatted image URL:', ['image' => $product->image]);
        } else {
            $product->image = asset('storage/product_images/no-image.png');
        }
    
        Log::info('Fetched product details:', [
            'id' => $id,
            'category' => $category,
            'subcategory' => $subcategory,
            'product' => $product ? $product->toArray() : null
        ]);
    
        return $product ? $this->formatProductDetails($product) : [];
    }
    private function formatProduct($item)
    {
        return [
            'id' => $item->_id,
            'name' => $item->name,
            'price' => $item->price,
            'image' => $this->getFirstImageUrl($item->images),
            'category' => $item->category,
            'subcategory' => $item->subcategory
        ];
    }

    private function formatProductDetails($item)
    {
        return [
            'id' => $item->_id,
            'name' => $item->name,
            'description' => $item->description,
            'price' => $item->price,
            'brand' => $item->brand,
            // 'images' => $this->getAllImageUrls($item->images),
            'image' => $this->getFirstImageUrl($item->images),
            'specs' => $item->specs,
            'category' => $item->category,
            'subcategory' => $item->subcategory
        ];
    }

    private function getFirstImageUrl($images)
    {
        return $images && count($images) > 0 
            ? asset('storage/product_images/' . $images[0])
            : asset('storage/product_images/no-image.png');
    }

    private function getAllImageUrls($images)
    {
        if (empty($images)) {
            return [asset('storage/product_images/no-image.png')];
        }

        $urls = array_map(function ($image) {
            // Убираем начальные и конечные слэши, добавляем правильный префикс
            $cleanImage = trim($image, '/');
            $url = asset("storage/product_images/{$cleanImage}");
            Log::info('Generated image URL:', ['url' => $url, 'original' => $image]);
            return $url;
        }, $images);

        return $urls;
    }
}