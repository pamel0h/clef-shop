<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Formatters\ProductFormatter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SearchController extends Controller
{

        public function __construct(
            private ProductFormatter $productFormatter
        ) {}
    
        public function search(Request $request)
        {
            $query = $request->input('query', '');
            Log::info('SearchController: Received query', ['query' => $query]);
    
            if (empty($query)) {
                return response()->json([
                    'success' => true,
                    'data' => []
                ]);
            }
    
            $results = Item::where('name', 'like', "%{$query}%")
                ->orWhere('description', 'like', "%{$query}%")
                ->orWhere('brand', 'like', "%{$query}%")
                ->get()
                ->map(function ($item) {
                    return $this->productFormatter->formatProduct($item);
                });
    
            Log::info('SearchController: Search results', ['results' => $results->toArray()]);
            return response()->json([
                'success' => true,
                'data' => $results
            ]);
        }
    }

