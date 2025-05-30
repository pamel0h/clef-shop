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
    $id = $request->input('id');
    Log::info('SearchController: Received query', ['query' => $query, 'id' => $id]);

    if (empty($query) && !$id) {
      return response()->json([
        'success' => true,
        'data' => []
      ]);
    }

    $queryBuilder = Item::query();

    if ($id) {
      $queryBuilder->where('_id', $id);
    } else {
      $queryBuilder->where('name', 'like', "%{$query}%")
        ->orWhere('description', 'like', "%{$query}%")
        ->orWhere('brand', 'like', "%{$query}%");
    }

    $results = $queryBuilder->get()->map(function ($item) use ($id) {
      return $id ? $this->productFormatter->formatProductDetails($item) : $this->productFormatter->formatProduct($item);
    });

    Log::info('SearchController: Search results', ['results' => $results->toArray()]);
    return response()->json([
      'success' => true,
      'data' => $id ? $results->first() : $results->toArray()
    ]);
  }
}