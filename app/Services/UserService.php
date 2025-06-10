<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class UserService
{
    
    public function getUsers(): array
    {
        try {
            $users = User::all()->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'address' => $user->address,
                    'role' => $user->role,
                ];
            })->toArray();

            return ['users' => $users];
        } catch (\Exception $e) {
            Log::error('Error fetching users: ' . $e->getMessage());
            throw ValidationException::withMessages([
                'error' => __('admin_users.users_error'),
            ]);
        }
    }

    
    public function getUser(string $id): array
    {
        try {
            $user = User::findOrFail($id);
            return [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'address' => $user->address,
                    'role' => $user->role,
                ],
            ];
        } catch (\Exception $e) {
            Log::error('Error fetching user: ' . $e->getMessage());
            throw ValidationException::withMessages([
               'error' => 'Failed to fetch users.',
            ]);
        }
    }

    
    public function createUser(array $data): array
    {
        try {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'phone' => $data['phone'] ?? null,
                'address' => $data['address'] ?? null,
                'role' => $data['role'] ?? 'user',
            ]);

            return [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'address' => $user->address,
                    'role' => $user->role,
                ],
            ];
        } catch (\Exception $e) {
            Log::error('Error creating user: ' . $e->getMessage());
            throw ValidationException::withMessages([
                'error' => 'Failed to create user.',
            ]);
        }
    }

    
    public function updateUser(string $id, array $data): array
    {
        try {
            $user = User::findOrFail($id);

            $updateData = [
                'name' => $data['name'] ?? $user->name,
                'email' => $data['email'] ?? $user->email,
                'phone' => $data['phone'] ?? $user->phone,
                'address' => $data['address'] ?? $user->address,
                'role' => $data['role'] ?? $user->role,
            ];

            if (isset($data['password'])) {
                $updateData['password'] = Hash::make($data['password']);
            }

            $user->update($updateData);

            return [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'address' => $user->address,
                    'role' => $user->role,
                ],
            ];
        } catch (\Exception $e) {
            Log::error('Error updating user: ' . $e->getMessage());
            throw ValidationException::withMessages([
                'error' => 'Failed to update user.',
            ]);
        }
    }

    
    public function deleteUser(string $id): void
    {
        try {
            $currentUserId = auth()->id();
            Log::debug('Deleting user', ['user_id' => $id, 'current_user_id' => $currentUserId]);
            if ((string) $currentUserId === (string) $id) {
                throw ValidationException::withMessages([
                    'error' => 'You cannot delete yourself!',
                ]);
            }
            $user = User::findOrFail($id);
            $user->delete();
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('Error deleting user: ' . $e->getMessage(), ['user_id' => $id]);
            throw ValidationException::withMessages([
                'error' => 'Failed to delete user.',
            ]);
        }
    }
}