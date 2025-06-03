<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use MongoDB\BSON\UTCDateTime;

class MessageController extends Controller
{


    public function store(Request $request)
    {
        $request->validate([
            'userId' => 'required',
            'message' => 'required|string|max:1000',
        ]);

        $message = new Message();
        $message->user_id = $request->userId;
        $message->message = $request->message;
        $message->created_at = new UTCDateTime(now());
        $message->save();

        return response()->json(['message' => 'Message sent successfully'], 201);
    }

    public function index(Request $request)
    {
        // Проверка авторизации
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            // Получаем сообщения пользователя с пагинацией
            $messages = Message::where('user_id', $user->id)
                ->orderBy('created_at', 'desc') // Сортировка по дате создания (новые сверху)
                ->paginate(10); 

           
            $formattedMessages = $messages->map(function ($message) {
                return [
                    'id' => (string) $message->_id, // Преобразуем ObjectId в строку
                    'user_id' => $message->user_id,
                    'message' => $message->message,
                    'created_at' => $message->created_at->toIso8601String(), // Формат ISO для дат
                    'updated_at' => $message->updated_at->toIso8601String(),
                ];
            });

           
            return response()->json([
                'messages' => $formattedMessages,
                'pagination' => [
                    'total' => $messages->total(),
                    'per_page' => $messages->perPage(),
                    'current_page' => $messages->currentPage(),
                    'last_page' => $messages->lastPage(),
                ],
            ], 200);
        } catch (\Exception $e) {
         
            Log::error('Failed to get messages', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Failed to retrieve messages'], 500);
        }
    }
}