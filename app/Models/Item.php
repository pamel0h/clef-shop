<?php

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
}
