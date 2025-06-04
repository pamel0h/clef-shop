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

    public function getFirstImageUrl(?array $images): string
    {
        return $images && count($images) > 0 
            ? asset('storage/product_images/' . $images[0])
            : asset('storage/product_images/no-image.png');
    }
}