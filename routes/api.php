<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\AdminCatalogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TranslationController;

Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->put('/user/profile', [AuthController::class, 'updateProfile']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::put('/cart/update', [CartController::class, 'update']);
    Route::delete('/cart/remove/{productId}', [CartController::class, 'removeItem']);
    Route::delete('/cart/clear', [CartController::class, 'clear']);
    Route::post('/cart/sync', [CartController::class, 'sync']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/order', [OrderController::class, 'getOrder']);
    Route::post('/order/create', [OrderController::class, 'createOrder']);
    /*Route::put('/order/update', [CartController::class, 'updateOrder']);*/
});

Route::get('/search', [SearchController::class, 'search'])
     ->name('search');

Route::get('/catalog/data', [CatalogController::class, 'fetchData'])
     ->name('catalog.data');

Route::prefix('admin')->group(function () {
        Route::get('/catalog/data', [AdminCatalogController::class, 'fetchData'])->name('admin.catalog.data');
        Route::post('/catalog', [AdminCatalogController::class, 'store'])->name('admin.catalog.store');
        Route::put('/catalog/{id}', [AdminCatalogController::class, 'update'])->name('admin.catalog.update');
        Route::post('/catalog/{id}', [AdminCatalogController::class, 'update'])->name('admin.catalog.update.post');
        Route::delete('/catalog/{id}', [AdminCatalogController::class, 'destroy'])->name('admin.catalog.destroy');
        Route::get('/catalog/spec-keys', [AdminCatalogController::class, 'getSpecKeys'])->name('admin.catalog.spec-keys'); 
        Route::get('/catalog/brands', [AdminCatalogController::class, 'getBrands'])->name('admin.catalog.brands');
        Route::post('/catalog/translations', [TranslationController::class, 'store'])->name('admin.catalog.translation');
    });