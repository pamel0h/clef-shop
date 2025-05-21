<?php

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
            'subcategory' => $item->subcategory,
            'brand' => $item->brand,
            'discount' => $item->discount,
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

    // private function getAllImageUrls($images)
    // {
    //     if (empty($images)) {
    //         return [asset('storage/product_images/no-image.png')];
    //     }

    //     $urls = array_map(function ($image) {
    //         // Убираем начальные и конечные слэши, добавляем правильный префикс
    //         $cleanImage = trim($image, '/');
    //         $url = asset("storage/product_images/{$cleanImage}");
    //         Log::info('Generated image URL:', ['url' => $url, 'original' => $image]);
    //         return $url;
    //     }, $images);

    //     return $urls;
    // }
}