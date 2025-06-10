<?php

namespace App\Formatters;

use App\Models\User;

class UserFormatter
{
    public static function format(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'address' => $user->address,
            'role' => $user->role,
        ];
    }

    public static function formatCollection($users): array
    {
        return $users->map(fn ($user) => self::format($user))->toArray();
    }
}