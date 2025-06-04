<?php
// app/Http/Controllers/TranslationController.php

namespace App\Http\Controllers;

use App\Http\Requests\TranslationStoreRequest;
use App\Services\TranslationService;
use Illuminate\Http\JsonResponse;

class TranslationController extends Controller
{
    protected $translationService;

    public function __construct(TranslationService $translationService)
    {
        $this->translationService = $translationService;
    }

    public function store(TranslationStoreRequest $request): JsonResponse
    {
        try {
            $this->translationService->storeTranslation(
                $request->input('namespace'),
                $request->input('key'),
                $request->input('ru'),
                $request->input('en')
            );

            return response()->json(['message' => 'Translations saved successfully!'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422); 
        }
    }
}