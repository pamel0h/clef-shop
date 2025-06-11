<?php

namespace App\Services;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use MongoDB\BSON\ObjectId;

class AdminMessageService
{
    public function getConversations()
    {
        $allMessages = Message::all();
        Log::info('All messages count: ' . $allMessages->count());

        $userIds = $allMessages->pluck('user_id')->map(function ($id) {
            return is_string($id) ? new ObjectId($id) : $id;
        })->filter()->unique()->values();
        Log::info('User IDs with messages (after pluck and cast): ', $userIds->toArray());

        $users = User::whereIn('_id', $userIds)->get();
        Log::info('Found users: ' . $users->count());

        if ($users->isEmpty()) {
            return collect([]);
        }

        return $users->map(function ($user) {
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
    }

    public function getMessagesForUser(Request $request, User $user)
    {
        $query = Message::where('user_id', $user->id)
            ->orderBy('created_at', 'asc');

        if ($request->has('since') && $request->since) {
            try {
                $sinceId = new ObjectId($request->since);
                $query->where('_id', '>', $sinceId);
                Log::info('Fetching messages since ID: ' . $request->since . ' for user: ' . $user->id);
            } catch (\Exception $e) {
                Log::error('Invalid ObjectId format: ' . $request->since);
                return [
                    'user' => $user,
                    'messages' => [],
                ];
            }
        }

        $messages = $query->get();
        Log::info('Found messages count: ' . $messages->count() . ' for user: ' . $user->id . 
                 ($request->has('since') ? ' (incremental)' : ' (full)'));

        if (!$request->has('since')) {
            Message::where('user_id', $user->id)
                ->where('is_admin', false)
                ->whereNull('read_at')
                ->update(['read_at' => now()]);
        }

        return [
            'user' => $user,
            'messages' => $messages,
        ];
    }

    public function storeMessage(Request $request, User $user)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        return Message::create([
            'user_id' => $user->id,
            'admin_id' => auth()->id(),
            'message' => $request->message,
            'is_admin' => true,
        ]);
    }

    public function markMessagesAsRead(Request $request, User $user)
    {
        $request->validate([
            'message_ids' => 'required|array',
            'message_ids.*' => 'string',
        ]);

        try {
            $messageIds = array_map(function ($id) {
                return new ObjectId($id);
            }, $request->message_ids);

            Message::where('user_id', $user->id)
                ->whereIn('_id', $messageIds)
                ->where('is_admin', false)
                ->whereNull('read_at')
                ->update(['read_at' => now()]);

            Log::info('Marked messages as read for user: ' . $user->id, ['message_ids' => $request->message_ids]);

            return ['status' => 'success'];
        } catch (\Exception $e) {
            Log::error('Error marking messages as read: ' . $e->getMessage());
            throw new \Exception('Invalid message IDs', 400);
        }
    }
}