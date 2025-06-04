<?php

namespace App\Services;

use App\Models\Item;
use Illuminate\Support\Facades\Response;

class CatalogExportService
{

    public function exportCatalog()
    {
        // Имя файла для скачивания
        $filename = 'catalog_export_' . date('Y-m-d_H-i-s') . '.csv';

        // Заголовки ответа
        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ];

        // Потоковая генерация CSV
        return Response::stream(function () {
            // Открываем поток вывода
            $handle = fopen('php://output', 'w');

            // Добавляем UTF-8 кодировку
            fwrite($handle, "\xEF\xBB\xBF");

            // Заголовки CSV
            $columns = [
                'id',
                'name',
                'description',
                'price',
                'category',
                'subcategory',
                'brand',
                'images',
                'specs',
                'discount',
                'created_at',
                'updated_at',
            ];
            fputcsv($handle, $columns);

            // Получаем все товары
            $items = Item::all();

            // Записываем данные для каждого товара
            foreach ($items as $item) {
                $row = [
                    (string) $item->_id, // монго дб ObjectId как строка
                    $item->name ?? '',
                    json_encode($item->description ?? [], JSON_UNESCAPED_UNICODE), // Сохраняем кириллицу как есть
                    $item->price ?? 0,
                    $item->category ?? '',
                    $item->subcategory ?? '',
                    $item->brand ?? '',
                    !empty($item->images) ? implode(',', $item->images) : '', // Массив images в строку
                    json_encode($item->specs ?? [], JSON_UNESCAPED_UNICODE), // Сохраняем кириллицу как есть
                    $item->discount ?? 0,
                    $item->created_at ? $item->created_at->toIso8601String() : '',
                    $item->updated_at ? $item->updated_at->toIso8601String() : '',
                ];
                fputcsv($handle, $row);
            }

            // Закрываем поток
            fclose($handle);
        }, 200, $headers);
    }
}