<?php

namespace App\Services;

use App\Models\User;
use App\Formatters\UserFormatter;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class UserService
{
    private function handleException(\Exception $e, string $message, array $context = []): void
    {
        Log::error($message . ': ' . $e->getMessage(), $context);
        throw ValidationException::withMessages(['error' => $message]);
    }

 public function getUsers(): array
    {
        try {
            $users = User::all();
            return ['users' => UserFormatter::formatCollection($users)];
        } catch (\Exception $e) {
            $this->handleException($e,'Failed to fetch users');
        }
    }

    public function getUser(string $id): array
    {
        try {
            $user = User::findOrFail($id);
            return ['user' => UserFormatter::format($user)];
        } catch (\Exception $e) {
            $this->handleException($e, 'Failed to fetch user', ['user_id' => $id]);
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

            return ['user' => UserFormatter::format($user)];
        } catch (\Exception $e) {
            $this->handleException($e, 'Failed to create user', ['data' => $data]);
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

            return ['user' => UserFormatter::format($user)];
        } catch (\Exception $e) {
            $this->handleException($e, 'Failed to update user', ['user_id' => $id, 'data' => $data]);
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
            $this->handleException($e, 'Failed to delete user', ['user_id' => $id]);
        }
    }

    
}