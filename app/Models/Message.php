<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;


class Message extends Model
{
    protected $fillable = [
        'user_id',
        'admin_id',
        'message',
        'is_admin',
        'read_at'
    ];

    protected $dates = ['read_at'];

    

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}