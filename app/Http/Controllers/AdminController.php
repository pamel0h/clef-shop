<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    // Получить всех пользователей
    public function getUsers(Request $request)
    {
        $query = User::query();

        // Фильтрация по роли
        if ($request->has('role') && $request->role !== '') {
            $query->where('role', $request->role);
        }

        // Поиск по имени или email
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate($request->get('per_page', 15));

        return response()->json($users);
    }

    // Получить конкретного пользователя
    public function getUser($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    // Создать пользователя
    public function createUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'role' => ['required', Rule::in(array_keys(User::getRoles()))]
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'address' => $request->address,
            'role' => $request->role,
        ]);

        return response()->json([
            'message' => 'Пользователь успешно создан',
            'user' => $user
        ], 201);
    }

    // Обновить пользователя
    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'sometimes|nullable|string|min:8',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'role' => ['sometimes', 'required', Rule::in(array_keys(User::getRoles()))]
        ]);

        $updateData = $request->only(['name', 'email', 'phone', 'address', 'role']);
        
        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        return response()->json([
            'message' => 'Пользователь успешно обновлен',
            'user' => $user
        ]);
    }

    // Удалить пользователя
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        
        // Защита от удаления самого себя
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'Нельзя удалить самого себя'
            ], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'Пользователь успешно удален'
        ]);
    }

    // Получить статистику
    public function getStats()
    {
        $stats = [
            'total_users' => User::count(),
            'users_by_role' => [],
            'recent_users' => User::orderBy('created_at', 'desc')->limit(5)->get()
        ];

        foreach (User::getRoles() as $role => $label) {
            $stats['users_by_role'][$role] = [
                'count' => User::where('role', $role)->count(),
                'label' => $label
            ];
        }

        return response()->json($stats);
    }
}