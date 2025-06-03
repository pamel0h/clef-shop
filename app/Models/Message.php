<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Support\Str;


class Message extends Model
{
    protected $connection = 'mongodb'; // Подключение к MongoDB
    protected $collection = 'messages'; // Имя коллекции в MongoDB
    protected $fillable = ['user_id', 'message', 'created_at', 'updated_at'];
    
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', '_id');
    }
}
