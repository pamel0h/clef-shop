<?php

namespace App\Services;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Cache;

class TranslationService
{

    
    public function storeTranslation(string $namespace, string $key, string $ruTranslation, string $enTranslation, ?string $parentCategory = null, bool $allowTemporary = false): void
    {
        $ruPath = public_path('locales/ru/translation.json');
        $enPath = public_path('locales/en/translation.json');

        $ruTranslations = File::exists($ruPath) ? json_decode(File::get($ruPath), true) : [];
        $enTranslations = File::exists($enPath) ? json_decode(File::get($enPath), true) : [];

        if (!isset($ruTranslations[$namespace])) {
            $ruTranslations[$namespace] = [];
            $enTranslations[$namespace] = [];
        }

        if ($namespace === 'subcategory' && $parentCategory) {
            if (!isset($ruTranslations[$namespace][$parentCategory])) {
                $ruTranslations[$namespace][$parentCategory] = [];
                $enTranslations[$namespace][$parentCategory] = [];
            }
            if (isset($ruTranslations[$namespace][$parentCategory][$key]) && !$allowTemporary) {
                throw new \Exception("Key '$key' already exists in $namespace.$parentCategory");
            }
            $ruTranslations[$namespace][$parentCategory][$key] = $ruTranslation;
            $enTranslations[$namespace][$parentCategory][$key] = $enTranslation;
        } else {
            if (isset($ruTranslations[$namespace][$key]) && !$allowTemporary) {
                throw new \Exception("Key '$key' already exists in $namespace");
            }
            $ruTranslations[$namespace][$key] = $ruTranslation;
            $enTranslations[$namespace][$key] = $enTranslation;
        }

        File::put($ruPath, json_encode($ruTranslations, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        File::put($enPath, json_encode($enTranslations, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

        Cache::put('translations_last_updated', now()->toIso8601String());
    }

    public function translationExists(string $namespace, string $key, ?string $parentCategory = null): bool
    {
        $ruPath = public_path('locales/ru/translation.json');
        $ruTranslations = File::exists($ruPath) ? json_decode(File::get($ruPath), true) : [];

        if ($namespace === 'subcategory' && $parentCategory) {
            return isset($ruTranslations[$namespace][$parentCategory][$key]);
        }
        return isset($ruTranslations[$namespace][$key]);
    }
}