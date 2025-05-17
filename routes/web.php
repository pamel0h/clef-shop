<?php
use App\Http\Controllers\ItemController;
use App\Http\Controllers\CatalogController;
use Illuminate\Support\Facades\Route;

// Route::resource('items', ItemController::class)->names('items');

Route::get('/catalog/data', [CatalogController::class, 'fetchData'])
     ->name('catalog.data');
     
Route::get('/{any}', function () {
    return view('app'); 
})->where('any', '.*');

