<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Dialog extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'dialogs';

    protected $fillable = ['user_id', 'admin_id', 'messages'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}