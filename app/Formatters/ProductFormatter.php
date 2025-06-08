<?php

namespace App\Formatters;

use App\Models\Item;

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

    // public function getFirstImageUrl(?array $images): string
    // {
    //     return $images && count($images) > 0 
    //         ? asset('storage/product_images/' . $images[0])
    //         : asset('storage/product_images/no-image.png');
    // }
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
        
        // Если это base64
        if (preg_match('/^data:image\/(jpeg|png|gif|webp);base64,/', $firstImage)) {
            return $firstImage;
        }
        
        // Если это относительный путь
        return asset('storage/product_images/' . $firstImage);
    }
}
