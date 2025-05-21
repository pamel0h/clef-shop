<?php
/*
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Item extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'items';
    protected $fillable =[        
        'name', 
        'description', 
        'price', 
        'category', 
        'subcategory', 
        'brand', 
        'images', 
        'specs'
    ];

     //методы для получения категорий

     public static function getAllCategories()
     {
         return self::distinct('category')
                  ->get()
                  ->pluck('category')
                  ->toArray();
     }
     
     public static function getSubcategoriesOf($category)
     {
         return self::where('category', $category)
                  ->distinct('subcategory')
                  ->get()
                  ->pluck('subcategory')
                  ->toArray();
     }
     
     public static function getItemsByCategory($category, $subcategory = null)
     {
         // Базовый запрос для категории
         $query = self::where('category', $category);
         
         // Добавляем условие по подкатегории если она указана
         if ($subcategory) {
             $query->where('subcategory', $subcategory);
         }
         
         return $query->get();
     }  

     public function getImageUrlAttribute()
        {
            return $this->images ? asset('storage/product_images/' . $this->images[0]) : asset('product_images/no-image.png');
        }
}
*/

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Item extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'items';
    protected $fillable = [        
        'name', 
        'description', 
        'price', 
        'category', 
        'subcategory', 
        'brand', 
        'images', 
        'specs'
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

    // Accessors
    public function getImageUrlAttribute()
    {
        return $this->images && count($this->images) > 0
            ? asset('storage/product_images/' . $this->images[0])
            : asset('images/no-image.png');
    }

    public function getImageUrlsAttribute()
    {
        if (empty($this->images)) {
            return [$this->image_url];
        }

        return array_map(function ($image) {
            return asset('storage/product_images/' . $image);
        }, $this->images);
    }
}