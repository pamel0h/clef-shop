<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AdminMessageController extends Controller
{
    public function index(Request $request)
    {

        $allMessages = Message::all();
        Log::info('All messages count: ' . $allMessages->count());

        $messages = Message::all();
        Log::info('All messages with user_id (raw): ', $messages->pluck('user_id')->toArray());

        $userIds = Message::all()->pluck('user_id')->map(function ($id) {
            return is_string($id) ? new \MongoDB\BSON\ObjectId($id) : $id;
        })->filter()->unique()->values();
        Log::info('User IDs with messages (after pluck and cast): ', $userIds->toArray());

        $users = User::whereIn('_id', $userIds)->get();
        Log::info('Found users: ' . $users->count());

        if ($users->isEmpty()) {
            return response()->json([]);
        }

        $conversations = $users->map(function ($user) {
            $lastMessage = Message::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->first();

            $unreadCount = Message::where('user_id', $user->id)
                ->where('is_admin', false)
                ->whereNull('read_at')
                ->count();

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'last_message' => $lastMessage ? $lastMessage->message : null,
                'last_message_time' => $lastMessage ? $lastMessage->created_at : null,
                'unread_count' => $unreadCount,
            ];
        });

        return response()->json($conversations);
    }

    public function show(User $user)
    {
        $messages = Message::where('user_id', $user->id)
            ->orderBy('created_at', 'asc')
            ->get();

        Message::where('user_id', $user->id)
            ->where('is_admin', false)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'user' => $user,
            'messages' => $messages,
        ]);
    }

    public function store(Request $request, User $user)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $message = Message::create([
            'user_id' => $user->id,
            'admin_id' => Auth::id(),
            'message' => $request->message,
            'is_admin' => true,
        ]);

        return response()->json($message, 201);
    }
}