<?php

namespace App\Services;

use App\Models\Item;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class CatalogExportService
{
    public function exportCatalog()
    {
        $filename = 'catalog_export_' . date('Y-m-d_H-i-s') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ];

        return Response::stream(function () {
            $handle = fopen('php://output', 'w');
            fwrite($handle, "\xEF\xBB\xBF");
            $columns = [
                'id', 'name', 'description', 'price', 'category', 'subcategory',
                'brand', 'images', 'specs', 'discount', 'created_at', 'updated_at',
            ];
            fputcsv($handle, $columns);

            $items = Item::all();
            foreach ($items as $item) {
                $row = [
                    (string) $item->_id,
                    $item->name ?? '',
                    json_encode($item->description ?? [], JSON_UNESCAPED_UNICODE),
                    $item->price ?? 0,
                    $item->category ?? '',
                    $item->subcategory ?? '',
                    $item->brand ?? '',
                    !empty($item->images) ? implode(',', $item->images) : '',
                    json_encode($item->specs ?? [], JSON_UNESCAPED_UNICODE),
                    $item->discount ?? 0,
                    $item->created_at ? $item->created_at->toIso8601String() : '',
                    $item->updated_at ? $item->updated_at->toIso8601String() : '',
                ];
                fputcsv($handle, $row);
            }
            fclose($handle);
        }, 200, $headers);
    }

    public function importCatalog($csvFile)
    {
        Log::info('CatalogExportService: Начало импорта', [
            'file' => $csvFile->getClientOriginalName(),
            'size' => $csvFile->getSize()
        ]);

        try {
            $handle = fopen($csvFile->getRealPath(), 'r');
            if ($handle === false) {
                throw new \Exception('Не удалось открыть CSV файл');
            }

            // Пропускаем BOM если есть
            $bom = fread($handle, 3);
            if ($bom !== "\xEF\xBB\xBF") {
                rewind($handle);
            }

            // Читаем заголовки
            $headers = fgetcsv($handle);
            Log::info('CSV заголовки:', ['headers' => $headers]);

            $expectedHeaders = [
                'id', 'name', 'description', 'price', 'category',
                'subcategory', 'brand', 'images', 'specs', 'discount',
                'created_at', 'updated_at'
            ];

            if ($headers !== $expectedHeaders) {
                fclose($handle);
                Log::error('Неверные заголовки CSV', [
                    'expected' => $expectedHeaders,
                    'received' => $headers
                ]);
                throw new \Exception('Неверный формат CSV файла. Ожидаются заголовки: ' . implode(', ', $expectedHeaders));
            }

            $imported = 0;
            $errors = [];
            $rowIndex = 1;

            while (($row = fgetcsv($handle)) !== false) {
                $rowIndex++;
                Log::info("Обработка строки $rowIndex", ['row' => $row]);

                try {
                    // Пропускаем пустые строки
                    if (empty(array_filter($row))) {
                        Log::info("Пропуск пустой строки $rowIndex");
                        continue;
                    }

                    $data = array_combine($headers, $row);
                    Log::info("Данные строки $rowIndex", ['data' => $data]);

                    // Валидация обязательных полей
                    if (empty($data['name']) || empty($data['price']) || empty($data['category'])) {
                        $error = "Строка $rowIndex: Отсутствуют обязательные поля (name, price, category)";
                        $errors[] = $error;
                        Log::warning($error);
                        continue;
                    }

                    // Очистка JSON-строк от лишнего экранирования
                    $cleanJsonString = function ($jsonString) {
                        $jsonString = str_replace('\"', '"', $jsonString);
                        $jsonString = str_replace('\\\\', '\\', $jsonString);
                        return $jsonString;
                    };

                    // Парсинг JSON-полей
                    $description = [];
                    if (!empty($data['description'])) {
                        $cleanedDescription = $cleanJsonString($data['description']);
                        $description = json_decode($cleanedDescription, true);
                        if (json_last_error() !== JSON_ERROR_NONE) {
                            $error = "Строка $rowIndex: Неверный формат JSON в поле description: " . json_last_error_msg();
                            $errors[] = $error;
                            Log::warning($error, ['raw' => $data['description'], 'cleaned' => $cleanedDescription]);
                            continue;
                        }
                    }

                    $specs = [];
                    if (!empty($data['specs'])) {
                        $cleanedSpecs = $cleanJsonString($data['specs']);
                        $specs = json_decode($cleanedSpecs, true);
                        if (json_last_error() !== JSON_ERROR_NONE) {
                            $error = "Строка $rowIndex: Неверный формат JSON в поле specs: " . json_last_error_msg();
                            $errors[] = $error;
                            Log::warning($error, ['raw' => $data['specs'], 'cleaned' => $cleanedSpecs]);
                            continue;
                        }
                    }

                    // Обработка изображения
                    $images = [];
                    if (!empty($data['images'])) {
                        $imageData = explode(',', $data['images'])[0]; // Берем только первое изображение
                        $imagePath = $this->processImage($imageData, $data['name'], $rowIndex, $errors);
                        if ($imagePath) {
                            $images = [$imagePath]; // Сохраняем только один путь
                        }
                    }

                    // Подготовка данных для модели
                    $itemData = [
                        'name' => $data['name'],
                        'description' => $description,
                        'price' => floatval($data['price']),
                        'category' => $data['category'],
                        'subcategory' => $data['subcategory'] ?? null,
                        'brand' => $data['brand'] ?? null,
                        'images' => $images,
                        'specs' => $specs,
                        'discount' => !empty($data['discount']) ? floatval($data['discount']) : 0,
                    ];

                    Log::info("Подготовленные данные для строки $rowIndex", ['itemData' => $itemData]);

                    // Если указан ID, проверяем существование товара
                    if (!empty($data['id'])) {
                        $existingItem = Item::find($data['id']);
                        if ($existingItem) {
                            $existingItem->update($itemData);
                            Log::info("Обновлен товар с ID {$data['id']} в строке $rowIndex");
                        } else {
                            $itemData['_id'] = $data['id'];
                            Item::create($itemData);
                            Log::info("Создан товар с ID {$data['id']} в строке $rowIndex");
                        }
                    } else {
                        Item::create($itemData);
                        Log::info("Создан новый товар в строке $rowIndex");
                    }

                    $imported++;
                } catch (\Exception $e) {
                    $error = "Строка $rowIndex: Ошибка - {$e->getMessage()}";
                    $errors[] = $error;
                    Log::error("Ошибка импорта в строке $rowIndex", [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                }
            }

            fclose($handle);

            Log::info('Импорт завершен', [
                'imported' => $imported,
                'errors_count' => count($errors)
            ]);

            return [
                'success' => true,
                'imported' => $imported,
                'errors' => $errors,
            ];

        } catch (\Exception $e) {
            Log::error('Ошибка импорта каталога', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'imported' => 0,
                'errors' => [],
            ];
        }
    }

    protected function processImage($imageData, $itemName, $rowIndex, &$errors)
    {
        try {
            $storagePath = 'product_images'; // Директория в storage

            // Вариант 1: Относительный путь
            // Если это не URL и не Base64, возвращаем путь без изменений
            if (!filter_var($imageData, FILTER_VALIDATE_URL) && !preg_match('/^data:image\/(jpeg|png|gif);base64,/', $imageData)) {
                Log::info("Строка $rowIndex: Используется указанный относительный путь", ['path' => $imageData]);
                return $imageData;
            }

            // Вариант 2: Внешний URL
            if (filter_var($imageData, FILTER_VALIDATE_URL)) {
                $response = Http::timeout(10)->withOptions(['verify' => false])->get($imageData);
                if ($response->successful()) {
                    $imageContent = $response->body();
                    $mimeType = $response->header('Content-Type');
                    $extension = $this->getExtensionFromMimeType($mimeType);

                    if ($extension && in_array($extension, ['jpg', 'jpeg', 'png', 'gif'])) {
                        $filename = Str::slug($itemName) . '_' . uniqid() . '.' . $extension;
                        $relativePath = "$storagePath/$filename";
                        Storage::disk('public')->put($relativePath, $imageContent);
                        Log::info("Строка $rowIndex: Изображение загружено из URL", ['url' => $imageData, 'saved_path' => $relativePath]);
                        return $relativePath;
                    } else {
                        $error = "Строка $rowIndex: Неверный формат изображения по URL: $imageData";
                        $errors[] = $error;
                        Log::warning($error);
                        return null;
                    }
                } else {
                    $error = "Строка $rowIndex: Ошибка загрузки изображения по URL: $imageData";
                    $errors[] = $error;
                    Log::warning($error);
                    return null;
                }
            }

            // Вариант 3: Base64
            if (preg_match('/^data:image\/(jpeg|png|gif);base64,/', $imageData, $matches)) {
                $imageType = $matches[1];
                $base64String = preg_replace('/^data:image\/\w+;base64,/', '', $imageData);
                $imageContent = base64_decode($base64String);

                if ($imageContent !== false) {
                    $filename = Str::slug($itemName) . '_' . uniqid() . '.' . $imageType;
                    $relativePath = "$storagePath/$filename";
                    Storage::disk('public')->put($relativePath, $imageContent);
                    Log::info("Строка $rowIndex: Изображение сохранено из Base64", ['saved_path' => $relativePath]);
                    return $relativePath;
                } else {
                    $error = "Строка $rowIndex: Неверный формат Base64 данных";
                    $errors[] = $error;
                    Log::warning($error);
                    return null;
                }
            }

            // Если формат не распознан (не должно произойти, так как уже проверили все случаи)
            $error = "Строка $rowIndex: Неверный формат данных изображения";
            $errors[] = $error;
            Log::warning($error, ['imageData' => $imageData]);
            return null;
        } catch (\Exception $e) {
            $error = "Строка $rowIndex: Ошибка обработки изображения: {$e->getMessage()}";
            $errors[] = $error;
            Log::error($error, ['trace' => $e->getTraceAsString()]);
            return null;
        }
    }

    protected function getExtensionFromMimeType($mimeType)
    {
        $mimeToExtension = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
        ];

        return $mimeToExtension[$mimeType] ?? null;
    }
}