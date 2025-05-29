<?php
// app/Formatters/ProductFormatter.php
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
        ];
    }

    public function formatProductDetails(Item $item): array
    {
        return [
            'id' => $item->_id,
            'name' => $item->name,
            'description' => $item->description,
            'price' => $item->price,
            'discount' => $item->discount,
            'brand' => $item->brand,
            'image' => $this->getFirstImageUrl($item->images),
            'specs' => $item->specs,
            'category' => $item->category,
            'subcategory' => $item->subcategory
        ];
    }

    public function getFirstImageUrl(?array $images): string
    {
        return $images && count($images) > 0 
            ? asset('storage/product_images/' . $images[0])
            : asset('storage/product_images/no-image.png');
    }
}