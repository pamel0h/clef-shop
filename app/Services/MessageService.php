<?php

namespace App\Services;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use MongoDB\BSON\ObjectId;

class MessageService
{
    public function getMessages(Request $request)
    {
        $query = Message::where('user_id', Auth::id())
            ->orderBy('created_at', 'asc');

        if ($request->has('since') && $request->since) {
            try {
                $sinceId = new ObjectId($request->since);
                $query->where('_id', '>', $sinceId);
            } catch (\Exception $e) {
                return collect([]);
            }
        }

        return $query->get();
    }

    public function storeMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        return Message::create([
            'user_id' => Auth::id(),
            'message' => $request->message,
            'is_admin' => false,
        ]);
    }
}