<?php

namespace App\Http\Controllers;

use App\Services\AdminMessageService;
use App\Models\User;
use Illuminate\Http\Request;

class AdminMessageController extends Controller
{
    public function __construct(private AdminMessageService $adminMessageService)
    {
    }

    public function index()
    {
        $conversations = $this->adminMessageService->getConversations();
        return response()->json($conversations);
    }

    public function show(Request $request, User $user)
    {
        $response = $this->adminMessageService->getMessagesForUser($request, $user);
        return response()->json($response);
    }

    public function store(Request $request, User $user)
    {
        $message = $this->adminMessageService->storeMessage($request, $user);
        return response()->json($message, 201);
    }

    public function markRead(Request $request, User $user)
    {
        try {
            $response = $this->adminMessageService->markMessagesAsRead($request, $user);
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    }
}