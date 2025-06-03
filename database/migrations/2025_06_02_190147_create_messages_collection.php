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
        Schema::create('messages', function (Blueprint $table) {
            $table->id(); // Уникальный идентификатор сообщения
            $table->string('user_id'); // ID пользователя, отправившего сообщение
            $table->text('message'); // Текст сообщения пользователя
            $table->timestamps(); // created_at и updated_at
            $table->index('user_id'); // Индекс для быстрого поиска по user_id
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};