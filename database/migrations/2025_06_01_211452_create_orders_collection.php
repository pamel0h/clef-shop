<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Работаем с коллекцией orders через Schema Builder
        Schema::connection('mongodb')->table('orders', function (Blueprint $table) {
            // Создаем индексы для оптимизации запросов
            $table->index('user_id'); // Индекс для поиска по user_id
            $table->index('status'); // Индекс для фильтрации по статусу
            $table->index('created_at', null, ['sort' => -1]); // Индекс для сортировки по дате (убывающий)
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Удаляем коллекцию для отката
        Schema::connection('mongodb')->dropIfExists('orders');
    }
};