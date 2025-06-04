<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class TranslationController extends Controller
{
    public function store(Request $request)
    {
        // Валидация данных
        $validator = Validator::make($request->all(), [
            'namespace' => 'required|string|in:specs,categories,subcategories',
            'key' => 'required|string',
            'ru' => 'required|string',
            'en' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $namespace = $request->input('namespace');
        $key = $request->input('key');
        $ruTranslation = $request->input('ru');
        $enTranslation = $request->input('en');

        // Пути к файлам локализации
        $ruPath = public_path('locales/ru/translation.json');
        $enPath = public_path('locales/en/translation.json');

        // Получение существующих переводов
        $ruTranslations = File::exists($ruPath) ? json_decode(File::get($ruPath), true) : [];
        $enTranslations = File::exists($enPath) ? json_decode(File::get($enPath), true) : [];

        // Инициализация namespace, если он отсутствует
        if (!isset($ruTranslations[$namespace])) {
            $ruTranslations[$namespace] = [];
        }
        if (!isset($enTranslations[$namespace])) {
            $enTranslations[$namespace] = [];
        }

        // Проверка уникальности ключа
        if (isset($ruTranslations[$namespace][$key])) {
            return response()->json(['error' => "Key '$key' already exists in $namespace"], 422);
        }

        // Добавление новых переводов
        $ruTranslations[$namespace][$key] = $ruTranslation;
        $enTranslations[$namespace][$key] = $enTranslation;

        // Запись в файлы
        File::put($ruPath, json_encode($ruTranslations, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        File::put($enPath, json_encode($enTranslations, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

        // Обновляем метку времени переводов в кэше
        Cache::put('translations_last_updated', now()->toIso8601String());

        return response()->json(['message' => 'Translations saved successfully!'], 200);
    }
}