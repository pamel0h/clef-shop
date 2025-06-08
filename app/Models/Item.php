<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Item extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'items';
    public $timestamps = true; // включить автоматические timestamps
    protected $fillable = [        
        'name', 
        'description', 
        'price', 
        'category', 
        'subcategory', 
        'brand', 
        'images', 
        'specs',
        'discount',
    ];
    public static function getAllCategories()
    {
        $result = self::raw(function ($collection) {
            return $collection->aggregate([
                ['$group' => ['_id' => '$category']],
                ['$match' => ['_id' => ['$ne' => null]]],
                ['$sort' => ['_id' => 1]],
                ['$project' => ['category' => '$_id', '_id' => 0]]
            ]);
        });
    
        $categories = $result->pluck('category')->toArray();
        Log::info('Raw categories result:', ['rawResult' => $result->toArray()]);
        Log::info('Fetched categories:', ['categories' => $categories]);
        return $categories;
}

    public static function getSubcategoriesOf($category)
    {
        
        $result = self::raw(function ($collection) use ($category) {
            return $collection->aggregate([
                ['$match' => ['category' => $category]],
                ['$group' => ['_id' => '$subcategory']],
                ['$match' => ['_id' => ['$ne' => null]]],
                ['$sort' => ['_id' => 1]],
                ['$project' => ['subcategory' => '$_id', '_id' => 0]]
            ]);
        });
    
        $subcategories = $result->pluck('subcategory')->toArray();
        Log::info('Raw subcategories result:', ['category' => $category, 'rawResult' => $result->toArray()]);
        Log::info('Fetched subcategories for category:', ['category' => $category, 'subcategories' => $subcategories]);
        return $subcategories;
    }
    
    public static function getItemsByCategory($category, $subcategory = null)
    {
        $items = self::where('category', $category)
                    ->when($subcategory, fn($q) => $q->where('subcategory', $subcategory))
                    ->orderBy('name')
                    ->get();
        Log::info('Fetched items:', ['category' => $category, 'subcategory' => $subcategory, 'items' => $items->toArray()]);
        return $items;
    }
 
    public static function getAllBrands()
    {
        $result = self::raw(function ($collection) {
            return $collection->aggregate([
                ['$group' => ['_id' => '$brand']],
                ['$match' => ['_id' => ['$ne' => null]]],
                ['$sort' => ['_id' => 1]],
                ['$project' => ['brand' => '$_id', '_id' => 0]]
            ]);
        });
    
        $brands = $result->pluck('brand')->toArray();
        Log::info('Raw brands result:', ['rawResult' => $result->toArray()]);
        Log::info('Fetched brands:', ['brands' => $brands]);
        return $brands;
    }

    // картинки
    // public function getImageUrlAttribute()
    // {
    //     return $this->images && count($this->images) > 0
    //         ? asset('storage/product_images/' . $this->images[0])
    //         : asset('images/no-image.png');
    // }
    public function getImageUrlAttribute()
{
    if (!$this->images || count($this->images) == 0) {
        return asset('images/no-image.png');
    }
    
    $firstImage = $this->images[0];
    
    // Если это полный URL (http/https)
    if (filter_var($firstImage, FILTER_VALIDATE_URL)) {
        return $firstImage;
    }
    
    // Если это base64
    if (preg_match('/^data:image\/(jpeg|png|gif|webp);base64,/', $firstImage)) {
        return $firstImage;
    }
    
    // Если это относительный путь (существующая логика)
    return asset('storage/product_images/' . $firstImage);
}
}