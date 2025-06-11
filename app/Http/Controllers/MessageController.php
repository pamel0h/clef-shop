<?php

namespace App\Http\Controllers;

use App\Services\MessageService;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function __construct(private MessageService $messageService)
    {
    }

    public function index(Request $request)
    {
        $messages = $this->messageService->getMessages($request);
        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $message = $this->messageService->storeMessage($request);
        return response()->json($message, 201);
    }
}