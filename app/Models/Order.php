<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'orders'; 

    protected $fillable = [
        'user_id',
        'items',
        'total_amount',
        'status',
        'phone',
        'delivery_type', // 'pickup' или 'delivery'
        'address',
        'created_at',
        'updated_at'
    ];

    protected $attributes = [
        'status' => 'pending' // Статус по умолчанию
    ];


    // Связь с пользователем
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}