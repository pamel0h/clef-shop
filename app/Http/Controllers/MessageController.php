<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $query = Message::where('user_id', Auth::id())
            ->orderBy('created_at', 'asc');
            
        if ($request->has('since') && $request->since) {
            try {
                $sinceId = new \MongoDB\BSON\ObjectId($request->since);
                $query->where('_id', '>', $sinceId);
            } catch (\Exception $e) {
                return response()->json([]);
            }
        }
            
        $messages = $query->get();
        
        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $message = Message::create([
            'user_id' => Auth::id(),
            'message' => $request->message,
            'is_admin' => false,
        ]);

        return response()->json($message, 201);
    }
}
