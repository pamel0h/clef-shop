<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Services\UserService;

class AdminUserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    
    public function getUsers()
    {
        return response()->json($this->userService->getUsers());
    }

   
    public function getUser(string $id)
    {
        return response()->json($this->userService->getUser($id));
    }

    
    public function createUser(CreateUserRequest $request)
    {
        return response()->json($this->userService->createUser($request->validated()), 201);
    }

   
    public function updateUser(UpdateProfileRequest $request, string $id)
    {
        return response()->json($this->userService->updateUser($id, $request->validated()));
    }

   
    public function deleteUser(string $id)
    {
        $this->userService->deleteUser($id);
        return response()->json(['message' => 'User deleted successfully.']);
    }
}