<?php

namespace App\Formatters;

use App\Models\Item;
use Illuminate\Support\Facades\Log;

class ProductFormatter
{
    public function formatProduct(Item $item): array
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
            'specs' => $item->specs,
            'description' => $item->description,
        ];
    }

     /**
     * Форматировать элементы корзины
     */
    public function formatCartItems(array $items): array
    {
        $cartItems = collect($items)->map(function ($item) {
            $product = Item::find($item['product_id']);
            if (!$product) {
                Log::warning('Product not found for product_id: ' . $item['product_id']);
                return null;
            }
            return [
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'attributes' => $item['attributes'] ?? [],
                'product' => $this->formatProduct($product),
            ];
        })->filter()->values()->toArray();

        return ['items' => $cartItems];
    }

    
    public function getFirstImageUrl(?array $images): string
    {
        if (!$images || count($images) == 0) {
            return asset('images/no-image.png');
        }

        $firstImage = $images[0];

        // Если это полный URL (http/https)
        if (filter_var($firstImage, FILTER_VALIDATE_URL)) {
           
            return $firstImage;
        }

        if (preg_match('/^data:image\/(jpeg|png|gif|webp);base64,/', $firstImage)) {
            return $firstImage;
        }
        
        // Если это относительный путь
        return asset('storage/product_images/' . $firstImage);
    }
}
