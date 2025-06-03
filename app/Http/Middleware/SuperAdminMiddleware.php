<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class SuperAdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Необходима авторизация'
            ], 401);
        }

        if (!Auth::user()->isSuperAdmin()) {
            return response()->json([
                'message' => 'Доступ запрещен. Требуются права супер администратора'
            ], 403);
        }

        return $next($request);
    }
}