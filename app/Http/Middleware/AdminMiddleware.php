<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Необходима авторизация'
            ], 401);
        }

        if (!Auth::user()->isAdmin()) {
            return response()->json([
                'message' => 'Доступ запрещен. Требуются права администратора'
            ], 403);
        }

        return $next($request);
    }
}
