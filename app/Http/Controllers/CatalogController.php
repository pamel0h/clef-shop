<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    public function fetchData(Request $request)
    {
        try {
            \Log::info('FetchData request:', $request->all()); // Логируем запрос
            
            $data = match($request->type) {
                'categories' => Item::raw(function($collection) {
                    return $collection->aggregate([
                        ['$group' => ['_id' => '$category']],
                        ['$sort' => ['_id' => 1]]
                    ]);
                })->pluck('_id')->toArray(),
                
                default => []
            };
    
            \Log::info('Categories data:', $data); // Логируем результат
            
            return response()->json([
                'success' => true,
                'data' => $data
            ]);
    
        } catch (\Exception $e) {
            \Log::error('Catalog error:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}