<?php

// namespace App\Services;

// use App\Models\Item;
// use Illuminate\Support\Facades\Response;
// use Illuminate\Support\Facades\Log;
// use Illuminate\Support\Facades\Storage;
// use Illuminate\Support\Facades\Http;
// use Illuminate\Support\Str;

// class CatalogExportService
// {
//     public function exportCatalog()
//     {
//         $filename = 'catalog_export_' . date('Y-m-d_H-i-s') . '.csv';
//         $headers = [
//             'Content-Type' => 'text/csv; charset=utf-8',
//             'Content-Disposition' => "attachment; filename=\"$filename\"",
//             'Cache-Control' => 'no-cache, no-store, must-revalidate',
//             'Pragma' => 'no-cache',
//             'Expires' => '0',
//         ];

//         return Response::stream(function () {
//             $handle = fopen('php://output', 'w');
//             fwrite($handle, "\xEF\xBB\xBF");
//             $columns = [
//                 'id', 'name', 'description', 'price', 'category', 'subcategory',
//                 'brand', 'images', 'specs', 'discount', 'created_at', 'updated_at',
//             ];
//             fputcsv($handle, $columns);

//             $items = Item::all();
//             foreach ($items as $item) {
//                 $row = [
//                     (string) $item->_id,
//                     $item->name ?? '',
//                     json_encode($item->description ?? [], JSON_UNESCAPED_UNICODE),
//                     $item->price ?? 0,
//                     $item->category ?? '',
//                     $item->subcategory ?? '',
//                     $item->brand ?? '',
//                     !empty($item->images) ? implode(',', $item->images) : '',
//                     json_encode($item->specs ?? [], JSON_UNESCAPED_UNICODE),
//                     $item->discount ?? 0,
//                     $item->created_at ? $item->created_at->toIso8601String() : '',
//                     $item->updated_at ? $item->updated_at->toIso8601String() : '',
//                 ];
//                 fputcsv($handle, $row);
//             }
//             fclose($handle);
//         }, 200, $headers);
//     }

//     public function importCatalog($csvFile)
//     {
//         Log::info('CatalogExportService: Начало импорта', [
//             'file' => $csvFile->getClientOriginalName(),
//             'size' => $csvFile->getSize()
//         ]);

//         try {
//             $handle = fopen($csvFile->getRealPath(), 'r');
//             if ($handle === false) {
//                 throw new \Exception('Не удалось открыть CSV файл');
//             }

//             // Пропускаем BOM если есть
//             $bom = fread($handle, 3);
//             if ($bom !== "\xEF\xBB\xBF") {
//                 rewind($handle);
//             }

//             // Читаем заголовки
//             $headers = fgetcsv($handle);
//             Log::info('CSV заголовки:', ['headers' => $headers]);

//             $expectedHeaders = [
//                 'id', 'name', 'description', 'price', 'category',
//                 'subcategory', 'brand', 'images', 'specs', 'discount',
//                 'created_at', 'updated_at'
//             ];

//             if ($headers !== $expectedHeaders) {
//                 fclose($handle);
//                 Log::error('Неверные заголовки CSV', [
//                     'expected' => $expectedHeaders,
//                     'received' => $headers
//                 ]);
//                 throw new \Exception('Неверный формат CSV файла. Ожидаются заголовки: ' . implode(', ', $expectedHeaders));
//             }

//             $imported = 0;
//             $errors = [];
//             $rowIndex = 1;

//             while (($row = fgetcsv($handle)) !== false) {
//                 $rowIndex++;
//                 Log::info("Обработка строки $rowIndex", ['row' => $row]);

//                 try {
//                     // Пропускаем пустые строки
//                     if (empty(array_filter($row))) {
//                         Log::info("Пропуск пустой строки $rowIndex");
//                         continue;
//                     }

//                     $data = array_combine($headers, $row);
//                     Log::info("Данные строки $rowIndex", ['data' => $data]);

//                     // Валидация обязательных полей
//                     if (empty($data['name']) || empty($data['price']) || empty($data['category'])) {
//                         $error = "Строка $rowIndex: Отсутствуют обязательные поля (name, price, category)";
//                         $errors[] = $error;
//                         Log::warning($error);
//                         continue;
//                     }

//                     // Очистка JSON-строк от лишнего экранирования
//                     $cleanJsonString = function ($jsonString) {
//                         $jsonString = str_replace('\"', '"', $jsonString);
//                         $jsonString = str_replace('\\\\', '\\', $jsonString);
//                         return $jsonString;
//                     };

//                     // Парсинг JSON-полей
//                     $description = [];
//                     if (!empty($data['description'])) {
//                         $cleanedDescription = $cleanJsonString($data['description']);
//                         $description = json_decode($cleanedDescription, true);
//                         if (json_last_error() !== JSON_ERROR_NONE) {
//                             $error = "Строка $rowIndex: Неверный формат JSON в поле description: " . json_last_error_msg();
//                             $errors[] = $error;
//                             Log::warning($error, ['raw' => $data['description'], 'cleaned' => $cleanedDescription]);
//                             continue;
//                         }
//                     }

//                     $specs = [];
//                     if (!empty($data['specs'])) {
//                         $cleanedSpecs = $cleanJsonString($data['specs']);
//                         $specs = json_decode($cleanedSpecs, true);
//                         if (json_last_error() !== JSON_ERROR_NONE) {
//                             $error = "Строка $rowIndex: Неверный формат JSON в поле specs: " . json_last_error_msg();
//                             $errors[] = $error;
//                             Log::warning($error, ['raw' => $data['specs'], 'cleaned' => $cleanedSpecs]);
//                             continue;
//                         }
//                     }

//                     // Обработка изображения
//                     $images = [];
//                     if (!empty($data['images'])) {
//                         $imageData = explode(',', $data['images'])[0]; // Берем только первое изображение
//                         $imagePath = $this->processImage($imageData, $data['name'], $rowIndex, $errors);
//                         if ($imagePath) {
//                             $images = [$imagePath]; // Сохраняем только один путь
//                         }
//                     }

//                     // Подготовка данных для модели
//                     $itemData = [
//                         'name' => $data['name'],
//                         'description' => $description,
//                         'price' => floatval($data['price']),
//                         'category' => $data['category'],
//                         'subcategory' => $data['subcategory'] ?? null,
//                         'brand' => $data['brand'] ?? null,
//                         'images' => $images,
//                         'specs' => $specs,
//                         'discount' => !empty($data['discount']) ? floatval($data['discount']) : 0,
//                     ];

//                     Log::info("Подготовленные данные для строки $rowIndex", ['itemData' => $itemData]);

//                     // Если указан ID, проверяем существование товара
//                     if (!empty($data['id'])) {
//                         $existingItem = Item::find($data['id']);
//                         if ($existingItem) {
//                             $existingItem->update($itemData);
//                             Log::info("Обновлен товар с ID {$data['id']} в строке $rowIndex");
//                         } else {
//                             $itemData['_id'] = $data['id'];
//                             Item::create($itemData);
//                             Log::info("Создан товар с ID {$data['id']} в строке $rowIndex");
//                         }
//                     } else {
//                         Item::create($itemData);
//                         Log::info("Создан новый товар в строке $rowIndex");
//                     }

//                     $imported++;
//                 } catch (\Exception $e) {
//                     $error = "Строка $rowIndex: Ошибка - {$e->getMessage()}";
//                     $errors[] = $error;
//                     Log::error("Ошибка импорта в строке $rowIndex", [
//                         'error' => $e->getMessage(),
//                         'trace' => $e->getTraceAsString()
//                     ]);
//                 }
//             }

//             fclose($handle);

//             Log::info('Импорт завершен', [
//                 'imported' => $imported,
//                 'errors_count' => count($errors)
//             ]);

//             return [
//                 'success' => true,
//                 'imported' => $imported,
//                 'errors' => $errors,
//             ];

//         } catch (\Exception $e) {
//             Log::error('Ошибка импорта каталога', [
//                 'error' => $e->getMessage(),
//                 'trace' => $e->getTraceAsString()
//             ]);
//             return [
//                 'success' => false,
//                 'error' => $e->getMessage(),
//                 'imported' => 0,
//                 'errors' => [],
//             ];
//         }
//     }

//     protected function processImage($imageData, $itemName, $rowIndex, &$errors)
//     {
//         try {
//             // Относительный путь - возвращаем как есть
//             if (!filter_var($imageData, FILTER_VALIDATE_URL) && !preg_match('/^data:image\/(jpeg|png|gif|webp);base64,/', $imageData)) {
//                 return $imageData;
//             }
            
//             // URL - возвращаем как есть
//             if (filter_var($imageData, FILTER_VALIDATE_URL)) {
//                 return $imageData;
//             }
            
//             // Base64 - возвращаем как есть
//             if (preg_match('/^data:image\/(jpeg|png|gif|webp);base64,/', $imageData)) {
//                 return $imageData;
//             }
            
//             return null;
            
//         } catch (\Exception $e) {
//             $errors[] = "Строка $rowIndex: Ошибка обработки изображения: {$e->getMessage()}";
//             return null;
//         }
//     }
    
//     protected function getExtensionFromMimeType($mimeType)
//     {
//         $mimeToExtension = [
//             'image/jpeg' => 'jpg',
//             'image/jpg' => 'jpg',
//             'image/png' => 'png',
//             'image/gif' => 'gif',
//             'image/webp' => 'webp',
//         ];
    
//         return $mimeToExtension[strtolower($mimeType)] ?? null;
//     }
    
//     /**
//      * Попытка определить расширение файла из URL
//      */
//     protected function getExtensionFromUrl($url)
//     {
//         $path = parse_url($url, PHP_URL_PATH);
//         if ($path) {
//             $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
//             if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
//                 return $extension === 'jpeg' ? 'jpg' : $extension;
//             }
//         }
//         return null;
//     }
// }

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
                        $imageData = $data['images'];
                        
                        // Если это НЕ base64 и НЕ URL, то разделяем по запятой для множественных файлов
                        if (!preg_match('/^data:image\//', $imageData) && !filter_var($imageData, FILTER_VALIDATE_URL)) {
                            $imageData = explode(',', $imageData)[0]; // Берем только первое изображение
                        }
                        
                        $imagePath = $this->processImage($imageData, $data['name'], $rowIndex, $errors);
                        if ($imagePath) {
                            $images = [$imagePath];
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
            Log::info("processImage начало", ['row' => $rowIndex, 'imageData' => substr($imageData, 0, 50)]);
            // Проверяем, является ли это base64-строкой
            if (preg_match('/^data:image\/(jpeg|png|gif|webp);base64,/', $imageData, $matches)) {
                Log::info("Это base64 изображение", ['row' => $rowIndex]);
                $mimeType = $matches[1];
                $imageContent = base64_decode(preg_replace('/^data:image\/\w+;base64,/', '', $imageData));
                if ($imageContent === false) {
                    throw new \Exception("Не удалось декодировать base64-изображение");
                }
    
                // Генерируем уникальное имя файла
                $extension = $mimeType === 'jpeg' ? 'jpg' : $mimeType;
                $fileName = Str::slug($itemName) . '_' . uniqid() . '.' . $extension;
    
                // Сохраняем файл в storage/product_images
                if (!Storage::disk('public')->put('product_images/' . $fileName, $imageContent)) {
                    throw new \Exception("Не удалось сохранить файл");
                }
                
                Log::info("Base64 сохранено", ['fileName' => $fileName]);
                return $fileName;
            }
    
            // Проверяем, является ли это URL
            if (filter_var($imageData, FILTER_VALIDATE_URL)) {
                // Загружаем изображение по URL
                // $response = Http::withOptions([
                //     'verify' => false, // Отключаем проверку SSL сертификата
                // ])->get($imageData);
                
                // if ($response->successful()) {
                //     $imageContent = $response->body();
                //     $extension = $this->getExtensionFromUrl($imageData);
                //     if (!$extension) {
                //         throw new \Exception("Не удалось определить расширение изображения из URL");
                //     }
    
                //     $fileName = Str::slug($itemName) . '_' . uniqid() . '.' . $extension;
                //     Storage::disk('public')->put('product_images/' . $fileName, $imageContent);
                //     Log::info("Изображение по URL сохранено", [
                //         'row' => $rowIndex,
                //         'fileName' => $fileName,
                //         'url' => $imageData
                //     ]);
    
                    // return $fileName; // Возвращаем имя сохраненного файла
                    return $imageData;
                // } else {
                //     throw new \Exception("Не удалось загрузить изображение по URL: HTTP {$response->status()}");
                // }
            }
            Log::info("processImage результат", [
                'row' => $rowIndex, 
                'result' => $fileName ?? 'null'
            ]);
            // Предполагаем, что это имя файла (относительный путь)
            return $imageData;
    
        } catch (\Exception $e) {
            $errors[] = "Строка $rowIndex: Ошибка обработки изображения: {$e->getMessage()}";
            Log::error("Ошибка обработки изображения в строке $rowIndex", [
                'error' => $e->getMessage(),
                'imageData' => substr($imageData, 0, 100) . '...'
            ]);
            return null;
        }}

    protected function getExtensionFromUrl($url)
    {
        $path = parse_url($url, PHP_URL_PATH);
        if ($path) {
            $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
            if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                return $extension === 'jpeg' ? 'jpg' : $extension;
            }
        }
        return 'jpg'; // Значение по умолчанию
    }
}