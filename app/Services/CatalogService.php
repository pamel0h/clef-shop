<?php
// app/Services/CatalogService.php
namespace App\Services;

use App\Models\Item;
use App\Formatters\ProductFormatter;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class CatalogService
{
    public function __construct(
        private ProductFormatter $productFormatter
    ) {}

    public function getAllCategories(): array
    {
        return Item::getAllCategories();
    }

    public function getSubcategories(string $category): array
    {
        return Item::getSubcategoriesOf($category);
    }

    public function getProducts(string $category, ?string $subcategory = null)
    {
        return Item::getItemsByCategory($category, $subcategory)
            ->map(fn($item) => $this->productFormatter->formatProduct($item))
            ->toArray();
    }

    public function getProductDetails(string $id, string $category, string $subcategory): array
    {
        $product = Item::where('_id', $id)
                      ->where('category', $category)
                      ->where('subcategory', $subcategory)
                      ->first();

        if (!$product) {
            Log::warning('Product not found', [
                'id' => $id,
                'category' => $category,
                'subcategory' => $subcategory
            ]);
            return [];
        }

        return $this->productFormatter->formatProduct($product);
    }

    public function getLastUpdated()
    {
        try {
            $latestItem = Item::orderBy('updated_at', 'desc')->first();
            $lastUpdated = $latestItem ? $latestItem->updated_at->toIso8601String() : null;
            $translationsLastUpdated = Cache::get('translations_last_updated', now()->toIso8601String());

            return [
                'last_updated' => $lastUpdated,
                'translations_last_updated' => $translationsLastUpdated,
            ];
        } catch (\Exception $e) {
            Log::error('CatalogService: Ошибка получения времени обновления', ['error' => $e->getMessage()]);
            throw $e;
        }
    }


}