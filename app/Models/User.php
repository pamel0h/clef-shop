<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Model implements AuthenticatableContract
{
    use Authenticatable, Notifiable, HasApiTokens;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    // Константы ролей
    const ROLE_USER = 'user';
    const ROLE_ADMIN = 'admin';
    // const ROLE_SUPER_ADMIN = 'super_admin';

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',    
        'address',
        'role'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $attributes = [
        'role' => self::ROLE_USER,
    ];

    // Методы для проверки ролей
    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    // public function isSuperAdmin(): bool
    // {
    //     return $this->role === self::ROLE_SUPER_ADMIN;
    // }

    public function isUser(): bool
    {
        return $this->role === self::ROLE_USER;
    }

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    // Метод для получения всех доступных ролей
    public static function getRoles(): array
    {
        return [
            self::ROLE_USER => 'Пользователь',
            self::ROLE_ADMIN => 'Администратор',
            // self::ROLE_SUPER_ADMIN => 'Супер администратор'
        ];
    }
}