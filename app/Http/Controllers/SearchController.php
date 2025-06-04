<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Formatters\ProductFormatter;
use App\Services\SearchService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SearchController extends Controller
{
  public function __construct(
    private SearchService $searchService,
    private ProductFormatter $productFormatter
  ) {}

  public function search(Request $request)
  {
    $query = $request->input('query', '');
    $id = $request->input('id');
    Log::info('SearchController: Received query', ['query' => $query, 'id' => $id]);

    $results = $this->searchService->search($query, $id);

    $formatted = $results->map(function ($item) use ($id) {
      return $this->productFormatter->formatProduct($item);
  });

  Log::info('SearchController: Search results', ['results' => $formatted->toArray()]);

  return response()->json([
      'success' => true,
      'data' => $id ? $formatted->first() : $formatted->toArray()
  ]);
  }
}