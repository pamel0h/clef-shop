<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = User::where('email', $request->email)->first();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }
    
    public function updateProfile(Request $request)
    {
        $user =  $request->user();
        // Валидация только тех полей, которые были отправлены
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,',
            'phone' => 'sometimes|string|nullable|max:20',
            'address' => 'sometimes|string|nullable|max:255',
            'password' => 'sometimes|string|min:8',
        ]);

        /// Если пароль передан, хешируем его
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        // Проверяем, что есть непустые значения для обновления
        if (empty($validated)) {
            return response()->json([
                'message' => 'No valid fields provided for update'
            ], 422);
        }

        // Массовое обновление только переданных полей
        $user->update($validated);


        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }
}