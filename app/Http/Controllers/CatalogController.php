<?php

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

//     public function fetchData(Request $request)
// {
//     try {
//         \Log::info('FetchData request:', $request->all());
        
//         $data = match($request->type) {
//             'categories' => Item::raw(function($collection) {
//                 return $collection->aggregate([
//                     ['$group' => ['_id' => '$category']],
//                     ['$sort' => ['_id' => 1]]
//                 ]);
//             })->pluck('_id')->toArray(),
            
//             'subcategories' => Item::raw(function($collection) use ($request) {
//                 return $collection->aggregate([
//                     ['$match' => ['category' => $request->category]],
//                     ['$group' => ['_id' => '$subcategory']],
//                     ['$sort' => ['_id' => 1]]
//                 ]);
//             })->pluck('_id')->toArray(),
            
//             default => []
//         };

//         \Log::info('Fetched data:', ['type' => $request->type, 'data' => $data]);
        
//         return response()->json([
//             'success' => true,
//             'data' => array_values(array_filter($data)) // Удаляем пустые значения
//         ]);

//     } catch (\Exception $e) {
//         \Log::error('Catalog error:', ['error' => $e->getMessage()]);
//         return response()->json([
//             'success' => false,
//             'error' => $e->getMessage()
//         ], 500);
//     }
// }

}